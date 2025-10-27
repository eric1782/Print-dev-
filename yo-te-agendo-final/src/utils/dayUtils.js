/**
 * Utilidades para manejo de días de la semana
 * Maneja mayúsculas, minúsculas, tildes y abreviaciones
 */

/**
 * Normaliza un día de la semana a formato estándar
 * @param {string} dia - Día a normalizar
 * @returns {string} - Día normalizado (ej: "Lunes", "Martes", etc.)
 */
export const normalizarDia = (dia) => {
  if (!dia || typeof dia !== 'string') return dia;
  
  // Mapeo de variaciones de días a formato estándar
  const mapeoDias = {
    // Lunes
    'lunes': 'Lunes', 'Lunes': 'Lunes', 'LUNES': 'Lunes',
    'lun': 'Lunes', 'Lun': 'Lunes', 'LUN': 'Lunes',
    'l': 'Lunes', 'L': 'Lunes',
    
    // Martes
    'martes': 'Martes', 'Martes': 'Martes', 'MARTES': 'Martes',
    'mar': 'Martes', 'Mar': 'Martes', 'MAR': 'Martes',
    'm': 'Martes', 'M': 'Martes',
    
    // Miércoles
    'miercoles': 'Miércoles', 'miércoles': 'Miércoles', 'Miércoles': 'Miércoles', 'MIÉRCOLES': 'Miércoles',
    'mier': 'Miércoles', 'miér': 'Miércoles', 'Mier': 'Miércoles', 'Miér': 'Miércoles', 'MIER': 'Miércoles', 'MIÉR': 'Miércoles',
    'x': 'Miércoles', 'X': 'Miércoles',
    
    // Jueves
    'jueves': 'Jueves', 'Jueves': 'Jueves', 'JUEVES': 'Jueves',
    'jue': 'Jueves', 'Jue': 'Jueves', 'JUE': 'Jueves',
    'j': 'Jueves', 'J': 'Jueves',
    
    // Viernes
    'viernes': 'Viernes', 'Viernes': 'Viernes', 'VIERNES': 'Viernes',
    'vie': 'Viernes', 'Vie': 'Viernes', 'VIE': 'Viernes',
    'v': 'Viernes', 'V': 'Viernes',
    
    // Sábado
    'sabado': 'Sábado', 'sábado': 'Sábado', 'Sabado': 'Sábado', 'Sábado': 'Sábado', 'SABADO': 'Sábado', 'SÁBADO': 'Sábado',
    'sab': 'Sábado', 'sáb': 'Sábado', 'Sab': 'Sábado', 'Sáb': 'Sábado', 'SAB': 'Sábado', 'SÁB': 'Sábado',
    's': 'Sábado', 'S': 'Sábado',
    
    // Domingo
    'domingo': 'Domingo', 'Domingo': 'Domingo', 'DOMINGO': 'Domingo',
    'dom': 'Domingo', 'Dom': 'Domingo', 'DOM': 'Domingo',
    'd': 'Domingo', 'D': 'Domingo'
  };
  
  const diaLimpio = dia.trim().toLowerCase();
  return mapeoDias[diaLimpio] || dia; // Si no encuentra coincidencia, devuelve el original
};

/**
 * Obtiene el día de la semana de una fecha
 * @param {Date|string} fecha - Fecha a procesar
 * @returns {string} - Día de la semana normalizado
 */
export const obtenerDiaSemana = (fecha) => {
  let fechaObj;
  
  if (typeof fecha === 'string') {
    // Si es string en formato YYYY-MM-DD, parsear manualmente
    if (fecha.includes('-')) {
      const [año, mes, dia] = fecha.split('-');
      fechaObj = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    } else {
      fechaObj = new Date(fecha);
    }
  } else {
    fechaObj = fecha;
  }
  
  const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
  return normalizarDia(diaSemana);
};

/**
 * Verifica si dos días son iguales (ignorando mayúsculas, minúsculas y tildes)
 * @param {string} dia1 - Primer día
 * @param {string} dia2 - Segundo día
 * @returns {boolean} - True si son iguales
 */
export const sonDiasIguales = (dia1, dia2) => {
  return normalizarDia(dia1) === normalizarDia(dia2);
};
