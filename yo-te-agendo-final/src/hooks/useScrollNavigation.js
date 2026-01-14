import { useState, useRef } from 'react';

/**
 * Hook para manejar la navegación por scroll y tabs
 */
export const useScrollNavigation = (tabs) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'servicios');
  
  // Crear refs para cada sección
  const refs = tabs.reduce((acc, tab) => {
    acc[tab.id] = useRef(null);
    return acc;
  }, {});

  // Función para scrollear suavemente a una sección
  const scrollToSection = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && refs[tabId]?.current) {
      setActiveTab(tabId);
      refs[tabId].current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  return {
    activeTab,
    refs,
    scrollToSection
  };
};
