import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "../utilities/Utilities";
import "../assets/css/login.css";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaShieldAlt,
  FaBookOpen,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [Usuario, setUsuario] = useState("");
  const [Password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensaje("");

    try {

     const response = await LogIn({
  url: "/signIn",
  data: {
    Id: Usuario,
    pass: Password,
  },
});

console.log("RESPONSE:", response);
console.log("RESPONSE.DATA:", response.data);
console.log("TOKEN:", response.data?.token);

if (response.data?.token) {
  localStorage.setItem("SECURE", response.data.token);
}

console.log("LOCAL:", localStorage.getItem("SECURE"));

      if (response.status === 200) {

        localStorage.setItem("TOKEN", response.data.token);
        localStorage.setItem("ROL", response.data.rolId);
        localStorage.setItem("USER_ID", response.data.userId);

        switch (response.data.rolId) {

  case 1:
    console.log("ADMIN");
    navigate("/home");
    break;

  case 2:
    console.log("MAESTRO");
    navigate("/maestros");
    break;

  case 3:
    console.log("PADRE");
    navigate("/mis-calificaciones");
    break;

  default:
    navigate("/");
    break;
}
      } else {

        setMensaje("Usuario o contraseña incorrectos");

      }

    } catch (error) {

      setMensaje("Usuario o contraseña incorrectos");

    }

  };
    return (
    <div className="login-page">

      <div className="login-overlay"></div>

      <div className="circle circle-left"></div>
      <div className="circle circle-right"></div>

      <div className="login-card">

        <img
          src="/images/logologin.png"
          alt="Logo"
          className="login-logo"
        />

        <h5 className="school-title">
          ESCUELA
        </h5>

        <h1 className="school-name">
          LUIS GAMERO
        </h1>

        <div className="line-title">

          <div className="line"></div>

          <FaBookOpen className="book-icon" />

          <div className="line"></div>

        </div>

        <h2 className="login-title">
          Iniciar sesión
        </h2>

        <form onSubmit={iniciarSesion}>

          {/* Usuario */}

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
            type="text"
            className="login-input"
            placeholder="Número de identidad"
            value={Usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          </div>

          {/* Contraseña */}

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={mostrarPassword ? "text" : "password"}
              className="login-input"
              placeholder="Contraseña"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
                        {mostrarPassword ? (

              <FaEyeSlash
                className="eye-icon"
                onClick={() => setMostrarPassword(false)}
                style={{ cursor: "pointer" }}
              />

            ) : (

              <FaEye
                className="eye-icon"
                onClick={() => setMostrarPassword(true)}
                style={{ cursor: "pointer" }}
              />

            )}

          </div>

          {/* Opciones */}

          <div className="options">

            <div className="remember-me">

              <input
                type="checkbox"
                className="form-check-input"
              />

              <label>Recordarme</label>

            </div>

            

          </div>

          {mensaje && (

            <div className="alert alert-danger mt-3">

              {mensaje}

            </div>

          )}
                    <button
            type="submit"
            className="login-btn"
          >
            <FaSignInAlt className="me-2" />
            <span>ACCEDER</span>
          </button>

        </form>

      </div>

      <div className="secure-text">

        <FaShieldAlt />

        <span>Sistema Escolar </span>

      </div>

    </div>
  );
};

export default Login;