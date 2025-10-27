// Constantes centralizadas para toda la aplicación

export const DIAS_SEMANA = [
  { nombre: 'Lun', dia: 'Lunes' },
  { nombre: 'Mar', dia: 'Martes' },
  { nombre: 'Mié', dia: 'Miércoles' },
  { nombre: 'Jue', dia: 'Jueves' },
  { nombre: 'Vie', dia: 'Viernes' },
  { nombre: 'Sáb', dia: 'Sábado' },
  { nombre: 'Dom', dia: 'Domingo' }
];

export const DIAS_SEMANA_COMPLETOS = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

export const ROLES = {
  USUARIO: 'usuario',
  EMPRESA: 'empresa',
  ADMIN: 'admin'
};

export const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  COMPLETADA: 'completada'
};

export const TIPOS_NOTIFICACION = {
  NUEVA_RESERVA: 'nueva_reserva',
  MODIFICACION_RESERVA: 'modificacion_reserva',
  CANCELACION_RESERVA: 'cancelacion_reserva',
  SOLICITUD_EDICION: 'solicitud-edicion'
};

export const RESTRICCIONES_TIEMPO = {
  MODIFICAR_HORAS: 24,
  CANCELAR_HORAS: 12
};

export const VALIDACIONES = {
  RUT_PATTERN: /^[0-9]+-[0-9kK]{1}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO_PATTERN: /^(\+?56)?[2-9]\d{8}$/
};

export const MENSAJES = {
  ERROR: {
    USUARIO_NO_AUTENTICADO: "Debes iniciar sesión para realizar esta acción.",
    CAMPOS_OBLIGATORIOS: "Todos los campos son obligatorios.",
    RESERVA_NO_ENCONTRADA: "No se encontró la reserva especificada.",
    HORARIO_NO_DISPONIBLE: "El horario seleccionado no está disponible.",
    FECHA_PASADA: "No puedes reservar en fechas pasadas.",
    MODIFICACION_EXPIRADA: "Solo puedes modificar reservas hasta 24 horas antes.",
    CANCELACION_EXPIRADA: "Solo puedes cancelar reservas hasta 12 horas antes."
  },
  SUCCESS: {
    RESERVA_CREADA: "¡Reserva creada exitosamente!",
    RESERVA_MODIFICADA: "¡Reserva modificada exitosamente!",
    RESERVA_CANCELADA: "¡Reserva cancelada exitosamente!",
    PERFIL_ACTUALIZADO: "Perfil actualizado correctamente.",
    NOTIFICACION_ENVIADA: "Notificación enviada correctamente."
  }
};

export const CONFIGURACION = {
  HORARIOS_DEFAULT: {
    LUNES: { inicio: "09:00", fin: "18:00" },
    MARTES: { inicio: "09:00", fin: "18:00" },
    MIERCOLES: { inicio: "09:00", fin: "18:00" },
    JUEVES: { inicio: "09:00", fin: "18:00" },
    VIERNES: { inicio: "09:00", fin: "18:00" },
    SABADO: { inicio: "10:00", fin: "14:00" },
    DOMINGO: { inicio: "00:00", fin: "00:00" }
  },
  DURACION_SERVICIO_DEFAULT: 60, // minutos
  PAGINACION: {
    LIMITE_EMPRESAS: 10,
    LIMITE_RESERVAS: 20,
    LIMITE_NOTIFICACIONES: 50
  }
};
