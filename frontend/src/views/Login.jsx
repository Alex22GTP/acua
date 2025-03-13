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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validación en tiempo real
    if (name === "email" && !validateEmail(value)) {
      setErrors({ ...errors, email: "Correo electrónico no válido" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("id_rol", data.id_rol);

          setModalMessage("Inicio de sesión exitoso");
          setShowModal(true);

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
          setFormData({
            nombre: "",
            apellido_paterno: "",
            apellido_materno: "",
            email: "",
            password: "",
            confirmPassword: "",
            id_rol: 2,
          });
          setTimeout(() => navigate("/"), 2000);
        } else {
          setModalMessage(data.message || "Error en el registro");
          setShowModal(true);
        }
      } catch (error) {
        setModalMessage("Error al conectar con el servidor");
        setShowModal(true);
      }
    }
    setIsLoading(false);
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
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
          </div>
          {!isLogin && (
            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
            </div>
          )}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
        </form>
        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
        </p>
      </div>

      {showModal && (
        <div className={`modal-overlay ${showModal ? "active" : ""}`}>
          <div className="modal-box">
            <p>{modalMessage}</p>
            <button className="modal-close-button" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}