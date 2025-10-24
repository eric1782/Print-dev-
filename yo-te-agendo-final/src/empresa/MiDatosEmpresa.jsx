import React, { useState } from "react";
import { doc, updateDoc, setDoc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const DIAS_SEMANA = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

const MiDatosEmpresa = ({ empresaData, servicios: serviciosProp = [], personal: personalProp = [] }) => {
  const [fotoPortadaError, setFotoPortadaError] = useState("");
  const portadaFileInput = React.useRef();
  const [fotoPerfilError, setFotoPerfilError] = useState("");
  const perfilFileInput = React.useRef();
  const [nuevoServicioError, setNuevoServicioError] = useState("");
  const nuevoServicioFileInput = React.useRef();
  // Referencia para input de foto de servicios
  const fileInputs = [];
  // Eliminar latitud y longitud de ubicacion al leer empresaData
  const cleanEmpresaData = { ...empresaData };
  if (cleanEmpresaData.ubicacion) {
    const { latitud, longitud, ...restUbicacion } = cleanEmpresaData.ubicacion;
    cleanEmpresaData.ubicacion = { ...restUbicacion };
  }
  const [form, setForm] = useState(cleanEmpresaData || {});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Servicios: agregar, editar, eliminar
  const convertirServicios = (servs) =>
    servs.map(s => ({
      ...s,
      tiempo: s.tiempo !== undefined ? Number(s.tiempo) : s.tiempo
    }));
  const [servicios, setServicios] = useState(convertirServicios(serviciosProp));
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", descripcion: "", precio: "", tiempo: "", foto: "" });

  // Horarios: inicializar con días preestablecidos si no existen
  const [horarios, setHorarios] = useState(() => {
    if (form.horarios && form.horarios.length > 0) return form.horarios;
    return DIAS_SEMANA.map(dia => ({ dia, rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] }));
  });

  // Actualiza campos del formulario
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleServicioChange = (idx, field, value) => {
    const updated = [...servicios];
    updated[idx][field] = value;
    setServicios(updated);
  };

  const handleAddServicio = () => {
    setServicios([...servicios, { ...nuevoServicio }]);
    setNuevoServicio({ nombre: "", descripcion: "", precio: "", tiempo: "", foto: "" });
  };

  const handleRemoveServicio = (idx) => {
    setServicios(servicios.filter((_, i) => i !== idx));
  };

  // Editar horario de un día
  const handleHorarioChange = (idx, field, value) => {
    const updated = [...horarios];
    updated[idx][field] = value;
    setHorarios(updated);
  };

  // Editar rango de horas de un día
  const handleRangoChange = (idx, rangoIdx, field, value) => {
    // Forzar formato HH:mm
    let newValue = value;
    // Si el usuario escribe solo 4 dígitos, lo convierte a HH:mm
    if (/^\d{4}$/.test(newValue)) {
      newValue = newValue.slice(0,2) + ':' + newValue.slice(2);
    }
    // Si el usuario escribe sin ":", lo intenta corregir
    if (/^\d{1,2}$/.test(newValue)) {
      // Ejemplo: "9" -> "09:00", "12" -> "12:00"
      newValue = newValue.padStart(2,'0') + ':00';
    }
    // Si el usuario escribe "930", lo convierte a "09:30"
    if (/^\d{3}$/.test(newValue)) {
      newValue = '0' + newValue.slice(0,1) + ':' + newValue.slice(1);
    }
    const updated = [...horarios];
    updated[idx].rangos[rangoIdx][field] = newValue;
    setHorarios(updated);
  };

  // Agregar/quitar días
  const handleAddDia = () => {
    setHorarios([
      ...horarios,
      { dia: "Nuevo Día", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] }
    ]);
  };
  const handleRemoveDia = (idx) => {
    setHorarios(horarios.filter((_, i) => i !== idx));
  };

  // Agregar/quitar rango horario
  const handleAddRango = (idx) => {
    const updated = [...horarios];
    updated[idx].rangos.push({ horaInicio: "", horaFin: "" });
    setHorarios(updated);
  };
  const handleRemoveRango = (idx, rangoIdx) => {
    const updated = [...horarios];
    updated[idx].rangos = updated[idx].rangos.filter((_, i) => i !== rangoIdx);
    setHorarios(updated);
  };

  // Guardar cambios en Firestore y sincronizar colecciones
  const handleSave = async () => {
      // Depuración: mostrar estado de autenticación y UID
      const auth = getAuth();
      console.log("Usuario autenticado:", auth.currentUser);
      if (!auth.currentUser) {
        setError("Error: No hay usuario autenticado. Inicia sesión antes de guardar.");
        setSaving(false);
        return;
      }
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No se encontró el UID del usuario");

      // Validación y corrección previa de datos
      const errores = [];
      // Convertir 'activo' si es string, y forzar a booleano si no es válido
      let activo = form.activo;
      if (typeof activo === "string") {
        if (activo === "true") activo = true;
        else if (activo === "false") activo = false;
      }
      if (typeof activo !== "boolean") {
        activo = true; // Valor por defecto si no es válido
      }

      // Convertir precios y tiempo de servicios si son string
      const serviciosValidados = servicios.map((serv, i) => {
        let precio = serv.precio;
        let tiempo = serv.tiempo;
        if (precio !== undefined && typeof precio !== "number") {
          const num = Number(precio);
          if (!isNaN(num)) precio = num;
        }
        if (tiempo !== undefined && typeof tiempo !== "number") {
          const numT = Number(tiempo);
          if (!isNaN(numT)) tiempo = numT;
        }
        if (precio !== undefined && typeof precio !== "number") errores.push(`servicios[${i}].precio`);
        if (tiempo !== undefined && typeof tiempo !== "number") errores.push(`servicios[${i}].tiempo`);
        return { ...serv, precio, tiempo };
      });

      // Limpiar duplicidad de campos en rangos de horarios
      const horariosLimpiados = horarios.map((h, i) => ({
        ...h,
        rangos: h.rangos.map((r, j) => {
          // Si existen ambos, prioriza horaInicio/horaFin
          const horaInicio = r.horaInicio || r.inicio || "";
          const horaFin = r.horaFin || r.fin || "";
          return { horaInicio, horaFin };
        })
      }));

      // Validar formato general de datos
      if (!form.nombreEmpresa || typeof form.nombreEmpresa !== "string") errores.push("nombreEmpresa");
      if (!form.direccion || typeof form.direccion !== "string") errores.push("direccion");
      if (!Array.isArray(horariosLimpiados)) errores.push("horarios");
      if (!Array.isArray(servicios)) errores.push("servicios");
      serviciosValidados.forEach((serv, i) => {
        if (!serv.nombre || typeof serv.nombre !== "string") errores.push(`servicios[${i}].nombre`);
      });
      horariosLimpiados.forEach((h, i) => {
        if (!h.dia || typeof h.dia !== "string") errores.push(`horarios[${i}].dia`);
        if (!Array.isArray(h.rangos)) errores.push(`horarios[${i}].rangos`);
        h.rangos.forEach((r, j) => {
          if (!r.horaInicio || typeof r.horaInicio !== "string") errores.push(`horarios[${i}].rangos[${j}].horaInicio`);
          if (!r.horaFin || typeof r.horaFin !== "string") errores.push(`horarios[${i}].rangos[${j}].horaFin`);
        });
      });

      // Eliminar ubicacion si es null y limpiar latitud/longitud
      let cleanForm = { ...form };
      if (cleanForm.ubicacion === null) {
        delete cleanForm.ubicacion;
      } else if (cleanForm.ubicacion) {
        const { latitud, longitud, ...restUbicacion } = cleanForm.ubicacion;
        cleanForm.ubicacion = { ...restUbicacion };
      }

      if (errores.length > 0) {
        setError("Error: Los siguientes campos tienen formato incorrecto o faltan datos: " + errores.join(", ") + ". Corrige los datos antes de guardar en Firebase.");
        setSaving(false);
        return;
      }

      // Log antes de guardar
      console.log("Objeto enviado a Firestore (antes de guardar):", {
        ...cleanForm,
        id: uid,
        activo,
        servicios: serviciosValidados,
        horarios: horariosLimpiados,
      });
  // Al editar servicios, convertir tiempo a número
  const handleEditServicio = (idx, updated) => {
    const nuevos = [...servicios];
    nuevos[idx] = {
      ...updated,
      tiempo: updated.tiempo !== undefined ? Number(updated.tiempo) : updated.tiempo
    };
    setServicios(nuevos);
  };

      if (!form.nombreEmpresa || typeof form.nombreEmpresa !== "string") errores.push("nombreEmpresa");
      if (!form.direccion || typeof form.direccion !== "string") errores.push("direccion");
      if (!Array.isArray(horarios)) errores.push("horarios");
      if (!Array.isArray(servicios)) errores.push("servicios");
      serviciosValidados.forEach((serv, i) => {
        if (!serv.nombre || typeof serv.nombre !== "string") errores.push(`servicios[${i}].nombre`);
      });
      horarios.forEach((h, i) => {
        if (!h.dia || typeof h.dia !== "string") errores.push(`horarios[${i}].dia`);
        if (!Array.isArray(h.rangos)) errores.push(`horarios[${i}].rangos`);
        h.rangos.forEach((r, j) => {
          if (!r.horaInicio || typeof r.horaInicio !== "string") errores.push(`horarios[${i}].rangos[${j}].horaInicio`);
          if (!r.horaFin || typeof r.horaFin !== "string") errores.push(`horarios[${i}].rangos[${j}].horaFin`);
        });
      });
      if (errores.length > 0) {
        setError("Error de validación en: " + errores.join(", "));
        setSaving(false);
        return;
      }

      const empresaRef = doc(db, "empresas", uid);
      console.log("Guardando empresa:", { uid, empresaDocId: empresaRef.id });
      // Verificar si el documento existe, si no, crearlo
      const empresaSnap = await import("firebase/firestore").then(m => m.getDoc(empresaRef));
      // Eliminar ubicacion si es null
  // (Eliminada declaración duplicada de cleanForm)
      if (cleanForm.ubicacion === null) {
        delete cleanForm.ubicacion;
      }
      let empresaObj;
      if (!empresaSnap.exists()) {
        empresaObj = {
          id: uid,
          nombreEmpresa: cleanForm.nombreEmpresa || "",
          direccion: cleanForm.direccion || "",
          activo,
          servicios: serviciosValidados,
          horarios: horariosLimpiados, // Fuerza solo los datos limpios
          ...cleanForm,
        };
        await setDoc(empresaRef, empresaObj);
      } else {
        empresaObj = {
          ...cleanForm,
          id: uid,
          activo,
          servicios: serviciosValidados,
          horarios: horariosLimpiados, // Fuerza solo los datos limpios
        };
        await setDoc(empresaRef, empresaObj, { merge: true });
      }

      // Log después de guardar
      const empresaDocAfter = await import("firebase/firestore").then(m => m.getDoc(empresaRef));
      console.log("Objeto en Firestore (después de guardar):", empresaDocAfter.exists() ? empresaDocAfter.data() : null);
      // Sincronizar servicios
      const serviciosCol = collection(db, "servicios");
      for (const serv of serviciosValidados) {
        const servId = serv.id || `${uid}_${serv.nombre}`;
        try {
          console.log("Guardando servicio:", { ...serv, empresaId: uid });
          await setDoc(doc(serviciosCol, servId), {
            ...serv,
            empresaId: uid,
          });
        } catch (err) {
          console.error("Error al guardar servicio", servId, err);
          setError(`Error al guardar servicio ${servId}: ${err.message}`);
          setSaving(false);
          return;
        }
      }
      // Sincronizar horarios
      const horariosCol = collection(db, "horarios");
      for (const h of horarios) {
        const horarioId = h.id || `${uid}_${h.dia}`;
        try {
          console.log("Guardando horario:", { ...h, empresaId: uid });
          await setDoc(doc(horariosCol, horarioId), {
            ...h,
            empresaId: uid,
          });
        } catch (err) {
          console.error("Error al guardar horario", horarioId, err);
          setError(`Error al guardar horario ${horarioId}: ${err.message}`);
          setSaving(false);
          return;
        }
      }
      setSuccess(true);
    } catch (err) {
      setError("Error al guardar: " + err.message);
    }
    setSaving(false);
  };

  // Cerrar sesión
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    window.location.href = "/";
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    {/* Portada y nombre */}
  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full h-full relative">
        {/* Portada: área completa clickeable si no hay imagen */}
        {form.fotoPortada ? (
          <img src={form.fotoPortada} alt="Portada" className="w-full h-full object-cover" style={{maxHeight:'192px'}} />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer"
            style={{position:'absolute', inset:0, zIndex:3}}
            onClick={() => portadaFileInput.current?.click()}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-purple-800 text-3xl font-bold">+</span>
            </div>
            <input
              type="file"
              accept="image/*"
              style={{display:'none'}}
              ref={portadaFileInput}
              onChange={e => {
                setFotoPortadaError("");
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  if (file.size > 500 * 1024) {
                    setFotoPortadaError("La imagen de portada es demasiado pesada (máx. 500 KB)");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    handleChange("fotoPortada", ev.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        )}
  {/* Overlay eliminado para fondo blanco puro */}
        {/* Foto de perfil círculo */}
        <div className="absolute left-4 bottom-4 z-10">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => perfilFileInput.current?.click()}
            style={{position:'relative'}}
          >
            {form.fotoPerfil ? (
              <img src={form.fotoPerfil} alt="Perfil" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-white text-3xl font-semibold">👤</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{display:'none'}}
              ref={perfilFileInput}
              onChange={e => {
                setFotoPerfilError("");
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  if (file.size > 500 * 1024) {
                    setFotoPerfilError("La imagen de perfil es demasiado pesada (máx. 500 KB)");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    handleChange("fotoPerfil", ev.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          {fotoPerfilError && <span className="text-red-500 text-xs mt-1 block">{fotoPerfilError}</span>}
          <span className="text-xs text-gray-400 block">Máx. 500 KB</span>
        </div>
      </div>
      {fotoPortadaError && <span className="text-red-500 text-xs absolute top-2 left-2 z-30">{fotoPortadaError}</span>}
      <span className="text-xs text-gray-400 absolute top-2 right-2 z-30">Máx. 500 KB</span>
    </div>

    {/* Nombre de la empresa entre portada e información */}
    <div className="max-w-3xl mx-auto px-4 mt-2 mb-2 flex justify-center">
  <div className="flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 p-2 sm:p-4 rounded-xl w-full">
        <input
          type="text"
          className="text-xl sm:text-2xl font-bold text-purple-800 drop-shadow-sm truncate bg-transparent outline-none text-center w-full"
          value={form.nombreEmpresa || ""}
          onChange={e => handleChange("nombreEmpresa", e.target.value)}
        />
      </div>
    </div>

    {/* Información de la empresa */}
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
            <span className="text-gray-600">🏢</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Información</h2>
        </div>
        <textarea className="w-full border rounded px-2 py-1" placeholder="Descripción" value={form.descripcion || ""} onChange={e => handleChange("descripcion", e.target.value)} />
        {/* Ubicación: solo mostrar dirección, no latitud ni longitud */}
        {form.ubicacion && form.ubicacion.direccion && (
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-1">Ubicación</h3>
            <div className="text-gray-700">{form.ubicacion.direccion}</div>
          </div>
        )}
      </div>
    </div>


      {/* Servicios visual tipo tarjeta */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <section className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-gray-600">💇</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Servicios</h2>
          </div>
          {servicios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-lg font-medium">No hay servicios disponibles</span>
            </div>
          ) : (
            servicios.map((serv, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-xl mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex-shrink-0">
                  <div style={{position:'relative'}}>
                    {serv.foto ? (
                      <img src={serv.foto} alt={serv.nombre} className="w-14 h-14 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm cursor-pointer" onClick={() => fileInputs[idx]?.click()} />
                    ) : (
                      <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200 cursor-pointer" onClick={() => fileInputs[idx]?.click()}>
                        <span className="text-lg">⚡</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{display:'none'}}
                      ref={el => fileInputs[idx] = el}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const updated = [...servicios];
                            updated[idx].foto = ev.target.result;
                            setServicios(updated);
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <input type="text" className="font-semibold text-gray-900 text-sm mb-1 transition-colors hover:text-gray-700 bg-transparent outline-none w-full" value={serv.nombre} onChange={e => handleServicioChange(idx, "nombre", e.target.value)} />
                  <textarea
                    className="text-gray-500 text-xs leading-relaxed transition-colors hover:text-gray-700 bg-transparent outline-none w-full resize-none rounded border border-gray-200 p-1"
                    style={{minHeight:'40px',maxHeight:'80px',overflow:'auto'}}
                    value={serv.descripcion}
                    onChange={e => handleServicioChange(idx, "descripcion", e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <input type="number" className="border rounded px-2 py-1 w-full sm:w-20" placeholder="Precio" value={serv.precio} onChange={e => handleServicioChange(idx, "precio", e.target.value)} />
                    <input type="number" className="border rounded px-2 py-1 w-full sm:w-20" placeholder="Tiempo (min)" value={serv.tiempo} onChange={e => handleServicioChange(idx, "tiempo", e.target.value)} />
                  </div>
                </div>
                <button className="text-red-600 w-full sm:w-auto mt-2 sm:mt-0" onClick={() => handleRemoveServicio(idx)}>Eliminar</button>
              </div>
            ))
          )}
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            <input type="text" className="border rounded px-2 py-1 w-full sm:w-32" placeholder="Nombre" value={nuevoServicio.nombre} onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })} />
            <div className="flex flex-col items-center justify-center w-full sm:w-32">
              <div
                className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200 cursor-pointer mb-2"
                onClick={() => nuevoServicioFileInput.current?.click()}
                style={{overflow:'hidden'}}
              >
                {nuevoServicio.foto ? (
                  <img src={nuevoServicio.foto} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                ) : (
                  <span className="text-lg">⚡</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                style={{display:'none'}}
                ref={nuevoServicioFileInput}
                onChange={e => {
                  setNuevoServicioError("");
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    if (file.size > 500 * 1024) {
                      setNuevoServicioError("La imagen es demasiado pesada (máx. 500 KB)");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setNuevoServicio({ ...nuevoServicio, foto: ev.target.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <span className="text-xs text-gray-400">Máx. 500 KB</span>
            </div>
            <input type="number" className="border rounded px-2 py-1 w-full sm:w-20" placeholder="Precio" value={nuevoServicio.precio} onChange={e => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })} />
            <input type="number" className="border rounded px-2 py-1 w-full sm:w-20" placeholder="Tiempo (min)" value={nuevoServicio.tiempo} onChange={e => setNuevoServicio({ ...nuevoServicio, tiempo: e.target.value })} />
            <textarea className="border rounded px-2 py-1 flex-1 w-full" placeholder="Descripción" value={nuevoServicio.descripcion} onChange={e => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })} />
            <button className="bg-green-600 text-white px-4 py-1 rounded w-full sm:w-auto" onClick={handleAddServicio}>Agregar</button>
            {nuevoServicioError && <span className="text-red-500 text-xs mt-1">{nuevoServicioError}</span>}
          </div>
        </section>

        {/* Horarios visual tipo tarjeta */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-gray-600">🕒</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Horarios</h2>
          </div>
          {horarios.length > 0 ? (
            <div className="space-y-3">
              {horarios.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center py-2">
                  <input type="text" className="font-medium text-gray-700 text-sm bg-transparent outline-none" value={h.dia} onChange={e => handleHorarioChange(idx, "dia", e.target.value)} />
                  <span className="text-gray-500 text-sm">
                    {h.rangos && h.rangos.length > 0
                      ? h.rangos.map((r, i) => (
                          <span key={i} className="block text-right">
                            <input type="text" className="border rounded px-2 py-1 w-20" placeholder="Inicio" value={r.horaInicio} onChange={e => handleRangoChange(idx, i, "horaInicio", e.target.value)} />
                            <input type="text" className="border rounded px-2 py-1 w-20" placeholder="Fin" value={r.horaFin} onChange={e => handleRangoChange(idx, i, "horaFin", e.target.value)} />
                          </span>
                        ))
                      : <span className="text-gray-400">Cerrado</span>}
                  </span>
                  <button className="text-red-600 ml-2" onClick={() => handleRemoveDia(idx)}>Quitar día</button>
                </div>
              ))}
              <button className="bg-green-100 text-green-700 px-4 py-1 rounded mt-2" onClick={handleAddDia}>Agregar día</button>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4 text-sm">Sin horarios disponibles.</p>
          )}
        </section>
      </div>

      {/* Contacto y ubicación igual que antes */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-gray-600">📞</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
          </div>
          <input
            type="text"
            className="w-full mb-2 border rounded px-2 py-1"
            placeholder="Instagram"
            value={form.contacto?.instagram || ""}
            onChange={(e) =>
              handleChange("contacto", {
                ...form.contacto,
                instagram: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full mb-2 border rounded px-2 py-1"
            placeholder="Facebook"
            value={form.contacto?.facebook || ""}
            onChange={(e) =>
              handleChange("contacto", {
                ...form.contacto,
                facebook: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full mb-2 border rounded px-2 py-1"
            placeholder="Teléfono"
            value={form.contacto?.telefono || ""}
            onChange={(e) =>
              handleChange("contacto", {
                ...form.contacto,
                telefono: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-gray-600">📍</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
          </div>
          <input
            type="text"
            className="w-full mb-2 border rounded px-2 py-1"
            placeholder="Dirección"
            value={form.direccion || ""}
            onChange={(e) => handleChange("direccion", e.target.value)}
          />
        </div>
      </div>

      {/* Botón guardar y mensajes */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {success && <div className="text-green-600 text-center mt-2">¡Cambios guardados!</div>}
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default MiDatosEmpresa;
