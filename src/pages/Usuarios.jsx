import React, { useEffect, useMemo, useState } from "react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const token = localStorage.getItem("SECURE");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termino = buscar.trim();

    if (!termino) {
      return usuarios;
    }

    return usuarios.filter((usuario) =>
      String(usuario.userId).includes(termino)
    );
  }, [buscar, usuarios]);

  const obtenerNombreRol = (rolId) => {
    const rol = Number(rolId);

    if (rol === 1) return "Administrador";
    if (rol === 2) return "Maestro";
    if (rol === 3) return "Padre";

    return "Desconocido";
  };

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setMensaje("");

      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setUsuarios([]);
        setMensaje(data.message || "No se pudieron cargar los usuarios.");
        return;
      }

      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios([]);
      setMensaje("No se pudo conectar con la API.");
    } finally {
      setCargando(false);
    }
  };

  const cambiarPassword = async (event) => {
    event.preventDefault();
    setMensaje("");

    if (!usuarioSeleccionado) {
      setMensaje("Seleccione un usuario.");
      return;
    }

    if (password.length < 4) {
      setMensaje("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const res = await fetch(
        `http://localhost:3000/api/usuarios/${usuarioSeleccionado.userId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pass: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "No se pudo cambiar la contraseña.");
        return;
      }

      setMensaje(data.message || "Contraseña actualizada correctamente.");
      setPassword("");
      setConfirmarPassword("");
      setUsuarioSeleccionado(null);

      await cargarUsuarios();
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setMensaje("No se pudo conectar con la API.");
    } finally {
      setCargando(false);
    }
  };

  const cancelarCambio = () => {
    setUsuarioSeleccionado(null);
    setPassword("");
    setConfirmarPassword("");
    setMensaje("");
  };

  return (
    <section className="module-page">
      <div className="module-container">
        <div className="module-header">
          <span className="module-label">Administración</span>
          <h1>Gestión de usuarios</h1>
          <p>
            Busca a un usuario por su número de identidad y actualiza su
            contraseña.
          </p>
        </div>

        <div className="module-card mb-4">
          <h2 className="module-card-title">Buscar usuario</h2>

          <input
            type="text"
            className="form-control"
            placeholder="Escriba el número de identidad"
            value={buscar}
            onChange={(event) => setBuscar(event.target.value)}
          />
        </div>

        <div className="module-card mb-4">
          <div className="module-card-header">
            <div>
              <h2 className="module-card-title mb-1">
                Usuarios registrados
              </h2>

              <p className="module-card-description">
                Resultados encontrados: {usuariosFiltrados.length}
              </p>
            </div>
          </div>

          {cargando && usuarios.length === 0 ? (
            <p>Cargando usuarios...</p>
          ) : usuariosFiltrados.length === 0 ? (
            <p>No se encontraron usuarios.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Identidad</th>
                    <th>Rol</th>
                    <th>Restablecimiento pendiente</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.userId}>
                      <td>{usuario.userId}</td>

                      <td>{obtenerNombreRol(usuario.rolId)}</td>

                      <td>
                        {usuario.passwordResetRequired ? "Sí" : "No"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setUsuarioSeleccionado(usuario);
                            setPassword("");
                            setConfirmarPassword("");
                            setMensaje("");
                          }}
                        >
                          Cambiar contraseña
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {usuarioSeleccionado && (
          <div className="module-card">
            <h2 className="module-card-title">Cambiar contraseña</h2>

            <p>
              <strong>Identidad:</strong>{" "}
              {usuarioSeleccionado.userId}
            </p>

            <p>
              <strong>Rol:</strong>{" "}
              {obtenerNombreRol(usuarioSeleccionado.rolId)}
            </p>

            <form onSubmit={cambiarPassword}>
              <div className="mb-3">
                <label className="form-label">
                  Nueva contraseña
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={4}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={confirmarPassword}
                  onChange={(event) =>
                    setConfirmarPassword(event.target.value)
                  }
                  minLength={4}
                  required
                />
              </div>

              {mensaje && (
                <div className="alert alert-info">
                  {mensaje}
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={cargando}
                >
                  {cargando
                    ? "Guardando..."
                    : "Guardar contraseña"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarCambio}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {!usuarioSeleccionado && mensaje && (
          <div className="alert alert-info mt-3">
            {mensaje}
          </div>
        )}
      </div>
    </section>
  );
};

export default Usuarios;