import { RESTRICCIONES_TIEMPO } from './constants';


export const validarRUT = (rut) => {
  if (!rut) return false;
  const rutLimpio = rut.trim();
  const formatoValido = /^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rutLimpio);
  
  return formatoValido;
};

// Validar Email (Estándar)
export const validarEmail = (email) => {
  if (!email) return false;
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regexEmail.test(email);
};

// Validar Teléfono (Flexible: Acepta +569, 569, 9, y espacios)
export const validarTelefono = (telefono) => {
  if (!telefono) return false;
  // Permite: +56 9 1234 5678, 912345678, 56912345678
  const soloNumeros = telefono.replace(/\D/g, ''); 
  return soloNumeros.length >= 8 && soloNumeros.length <= 12;
};

// Validar formulario de reserva
export const validarFormularioReserva = (form, modoModificacion = false, userEmail = null) => {
  const errores = [];
  
  if (!modoModificacion) {
    if (!form.nombre?.trim()) {
      errores.push("El nombre es obligatorio");
    }
    
    // Validación de RUT
    if (!form.rut?.trim()) {
      errores.push("El RUT es obligatorio");
    } else if (!validarRUT(form.rut)) {
      errores.push("El RUT no tiene un formato válido (Ej: 12.345.678-9)");
    }
    
    // Validación de Teléfono
    if (!form.telefono?.trim()) {
      errores.push("El teléfono es obligatorio");
    } else if (!validarTelefono(form.telefono)) {
      errores.push("El teléfono debe tener al menos 8 dígitos");
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
  // Si RESTRICCIONES_TIEMPO no existe, usamos valor por defecto 24
  const limite = RESTRICCIONES_TIEMPO?.MODIFICAR_HORAS || 24; 
  return horasRestantes > limite;
};

// Validar si se puede cancelar una reserva
export const puedeCancelarReserva = (fechaReserva) => {
  const horasRestantes = calcularHorasRestantes(fechaReserva);
  const limite = RESTRICCIONES_TIEMPO?.CANCELAR_HORAS || 24;
  return horasRestantes > limite;
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
  if (!horarios) return { esValido: true, errores: [] };

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