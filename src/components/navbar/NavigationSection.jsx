import React from "react";
import { Link } from "react-router-dom";

const NavigationSection = () => {

  const rol = Number(localStorage.getItem("ROL"));
  const esPadre = rol === 3;
  const esMaestro = rol === 2;

  const enlaces = esPadre
    ? [
        { href: "/mis-calificaciones", label: "Calificaciones" },
        { href: "/pagos", label: "Pagos" },
        { href: "/archivos", label: "Constancias" }
      ]
      : esMaestro
? [
    { href: "/panel-maestro", label: "Panel" },
    { href: "/mis-alumnos", label: "Mis alumnos" },
   { href: "/mis-notas", label: "Notas" }
  ]
    : [
        { href: "/home", label: "Inicio" },
        { href: "/clase", label: "Clase" },
        { href: "/grado", label: "Grado" },
        { href: "/alumnos", label: "Alumnos" },
        { href: "/maestros", label: "Maestros" },
        { href: "/calificaciones", label: "Calificaciones" },
        { href: "/pagos", label: "Pagos" },
        { href: "/padre", label: "Padres" },
        { href: "/archivos", label: "Archivos" }
      ];

  return (
    <>
      {enlaces.map((enlace) => (
        <li key={enlace.href}>
          <Link className="dropdown-item" to={enlace.href}>
            {enlace.label}
          </Link>
        </li>
      ))}
    </>
  );

};

export default NavigationSection;