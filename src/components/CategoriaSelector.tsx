// src/components/CategoriaSelector.tsx
"use client";

import React from 'react';

interface CategoriaSelectorProps {
    activeCategory: 'razonamiento' | 'memoria' | 'atencion';
    onCategoryChange: (category: 'razonamiento' | 'memoria' | 'atencion') => void;
}

const CategoriaSelector: React.FC<CategoriaSelectorProps> = ({ activeCategory, onCategoryChange }) => {
    const categories = [
        { key: 'razonamiento', label: 'R', fullLabel: 'Razonamiento', color: 'bg-green-300' }, // Ejemplo de color, ajusta
        { key: 'memoria', label: 'M', fullLabel: 'Memoria', color: 'bg-yellow-300' }, // Ejemplo de color, ajusta
        { key: 'atencion', label: 'A', fullLabel: 'Atención', color: 'bg-pink-300' }, // Ejemplo de color, ajusta
    ];

    const getFullLabel = (key: string) => {
        const category = categories.find(cat => cat.key === key);
        return category ? category.fullLabel : '';
    };

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex bg-gray-200 rounded-full p-1 mb-4"> {/* Contenedor para las pestañas R M A */}
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => onCategoryChange(cat.key as 'razonamiento' | 'memoria' | 'atencion')}
                        className={`
                            px-4 py-2 rounded-full font-bold text-lg
                            transition-all duration-300
                            ${activeCategory === cat.key
                                ? `${cat.color} text-white` // Activo
                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400' // Inactivo
                            }
                        `}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            {/* Título de la categoría seleccionada */}
            <h2 className="text-4xl font-bold text-gray-800 italic">
                {getFullLabel(activeCategory)}
            </h2>
        </div>
    );
};

export default CategoriaSelector;