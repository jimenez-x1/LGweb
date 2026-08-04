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

      if (response.status === 200) {
        const { token, rolId, userId } = response.data;

        if (!token) {
          setMensaje("El servidor no devolvió un token válido");
          return;
        }

        localStorage.setItem("SECURE", token);
        localStorage.setItem("ROL", String(rolId));
        localStorage.setItem("USER_ID", String(userId));

        switch (Number(rolId)) {
          case 1:
            navigate("/home");
            break;

          case 2:
            navigate("/panel-maestro");
            break;

          case 3:
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
      console.error("Error al iniciar sesión:", error);
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
          alt="Logo de la Escuela Luis Gamero"
          className="login-logo"
        />

        <h5 className="school-title">ESCUELA</h5>
        <h1 className="school-name">LUIS GAMERO</h1>

        <div className="line-title">
          <div className="line"></div>
          <FaBookOpen className="book-icon" />
          <div className="line"></div>
        </div>

        <h2 className="login-title">Iniciar sesión</h2>

        <form onSubmit={iniciarSesion}>
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
        <span>Sistema Escolar</span>
      </div>
    </div>
  );
};

export default Login;