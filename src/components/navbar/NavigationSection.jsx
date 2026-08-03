import React from "react";
import { Link } from "react-router-dom";

const NavigationSection = ({ currentPath }) => {
  const rol = Number(localStorage.getItem("ROL"));
  const esPadre = rol === 3;
  const esMaestro = rol === 2;

  const enlaces = esPadre
    ? [
        {
          href: "/mis-calificaciones",
          label: "Calificaciones",
          icon: "fas fa-star",
        },
        {
          href: "/pagos",
          label: "Pagos",
          icon: "fas fa-money-bill-wave",
        },
        {
          href: "/archivos",
          label: "Constancias",
          icon: "fas fa-folder",
        },
      ]
    : esMaestro
      ? [
          {
            href: "/panel-maestro",
            label: "Panel",
            icon: "fas fa-home",
          },
          {
            href: "/mis-alumnos",
            label: "Mis alumnos",
            icon: "fas fa-user-graduate",
          },
          {
            href: "/mis-notas",
            label: "Notas",
            icon: "fas fa-star",
          },
        ]
      : [
          {
            href: "/home",
            label: "Inicio",
            icon: "fas fa-home",
          },
          {
            href: "/clase",
            label: "Clases",
            icon: "fas fa-book-open",
          },
          {
            href: "/maestros",
            label: "Maestros",
            icon: "fas fa-chalkboard-teacher",
          },
          {
            href: "/grado",
            label: "Grados",
            icon: "fas fa-graduation-cap",
          },
          {
            href: "/padre",
            label: "Padres",
            icon: "fas fa-users",
          },
          {
            href: "/alumnos",
            label: "Alumnos",
            icon: "fas fa-user-graduate",
          },
          {
            href: "/calificaciones",
            label: "Calificaciones",
            icon: "fas fa-star",
          },
          {
            href: "/pagos",
            label: "Pagos",
            icon: "fas fa-money-bill-wave",
          },
          {
            href: "/archivos",
            label: "Archivos",
            icon: "fas fa-folder",
          },
        ];

  return (
    <>
      {enlaces.map((enlace) => {
        const activo = currentPath === enlace.href;

        return (
          <li key={enlace.href}>
            <Link
              className={`dashboard-menu-link ${activo ? "active" : ""}`}
              to={enlace.href}
            >
              <i className={enlace.icon}></i>
              <span>{enlace.label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default NavigationSection;