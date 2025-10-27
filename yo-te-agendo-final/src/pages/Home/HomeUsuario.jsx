import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useReservas, useEmpresas, useModal } from "../../hooks";
import NotificacionesUsuario from "../../usuario/NotificacionesUsuario";
import ReservarPopup from "../../components/ReservarPopup";
import EditarCitaPopup from "../../components/EditarCitaPopup";
import { NavbarUsuario, ListaEmpresas, ListaReservas, ModalCancelarReserva } from "../../components/HomeUsuario";

function HomeUsuario() {
  const [vistaActual, setVistaActual] = useState("empresas");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("proximas");
  const [loadingAccion, setLoadingAccion] = useState(false);

  // Hooks para modales
  const modalModificar = useModal();
  const modalEditarCita = useModal();
  const modalCancelar = useModal();

  // Hooks personalizados
  const { 
    reservas, 
    loading: loadingReservas, 
    cancelarReserva, 
    obtenerEstadoReserva,
    resetearTodasLasReservas
  } = useReservas();
  const { 
    empresas, 
    loading: loadingEmpresas, 
    buscarEmpresas 
  } = useEmpresas();

  const user = auth.currentUser;

  // Solicitud de edición de cita
  const solicitarEdicionCita = ({ id, nuevaFecha, mensaje, empresaId, servicio }) => {
    // Notificación SOLO para la empresa, no para el usuario
    // TODO: Implementar notificación usando hook
    console.log('Solicitud de edición:', { id, nuevaFecha, mensaje, empresaId, servicio });
  };

  // Handlers
  const handleCancelarReserva = async (mensaje) => {
    if (!modalCancelar.data) return;
    setLoadingAccion(true);
    try {
      const resultado = await cancelarReserva(modalCancelar.data.id, mensaje);
      if (resultado.success) {
        modalCancelar.closeModal();
      }
    } catch (error) {
      console.error('Error cancelando reserva:', error);
    } finally {
      setLoadingAccion(false);
    }
  };

  const handleEditarReserva = (reserva) => {
    modalEditarCita.openModal(reserva);
  };

  const handleModificarReserva = (reserva) => {
    modalModificar.openModal(reserva);
  };

  // Filtrar empresas por búsqueda
  const empresasFiltradas = busqueda ? buscarEmpresas(busqueda) : empresas;

  // Adjuntar empresaData a cada reserva
  const reservasConEmpresa = reservas.map(reserva => ({
    ...reserva,
    empresaData: empresas.find(e => e.id === reserva.empresaId) || {}
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación */}
      <NavbarUsuario 
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
      />
      
      <div className="max-w-full sm:max-w-5xl mx-auto p-2 sm:p-6">
        {vistaActual === "misReservas" && (
          <ListaReservas
            reservas={reservasConEmpresa}
            loading={loadingReservas}
            categoriaSeleccionada={categoriaSeleccionada}
            onCambiarCategoria={setCategoriaSeleccionada}
            onModificarReserva={handleModificarReserva}
            onEditarReserva={handleEditarReserva}
            onCancelarReserva={(reserva) => modalCancelar.openModal(reserva)}
            obtenerEstadoReserva={obtenerEstadoReserva}
            resetearTodasLasReservas={resetearTodasLasReservas}
          />
        )}

        {vistaActual === "empresas" && (
          <ListaEmpresas
            empresas={empresasFiltradas}
            loading={loadingEmpresas}
            busqueda={busqueda}
            onBuscar={setBusqueda}
          />
        )}

        {vistaActual === "notificaciones" && (
            <NotificacionesUsuario />
        )}
      </div>

      {/* Modales */}
      {modalModificar.isOpen && (
              <ReservarPopup
          servicio={modalModificar.data?.servicio}
          empresa={modalModificar.data?.empresa}
          onClose={modalModificar.closeModal}
                modoModificacion={true}
          reservaAModificar={modalModificar.data}
        />
      )}

      {modalEditarCita.isOpen && (
        <EditarCitaPopup
          reserva={modalEditarCita.data}
          onClose={modalEditarCita.closeModal}
          onSolicitarEdicion={solicitarEdicionCita}
        />
      )}

      <ModalCancelarReserva
        isOpen={modalCancelar.isOpen}
        onClose={modalCancelar.closeModal}
        reserva={modalCancelar.data}
        onConfirmar={handleCancelarReserva}
        loading={loadingAccion}
      />
    </div>
  );
}

export default HomeUsuario;