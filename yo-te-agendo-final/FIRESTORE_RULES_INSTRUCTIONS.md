# Instrucciones para actualizar las reglas de Firestore

## Problema actual:

- Los usuarios no pueden leer las reservas debido a permisos insuficientes
- Error: "Missing or insufficient permissions"

## Solución:

1. Ve a la **Consola de Firebase**: https://console.firebase.google.com
2. Selecciona tu proyecto: **printdev-52b49**
3. Ve a **Firestore Database** en el menú lateral
4. Haz clic en la pestaña **"Reglas"**
5. **Reemplaza las reglas existentes** con el contenido del archivo `firestore.rules`
6. Haz clic en **"Publicar"**

## ¿Qué hacen estas reglas?

- ✅ **Empresas**: Todos pueden leer (perfiles públicos), solo el dueño puede escribir
- ✅ **Servicios**: Todos pueden leer (mostrar servicios), solo la empresa puede escribir
- ✅ **Personal**: Todos pueden leer (mostrar equipo), solo la empresa puede escribir
- ✅ **Reservas**:
  - Solo usuarios logueados pueden crear reservas
  - Los usuarios ven sus propias reservas
  - Las empresas ven las reservas hechas en su negocio
  - Tanto usuario como empresa pueden actualizar/cancelar reservas

## Después de aplicar las reglas:

1. Actualiza la página web (F5)
2. Inicia sesión con un usuario
3. Intenta hacer una reserva
4. Las horas ocupadas deberían mostrarse correctamente
5. Las reservas deberían aparecer en HomeUsuario

## Si sigues teniendo problemas:

- Verifica que el usuario esté correctamente logueado
- Revisa la consola del navegador para errores específicos
- Asegúrate de que las reglas se hayan publicado correctamente

## Comando para desplegar (si usas Firebase CLI):

```bash
firebase deploy --only firestore:rules
```
