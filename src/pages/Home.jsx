import React, { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch } from "../store";
import alumnoFetchers from "../store/slices/Alumnos/fetchers";
import BannerSection from "../components/banner/BannerSection.jsx";

const Home = () => {
  const dispatch = useDispatch();

  const [alumnos, setAlumnos] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultadoAlumnos = await dispatch(
          alumnoFetchers.getAlumnos({
            url: "/alumnos",
          })
        );

        setAlumnos(resultadoAlumnos.payload?.alumnosInfo ?? []);

        const token = localStorage.getItem("SECURE");

        const [respuestaMaestros, respuestaGrados] = await Promise.all([
          axios.get("http://localhost:3000/api/maestros", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get("http://localhost:3000/api/grados", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setMaestros(
          Array.isArray(respuestaMaestros.data)
            ? respuestaMaestros.data
            : []
        );

        setGrados(
          Array.isArray(respuestaGrados.data)
            ? respuestaGrados.data
            : []
        );
      } catch (error) {
        console.error("Error al cargar los datos del inicio:", error);

        setAlumnos([]);
        setMaestros([]);
        setGrados([]);
      }
    };

    cargarDatos();
  }, [dispatch]);

  const stats = {
    totalAlumnos: alumnos.length,
    totalMaestros: maestros.length,
    gradosRegistrados: grados.length,
  };

  return <BannerSection stats={stats} />;
};

export default Home;