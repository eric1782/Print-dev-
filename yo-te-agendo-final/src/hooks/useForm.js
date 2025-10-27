import { useState, useCallback } from 'react';
import { validarFormularioReserva, validarDatosEmpresa, validarServicio } from '../utils/validationUtils';

/**
 * Hook personalizado para manejar formularios con validación
 */
export const useForm = (initialValues = {}, validationType = 'reserva', userEmail = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    let validationResult;
    
    switch (validationType) {
      case 'reserva':
        validationResult = validarFormularioReserva(values, false, userEmail);
        break;
      case 'empresa':
        validationResult = validarDatosEmpresa(values);
        break;
      case 'servicio':
        validationResult = validarServicio(values);
        break;
      default:
        validationResult = { esValido: true, errores: [] };
    }

    if (!validationResult.esValido) {
      const fieldErrors = {};
      validationResult.errores.forEach(error => {
        // Extraer el nombre del campo del error
        const fieldMatch = error.match(/^El (\w+)/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1].toLowerCase();
          fieldErrors[fieldName] = error;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [values, validationType, userEmail]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValue,
    setError,
    isValid: Object.keys(errors).length === 0
  };
};
