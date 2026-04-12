import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMaestros, updateMaestro, getGrados } from "../store/slices/Maestros/fetchers";

const EditarMaestro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ID_Maestro: "",
    Nombre: "",
    Apellido: "",
    Telefono: "",
    Correo: "",
    ID_Grado: "",
  });
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    getMaestros()
      .then((data) => {
        const maestro = (data ?? []).find((m) => m.ID_Maestro === parseInt(id));
        if (maestro) setForm(maestro);
      })
      .catch((error) => console.error(error));

    getGrados()
      .then((data) => setGrados(data ?? []))
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMaestro(form);
      alert("Maestro actualizado correctamente");
      navigate("/maestros");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar maestro");
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Formulario</h5>
              <h2>Editar Maestro</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Nombre"
                    value={form.Nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Apellido"
                    value={form.Apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Telefono"
                    value={form.Telefono || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    name="Correo"
                    value={form.Correo || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Grado</label>
                  <select
                    className="form-control"
                    name="ID_Grado"
                    value={form.ID_Grado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un grado</option>
                    {grados.map((g) => (
                      <option key={g.ID_Grado} value={g.ID_Grado}>
                        {g.Nombre_Grado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-warning">
                    Actualizar Maestro
                  </button>
                  <Link to="/maestros" className="btn btn-secondary">
                    Cancelar
                  </Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditarMaestro;