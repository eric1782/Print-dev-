import { VALIDACIONES, RESTRICCIONES_TIEMPO } from './constants';

/**
 * Utilidades para validaciones de formularios y datos
 */

// Validar RUT chileno
export const validarRUT = (rut) => {
  if (!rut) return false;
  return VALIDACIONES.RUT_PATTERN.test(rut);
};

// Validar email
export const validarEmail = (email) => {
  if (!email) return false;
  return VALIDACIONES.EMAIL_PATTERN.test(email);
};

// Validar teléfono chileno
export const validarTelefono = (telefono) => {
  if (!telefono) return false;
  return VALIDACIONES.TELEFONO_PATTERN.test(telefono);
};

// Validar formulario de reserva
export const validarFormularioReserva = (form, modoModificacion = false, userEmail = null) => {
  const errores = [];
  
  if (!modoModificacion) {
    if (!form.nombre?.trim()) {
      errores.push("El nombre es obligatorio");
    }
    if (!form.rut?.trim()) {
      errores.push("El RUT es obligatorio");
    } else if (!validarRUT(form.rut)) {
      errores.push("El RUT no tiene un formato válido");
    }
    if (!form.telefono?.trim()) {
      errores.push("El teléfono es obligatorio");
    } else if (!validarTelefono(form.telefono)) {
      errores.push("El teléfono no tiene un formato válido");
    }
    
    // Validar correo: usar userEmail si está disponible, sino form.correo
    const correoAValidar = userEmail || form.correo;
    
    if (!correoAValidar?.trim()) {
      errores.push("El correo es obligatorio");
    } else if (!validarEmail(correoAValidar)) {
      errores.push("El correo no tiene un formato válido");
    }
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Validar si se puede modificar una reserva
export const puedeModificarReserva = (fechaReserva) => {
  const horasRestantes = calcularHorasRestantes(fechaReserva);
  return horasRestantes > RESTRICCIONES_TIEMPO.MODIFICAR_HORAS;
};

// Validar si se puede cancelar una reserva
export const puedeCancelarReserva = (fechaReserva) => {
  const horasRestantes = calcularHorasRestantes(fechaReserva);
  return horasRestantes > RESTRICCIONES_TIEMPO.CANCELAR_HORAS;
};

// Calcular horas restantes (función auxiliar)
const calcularHorasRestantes = (fecha) => {
  const ahora = new Date();
  const fechaComparar = fecha instanceof Date ? fecha : new Date(fecha);
  return (fechaComparar.getTime() - ahora.getTime()) / (1000 * 60 * 60);
};

// Validar horarios de trabajo
export const validarHorarios = (horarios) => {
  const errores = [];
  
  horarios.forEach((horario, index) => {
    if (!horario.dia) {
      errores.push(`El día ${index + 1} no tiene nombre`);
    }
    
    if (!horario.rangos || horario.rangos.length === 0) {
      errores.push(`El día ${horario.dia} no tiene horarios definidos`);
    } else {
      horario.rangos.forEach((rango, rangoIndex) => {
        if (!rango.inicio || !rango.fin) {
          errores.push(`El rango ${rangoIndex + 1} del día ${horario.dia} está incompleto`);
        } else if (rango.inicio >= rango.fin) {
          errores.push(`El rango ${rangoIndex + 1} del día ${horario.dia} tiene horario inválido`);
        }
      });
    }
  });
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Validar datos de empresa
export const validarDatosEmpresa = (empresaData) => {
  const errores = [];
  
  if (!empresaData.nombreEmpresa?.trim()) {
    errores.push("El nombre de la empresa es obligatorio");
  }
  
  if (!empresaData.email?.trim()) {
    errores.push("El email es obligatorio");
  } else if (!validarEmail(empresaData.email)) {
    errores.push("El email no tiene un formato válido");
  }
  
  if (!empresaData.telefono?.trim()) {
    errores.push("El teléfono es obligatorio");
  } else if (!validarTelefono(empresaData.telefono)) {
    errores.push("El teléfono no tiene un formato válido");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Validar datos de servicio
export const validarServicio = (servicio) => {
  const errores = [];
  
  if (!servicio.nombre?.trim()) {
    errores.push("El nombre del servicio es obligatorio");
  }
  
  if (!servicio.precio || isNaN(Number(servicio.precio)) || Number(servicio.precio) <= 0) {
    errores.push("El precio debe ser un número mayor a 0");
  }
  
  if (!servicio.tiempo || isNaN(Number(servicio.tiempo)) || Number(servicio.tiempo) <= 0) {
    errores.push("La duración debe ser un número mayor a 0");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};
