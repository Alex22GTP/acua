import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Asegúrate de tener este archivo CSS para los estilos

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_rol: 2, // Por defecto, el rol es 2 (usuario normal)
  });
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validación en tiempo real para el correo electrónico
    if (name === "email" && !validateEmail(value)) {
      setErrors({ ...errors, email: "Correo electrónico no válido" });
    } else {
      setErrors({ ...errors, email: "" });
    }

    // Validación en tiempo real para la contraseña
    if (name === "password" && value.length < 8) {
      setErrors({ ...errors, password: "La contraseña debe tener al menos 8 caracteres" });
    } else {
      setErrors({ ...errors, password: "" });
    }

    // Validación en tiempo real para confirmar contraseña
    if (name === "confirmPassword" && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: "Las contraseñas no coinciden" });
    } else {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  // Manejar el envío del formulario (login o registro)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar la longitud de la contraseña antes de enviar el formulario
    if (formData.password.length < 8) {
      setModalMessage("La contraseña debe tener al menos 8 caracteres");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      // Lógica para el login
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await response.json();
        if (response.ok) {
          // Guardar datos en localStorage
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("id_rol", data.id_rol); // Guardar el id_rol
          localStorage.setItem("userName", data.nombre); // Guardar el nombre del usuario

          setModalMessage("Inicio de sesión exitoso");
          setShowModal(true);

          setTimeout(() => {
            setShowModal(false); // Cierra el modal antes de redirigir

            // Redirigir según el rol
            if (data.id_rol === 1) {
              navigate("/admin"); // Redirigir a la interfaz de administrador
            } else {
              navigate("/"); // Redirigir a la interfaz de usuario normal
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
      // Lógica para el registro
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
          setModalMessage("Registro exitoso.");
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

          setTimeout(() => {
            setShowModal(false); // Cierra el modal
            setIsLogin(true); // Cambia al formulario de inicio de sesión
          }, 2000);
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
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input
                  type="text"
                  name="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input
                  type="text"
                  name="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          {!isLogin && (
            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
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