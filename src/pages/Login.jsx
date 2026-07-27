import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "../utilities/Utilities";
import "../assets/css/login.css";

import {
  FaUser,
  FaLock,
  FaEye,
  FaUserShield,
  FaChalkboardTeacher,
  FaUsers,
  FaSignInAlt,
  FaShieldAlt,
  FaBookOpen,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [Correo, setCorreo] = useState("");
  const [Password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const response = await LogIn({
      url: "/login",
      data: {
        Correo,
        Password,
      },
    });

    if (response.status === 200) {
      navigate("/home");
    } else {
      setMensaje("Correo o contraseña incorrectos");
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
              type="email"
              className="login-input"
              placeholder="Correo"
              value={Correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

          </div>

          {/* Contraseña */}

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FaEye className="eye-icon" />

          </div>

          {/* Opciones */}

          <div className="options">

            <div className="remember-me">

              <input
                type="checkbox"
                className="form-check-input"
              />

              <label>Recordar contraseña</label>

            </div>

            <a href="#">
              ¿Olvidaste tu contraseña?
            </a>

          </div>

          {/* Roles */}

          <div className="roles">

            <button
              type="button"
              className="role admin"
            >
              <FaUserShield />
              <span>Admin</span>
            </button>

            <button
              type="button"
              className="role teacher"
            >
              <FaChalkboardTeacher />
              <span>Profesor</span>
            </button>

            <button
              type="button"
              className="role parent"
            >
              <FaUsers />
              <span>Padres</span>
            </button>

          </div>

          {mensaje && (
            <div className="alert alert-danger mt-2">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            <FaSignInAlt />
            <span>ACCEDER</span>
          </button>

        </form>

      </div>

      <div className="secure-text">
        <FaShieldAlt />
      </div>

    </div>
  );
};

export default Login;