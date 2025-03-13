import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_rol: 2,
  });
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await response.json();
        if (response.ok) {
          // Guardar sesión en localStorage
          localStorage.setItem("userId", data.userId);

          setModalMessage("Inicio de sesión exitoso");
          setShowModal(true);

          // Redirección según el rol
          setTimeout(() => {
            if (data.id_rol === 1) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 2000);
        } else {
          setModalMessage(data.message || "Credenciales incorrectas");
          setShowModal(true);
        }
      } catch (error) {
        setModalMessage("Error al conectar con el servidor");
        setShowModal(true);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setModalMessage("Las contraseñas no coinciden");
        setShowModal(true);
        return;
      }
      try {
        // Eliminar confirmPassword antes de enviar los datos al backend
        const { confirmPassword, ...dataToSend } = formData;

        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        const data = await response.json();
        if (response.ok) {
          setModalMessage("Registro exitoso");
          setShowModal(true);
          setTimeout(() => navigate("/home"), 2000);
        } else {
          setModalMessage(data.message || "Error en el registro");
          setShowModal(true);
        }
      } catch (error) {
        setModalMessage("Error al conectar con el servidor");
        setShowModal(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? "login" : "register"} animate-transition`}>
        <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} required />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {!isLogin && (
            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}
          <button type="submit" className="auth-button">
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
        </form>
        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}