import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "../utilities/Utilities";

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
      navigate("/");
    } else {
      setMensaje("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">

          <h2 className="text-center mb-4">Iniciar Sesión</h2>

          <form onSubmit={iniciarSesion}>

            <div className="mb-3">
              <label>Correo</label>
              <input
                type="email"
                className="form-control"
                value={Correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mensaje && (
              <div className="alert alert-danger">
                {mensaje}
              </div>
            )}

            <button className="btn btn-primary w-100">
              Iniciar Sesión
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;