# Estructura de Firebase para Sistema de Reservas

## Colección: `personal`

Cada documento del personal debe tener la siguiente estructura:

```javascript
{
  // ID único del personal (generado automáticamente por Firebase)
  id: "personal_id_123",

  // Información básica
  nombre: "María González",
  apellido: "Silva",
  especialidad: "Peluquería y Coloración",
  telefono: "+56912345678",
  email: "maria@empresa.com",

  // Relación con la empresa
  empresaId: "empresa_id_456", // Debe coincidir con el ID de la empresa

  // Estado del personal
  activo: true, // true = activo, false = inactivo

  // Servicios que puede realizar (opcional)
  servicios: [
    "servicio_id_789", // IDs de servicios
    "Corte de cabello", // O nombres de servicios
    "Coloración"
  ],

  // Horarios de trabajo del personal
  horarios: [
    {
      dia: "Lunes",
      rangos: [
        {
          horaInicio: "09:00",
          horaFin: "13:00"
        },
        {
          horaInicio: "14:00",
          horaFin: "18:00"
        }
      ]
    },
    {
      dia: "Martes",
      rangos: [
        {
          horaInicio: "10:00",
          horaFin: "19:00"
        }
      ]
    },
    {
      dia: "Miércoles",
      rangos: [
        {
          horaInicio: "09:00",
          horaFin: "17:00"
        }
      ]
    },
    {
      dia: "Jueves",
      rangos: [
        {
          horaInicio: "09:00",
          horaFin: "18:00"
        }
      ]
    },
    {
      dia: "Viernes",
      rangos: [
        {
          horaInicio: "09:00",
          horaFin: "19:00"
        }
      ]
    },
    {
      dia: "Sábado",
      rangos: [
        {
          horaInicio: "09:00",
          horaFin: "15:00"
        }
      ]
    }
    // Domingo: no incluido = no trabaja
  ],

  // Información adicional
  fechaContratacion: new Date("2024-01-15"),
  foto: "url_de_la_foto.jpg", // opcional

  // Metadatos
  fechaCreacion: new Date(),
  fechaActualizacion: new Date()
}
```

## Ejemplo de otro personal:

```javascript
{
  id: "personal_id_124",
  nombre: "Carlos Rodríguez",
  apellido: "Pérez",
  especialidad: "Barbería y Afeitado",
  telefono: "+56987654321",
  email: "carlos@empresa.com",
  empresaId: "empresa_id_456",
  activo: true,
  servicios: [
    "Corte masculino",
    "Afeitado",
    "Arreglo de barba"
  ],
  horarios: [
    {
      dia: "Lunes",
      rangos: [
        {
          horaInicio: "08:00",
          horaFin: "16:00"
        }
      ]
    },
    {
      dia: "Martes",
      rangos: [
        {
          horaInicio: "08:00",
          horaFin: "16:00"
        }
      ]
    },
    {
      dia: "Miércoles",
      rangos: [
        {
          horaInicio: "10:00",
          horaFin: "18:00"
        }
      ]
    },
    {
      dia: "Jueves",
      rangos: [
        {
          horaInicio: "08:00",
          horaFin: "16:00"
        }
      ]
    },
    {
      dia: "Viernes",
      rangos: [
        {
          horaInicio: "08:00",
          horaFin: "18:00"
        }
      ]
    },
    {
      dia: "Sábado",
      rangos: [
        {
          horaInicio: "08:00",
          horaFin: "14:00"
        }
      ]
    }
  ],
  fechaContratacion: new Date("2023-06-10"),
  fechaCreacion: new Date(),
  fechaActualizacion: new Date()
}
```

## Validaciones importantes:

1. **Horarios del personal vs. empresa**: Los horarios del personal deben estar dentro de los horarios de apertura de la empresa.

2. **Servicios**: El personal puede tener servicios específicos o trabajar con todos los servicios (si no se especifica el campo `servicios`).

3. **Días laborales**: Solo se muestran días donde el personal tiene horarios definidos.

4. **Rangos de horarios**: Se permiten múltiples rangos por día (ej: mañana y tarde con pausa para almuerzo).

## Cómo agregar personal a Firebase:

1. Ve a Firebase Console > Firestore Database
2. Crear colección llamada "personal"
3. Agregar documentos con la estructura de arriba
4. Asegúrate de que `empresaId` coincida con el ID de tu empresa
