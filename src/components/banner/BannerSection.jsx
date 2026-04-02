import React from "react";
import { Link } from "react-router-dom";

const BannerSection = () => {
  return (
    <section style={{ padding: "60px 0 30px 0", background: "#f8fafc" }}>
      <div className="container">
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "50px 40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h5 style={{ color: "#2563eb", marginBottom: "10px" }}>
            SISTEMA ESCOLAR
          </h5>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "15px",
            }}
          >
            Gestión de Alumnos
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#475569",
              maxWidth: "700px",
              marginBottom: "25px",
            }}
          >
            Visualiza y administra la información de los alumnos de forma clara,
            rápida y ordenada.
          </p>

          <Link
            to="/alumnos"
            style={{
              display: "inline-block",
              background: "#f97316",
              color: "white",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Ver alumnos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;