interface GradoConSeccion {
    ID_Grado: number | string;
    Nombre_Grado?: string;
    Nombre?: string;
    Seccion?: string | null;
    Anio?: number | string | null;
}

interface MapaSecciones {
    [key: string]: string;
}

// Devuelve un mapa ID_Grado -> texto de sección a mostrar.
// Si el grado (nombre + año) solo tiene una sección registrada,
// muestra "Única" en lugar de la letra ("A" o "B").
export function obtenerSeccionesUnicas(grados: GradoConSeccion[]): MapaSecciones {
    const conteo: { [clave: string]: Set<string> } = {};

    grados.forEach((g) => {
        const clave = `${g.Nombre_Grado || g.Nombre || ""}|${g.Anio ?? ""}`;
        if (!conteo[clave]) conteo[clave] = new Set();
        if (g.Seccion) conteo[clave].add(g.Seccion);
    });

    const mapa: MapaSecciones = {};

    grados.forEach((g) => {
        const clave = `${g.Nombre_Grado || g.Nombre || ""}|${g.Anio ?? ""}`;
        const secciones = conteo[clave] || new Set();
        const id = String(g.ID_Grado);
        mapa[id] = secciones.size === 1 ? "Única" : g.Seccion || "";
    });

    return mapa;
}
