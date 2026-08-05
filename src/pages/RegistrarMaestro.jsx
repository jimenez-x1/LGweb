import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerSeccionesUnicas } from "../utilities/seccionUnica";
import { API_URL } from "../utilities/axiosConfig";
import Swal from "sweetalert2";

const RegistrarMaestro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    DNI: "",
    Nombre: "",
    Apellido: "",
    Telefono: "",
    Correo: "",
    Cargo: "Docente",
    ID_Grado: "",
  });

  const [grados, setGrados] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const mapaSecciones = obtenerSeccionesUnicas(grados);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const res = await fetch(`${API_URL}/grados`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "No se pudieron cargar los grados"
          );
        }

        setGrados(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar grados:", error);
        setGrados([]);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los grados",
          confirmButtonText: "Aceptar",
        });
      }
    };

    fetchGrados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.DNI.length !== 13) {
      await Swal.fire({
        icon: "warning",
        title: "Identidad inválida",
        text: "El DNI debe contener exactamente 13 dígitos",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    if (guardando) return;

    setGuardando(true);

    try {
      const datosMaestro = {
        DNI: form.DNI.trim(),
        Nombre: form.Nombre.trim(),
        Apellido: form.Apellido.trim(),
        Telefono: form.Telefono.trim(),
        Correo: form.Correo.trim(),
        Cargo: form.Cargo,
        ID_Grado: form.ID_Grado
          ? Number(form.ID_Grado)
          : null,
      };

      const res = await fetch(
        `${API_URL}/insertMaestro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
          },
          body: JSON.stringify(datosMaestro),
        }
      );

      const resultado = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          resultado.message || "No se pudo registrar el maestro"
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Registrado",
        text: "Maestro registrado correctamente",
        confirmButtonText: "Aceptar",
      });

      navigate("/maestros");
    } catch (error) {
      console.error("Error al registrar maestro:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo registrar el maestro",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="module-page">
      <div className="module-container">

        <div className="module-header">
          <span className="module-label">
            Gestión académica
          </span>

          <h1>Registrar maestro</h1>

          <p>
            Completa la información personal y académica del nuevo maestro.
          </p>
        </div>

        <div className="module-card">
          <div className="module-card-header">
            <div>
              <h2 className="module-card-title mb-1">
                Información del maestro
              </h2>

              <p className="module-card-description">
                Completa los datos necesarios para registrar al maestro.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Número de identidad
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="DNI"
                  placeholder="Ej: 0801199912345"
                  maxLength={13}
                  value={form.DNI}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, "");

                    setForm((prev) => ({
                      ...prev,
                      DNI: valor,
                    }));
                  }}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Nombre
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="Nombre"
                  placeholder="Ej: María"
                  value={form.Nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Apellido
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="Apellido"
                  placeholder="Ej: Hernández"
                  value={form.Apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Teléfono
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="Telefono"
                  placeholder="Ej: 9999-9999"
                  value={form.Telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Correo
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="Correo"
                  placeholder="Ej: maestro@email.com"
                  value={form.Correo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Cargo
                </label>

                <select
                  className="form-select"
                  name="Cargo"
                  value={form.Cargo}
                  onChange={handleChange}
                  required
                >
                  <option value="Docente">
                    Docente
                  </option>

                  <option value="Administrativo">
                    Administrativo
                  </option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Grado asignado
                </label>

                <select
                  className="form-select"
                  name="ID_Grado"
                  value={form.ID_Grado}
                  onChange={handleChange}
                >
                  <option value="">
                    Sin grado asignado
                  </option>

                  {grados.map((grado) => (
                    <option
                      key={grado.ID_Grado}
                      value={grado.ID_Grado}
                    >
                      {grado.Nombre_Grado}
                      {mapaSecciones[grado.ID_Grado]
                        ? ` - Sección ${mapaSecciones[grado.ID_Grado]}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button
                type="submit"
                className="module-primary-btn"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : "Guardar maestro"}
              </button>

              <Link
                to="/maestros"
                className="btn btn-secondary module-secondary-btn"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default RegistrarMaestro;