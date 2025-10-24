import React, { useState, useEffect } from "react";
import MinimalistaTrabajadorCard from "./MinimalistaTrabajadorCard";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const defaultTrabajador = {
  nombre: "",
  apellido: "",
  especialidad: "",
  telefono: "",
  email: "",
  servicios: [],
  horarios: [],
};

const MisTrabajadores = ({ servicios = [], onAdd, onEdit, onDelete }) => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [serviciosEmpresa, setServiciosEmpresa] = useState(servicios);
  useEffect(() => {
    // Crear diccionario de servicios {id: nombre}
    const serviciosMap = {}; // Crear diccionario de servicios {id: nombre}
    (serviciosEmpresa || []).forEach(s => {
      serviciosMap[s.id] = s.nombre;
    });
    // Consultar todos los trabajadores de la colección 'personal'
    const fetchTrabajadores = async () => {
      try {
        const snap = await getDocs(collection(db, "personal"));
        const trabajadoresMapeados = snap.docs.map(doc => {
          const data = doc.data();
          // Mapear array de IDs a nombres
          let serviciosNombres = [];
          if (Array.isArray(data.servicios)) {
            serviciosNombres = data.servicios.map(sid => serviciosMap[sid] ? serviciosMap[sid] : 'Servicio no encontrado');
          }
          // Asegurar horarios como array
          let horarios = Array.isArray(data.horarios) ? data.horarios : [];
          return {
            ...data,
            servicios: serviciosNombres,
            horarios,
            id: doc.id,
          };
        });
        setTrabajadores(trabajadoresMapeados);
      } catch (err) {
        setTrabajadores([]);
      }
    };
    fetchTrabajadores();
  }, [serviciosEmpresa]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [trabajador, setTrabajador] = useState(defaultTrabajador);

  // Abrir modal para agregar o editar
  const openModal = async (idx = null) => {
    if (idx !== null) {
      // Cargar datos actualizados desde Firebase (modular)
      try {
        const trabajadorId = trabajadores[idx].id;
        const docRef = doc(db, "personal", trabajadorId);
        const docSnap = await getDocs(query(collection(db, "personal"), where("id", "==", trabajadorId)));
        let data = null;
        if (!docSnap.empty) {
          data = docSnap.docs[0].data();
        } else {
          // fallback: getDoc
          const singleDoc = await import("firebase/firestore").then(m => m.getDoc(docRef));
          if (singleDoc.exists()) {
            data = singleDoc.data();
          }
        }
        if (data) {
          // Normalizar horarios para el modal
          let horarios = Array.isArray(data.horarios) ? data.horarios.map(h => {
            if (h.dia && h.horaInicio && h.horaFin) {
              return {
                dia: h.dia,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
                habilitado: h.habilitado !== false
              };
            }
            if (h.dia && h.rangos && Array.isArray(h.rangos) && h.rangos.length > 0) {
              return {
                dia: h.dia,
                horaInicio: h.rangos[0].inicio,
                horaFin: h.rangos[0].fin,
                habilitado: h.habilitado !== false
              };
            }
            // Si el formato es string tipo 'Lunes:10:00 - 18:00'
            if (typeof h === 'string' && h.includes(':') && h.includes('-')) {
              const [diaParte, horasParte] = h.split(':');
              const [inicio, fin] = horasParte.split('-').map(s => s.trim());
              return {
                dia: diaParte.trim(),
                horaInicio: inicio,
                horaFin: fin,
                habilitado: true
              };
            }
            // Si no coincide, dejar vacío
            return {
              dia: '',
              horaInicio: '',
              horaFin: '',
              habilitado: true
            };
          }) : [];
          setTrabajador({
            ...data,
            id: trabajadorId,
            servicios: Array.isArray(data.servicios) ? data.servicios : [],
            horarios,
          });
        } else {
          setTrabajador(trabajadores[idx]);
        }
      } catch (err) {
        setTrabajador(trabajadores[idx]);
      }
      setEditIndex(idx);
    } else {
      setTrabajador(defaultTrabajador);
      setEditIndex(null);
    }
    setModalOpen(true);
  };

  // Guardar trabajador
  const handleSave = async () => {
    if (editIndex !== null) {
      // Actualizar todos los campos en Firebase
      try {
        const docId = trabajadores[editIndex].id;
        const docRef = doc(db, "personal", docId);
        let serviciosIds = [];
        if (Array.isArray(trabajador.servicios)) {
          serviciosIds = serviciosEmpresa
            .filter(s => trabajador.servicios.includes(s.nombre))
            .map(s => s.id);
        }
        let horariosGuardados = Array.isArray(trabajador.horarios)
          ? trabajador.horarios.map(h => ({
              dia: h.dia || "",
              horaInicio: h.horaInicio || "",
              horaFin: h.horaFin || "",
              habilitado: h.habilitado !== false
            }))
          : [];
        await updateDoc(docRef, {
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          especialidad: trabajador.especialidad,
          telefono: trabajador.telefono,
          email: trabajador.email,
          servicios: serviciosIds,
          horarios: horariosGuardados,
        });
        // Refrescar lista de trabajadores tras editar
        const snap = await getDocs(collection(db, "personal"));
        const serviciosMap = {};
        (serviciosEmpresa || []).forEach(s => { serviciosMap[s.id] = s.nombre; });
        const trabajadoresMapeados = snap.docs.map(doc => {
          const data = doc.data();
          let serviciosNombres = [];
          if (Array.isArray(data.servicios)) {
            serviciosNombres = data.servicios.map(sid => serviciosMap[sid] ? serviciosMap[sid] : 'Servicio no encontrado');
          }
          let horarios = Array.isArray(data.horarios) ? data.horarios : [];
          return {
            ...data,
            servicios: serviciosNombres,
            horarios,
            id: doc.id,
          };
        });
        setTrabajadores(trabajadoresMapeados);
      } catch (err) {
        console.error("Error actualizando trabajador en Firebase:", err);
      }
      onEdit && onEdit(editIndex, trabajador);
    } else {
      let serviciosIds = [];
      if (Array.isArray(trabajador.servicios)) {
        serviciosIds = serviciosEmpresa
          .filter(s => trabajador.servicios.includes(s.nombre))
          .map(s => s.id);
      }
      let horariosGuardados = Array.isArray(trabajador.horarios)
        ? trabajador.horarios.map(h => ({
            dia: h.dia || "",
            horaInicio: h.horaInicio || "",
            horaFin: h.horaFin || "",
            habilitado: h.habilitado !== false
          }))
        : [];
      onAdd && onAdd({
        ...trabajador,
        servicios: serviciosIds,
        horarios: horariosGuardados,
      });
    }
    setModalOpen(false);
    setTrabajador(defaultTrabajador);
    setEditIndex(null);
  };

  // Eliminar trabajador
  const handleDelete = (idx) => {
    if (window.confirm("¿Seguro que quieres eliminar este trabajador?")) {
      onDelete && onDelete(idx);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Trabajadores</h2>
        {/* Botón moderno para agregar trabajador */}
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform flex items-center justify-center gap-2"
          onClick={() => openModal()}
        >
          <span className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span>Agregar</span>
        </button>
      </div>

      {trabajadores.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No hay trabajadores registrados.</div>
      ) : (
  <div className="flex flex-row gap-3 overflow-x-auto pb-2 w-full justify-center mx-auto sm:flex-wrap sm:overflow-x-visible">
          {trabajadores.map((trab, idx) => (
            <div key={trab.id || idx} className="min-w-[260px] max-w-xs flex-shrink-0">
              <MinimalistaTrabajadorCard trabajador={trab} onEdit={() => openModal(idx)} onDelete={() => handleDelete(idx)} />
            </div>
          ))}
        </div>
      )}

      {/* Modal agregar/editar trabajador */}
      {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-0">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button className="sticky top-2 right-2 float-right bg-gray-100 rounded-full p-2 text-gray-600 shadow hover:bg-gray-200 z-10" onClick={() => setModalOpen(false)} title="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 clear-both">{editIndex !== null ? "Editar" : "Nuevo"} trabajador</h3>
              <div className="space-y-2 sm:space-y-4">
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base" placeholder="Nombre" value={trabajador.nombre} onChange={e => setTrabajador({ ...trabajador, nombre: e.target.value })} />
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base" placeholder="Apellido" value={trabajador.apellido} onChange={e => setTrabajador({ ...trabajador, apellido: e.target.value })} />
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base" placeholder="Especialidad" value={trabajador.especialidad} onChange={e => setTrabajador({ ...trabajador, especialidad: e.target.value })} />
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base" placeholder="Teléfono" value={trabajador.telefono} onChange={e => setTrabajador({ ...trabajador, telefono: e.target.value })} />
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base" placeholder="Email" value={trabajador.email} onChange={e => setTrabajador({ ...trabajador, email: e.target.value })} />
                {/* Servicios del trabajador */}
                <div className="mt-2 sm:mt-4">
                  <div className="font-semibold text-sm text-indigo-700 mb-2">Servicios</div>
                  <div className="flex flex-wrap gap-2">
                    {serviciosEmpresa.map(serv => (
                      <label key={serv.id || serv.nombre} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trabajador.servicios.includes(serv.nombre)}
                          onChange={e => {
                            let nuevosServicios = trabajador.servicios.includes(serv.nombre)
                              ? trabajador.servicios.filter(s => s !== serv.nombre)
                              : [...trabajador.servicios, serv.nombre];
                            setTrabajador({ ...trabajador, servicios: nuevosServicios });
                          }}
                        />
                        {serv.nombre}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Editor de horarios */}
                <div className="mt-2 sm:mt-4">
                  <div className="font-semibold text-sm text-indigo-700 mb-2">Horarios</div>
                  {trabajador.horarios && trabajador.horarios.length > 0 ? (
                    <div className="space-y-2">
                      {trabajador.horarios.map((h, idx) => (
                        <div key={h.id || idx} className="flex flex-row flex-wrap gap-2 items-center w-full">
                          <select className="border rounded px-1 py-1 w-24 max-w-full text-xs" value={h.dia} onChange={e => {
                            const horarios = [...trabajador.horarios];
                            horarios[idx].dia = e.target.value;
                            setTrabajador({ ...trabajador, horarios });
                          }}>
                            <option value="">Día</option>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                          </select>
                          <input type="time" className="border rounded px-1 py-1 w-20 max-w-full text-xs" value={h.horaInicio} onChange={e => {
                            const horarios = [...trabajador.horarios];
                            horarios[idx].horaInicio = e.target.value;
                            setTrabajador({ ...trabajador, horarios });
                          }} />
                          <span className="text-xs">a</span>
                          <input type="time" className="border rounded px-1 py-1 w-20 max-w-full text-xs" value={h.horaFin} onChange={e => {
                            const horarios = [...trabajador.horarios];
                            horarios[idx].horaFin = e.target.value;
                            setTrabajador({ ...trabajador, horarios });
                          }} />
                          {/* Habilitar/deshabilitar horario */}
                          <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={h.habilitado !== false}
                              onChange={e => {
                                const horarios = [...trabajador.horarios];
                                horarios[idx].habilitado = e.target.checked;
                                setTrabajador({ ...trabajador, horarios });
                              }}
                            />
                            {h.habilitado !== false ? "Activo" : "Inactivo"}
                          </label>
                          <button className="text-red-500 text-xs px-1" onClick={() => {
                            const horarios = trabajador.horarios.filter((_, i) => i !== idx);
                            setTrabajador({ ...trabajador, horarios });
                          }}>Eliminar</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mb-2">Sin horarios asignados</div>
                  )}
                  <button className="mt-2 px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold w-full sm:w-auto" onClick={e => {
                    e.preventDefault();
                    setTrabajador({
                      ...trabajador,
                      horarios: [...(trabajador.horarios || []), { dia: "", horaInicio: "", horaFin: "", habilitado: true }]
                    });
                  }}>+ Agregar horario</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-8">
                <button className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all text-sm sm:text-base" onClick={handleSave}>{editIndex !== null ? "Guardar" : "Agregar"}</button>
                <button className="flex-1 px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all text-sm sm:text-base" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default MisTrabajadores;
