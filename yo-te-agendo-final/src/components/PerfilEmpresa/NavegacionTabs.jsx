import React from 'react';

/**
 * Componente de navegación por tabs
 */
const NavegacionTabs = ({ tabs, activeTab, onTabClick }) => {
  return (
    <nav className="sticky top-16 z-40 bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 backdrop-blur-md border-b">
      <div 
        className="overflow-x-auto" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        <div className="flex px-4 py-2 gap-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap rounded-full transform ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 hover:scale-102"
              }`}
              style={{ scrollBehavior: 'smooth' }}
            >
              <span className="mr-2 transition-transform duration-300">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavegacionTabs;
