import Swal from "sweetalert2";

const colorPrincipal = "#ff7a45";

export const mostrarExito = (mensaje: string) => {
  return Swal.fire({
    icon: "success",
    title: "¡Operación exitosa!",
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: colorPrincipal,
  });
};

export const mostrarError = (mensaje: string) => {
  return Swal.fire({
    icon: "error",
    title: "Ocurrió un error",
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: colorPrincipal,
  });
};

export const mostrarAdvertencia = (mensaje: string) => {
  return Swal.fire({
    icon: "warning",
    title: "Atención",
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: colorPrincipal,
  });
};

export const confirmarEliminacion = (registro = "este registro") => {
  return Swal.fire({
    icon: "warning",
    title: "¿Está seguro?",
    text: `Se eliminará ${registro}. Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
  });
};