"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Asegúrate de tener estas imágenes en tu carpeta public/actividades/icons o similar
// Y ajusta las rutas de importación según donde las guardes.
import tutorialIcon from '../../public/estudio/tutorial.webp'; // EJEMPLO DE RUTA
import actividadesIcon from '../../public/estudio/actividad.webp'; // EJEMPLO DE RUTA
import evaluacionIcon from '../../public/estudio/resultados.webp'; // EJEMPLO DE RUTA

interface TemaDropdownProps {
    id: string; // ID único del tema (ej. '1' para Conteo)
    title: string; // Título del tema (ej. '1. Conteo y números del 1 al 20')
    childId?: string; // ID del niño activo para las rutas
}

const TemaDropdown: React.FC<TemaDropdownProps> = ({ id, title, childId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full bg-[#BF9773]  rounded-xl shadow-lg mb-4 overflow-hidden">
            {/* Cabecera del tema */}
            <div
                className="flex justify-between items-center p-4 cursor-pointer text-gray-800 text-2xl font-semibold italic"
                onClick={toggleOpen}
            >
                <span>{title}</span>
                {/* Icono de flecha que rota */}
                <svg
                    className={`w-8 h-8 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </div>

            {/* Contenido expandible */}
            <div
                className={`grid grid-rows-[0fr] transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] py-4' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden"> {/* Oculta el contenido cuando no está expandido */}
                    <div className="flex justify-around items-center px-30">
                        {/* Opción Tutorial */}
                        <Link href={`/actividades/${childId}/tema/${id}/tutorial`} className="flex flex-col items-center p-3">
                            <Image src={tutorialIcon} alt="Tutorial" width={90} height={90} />
                            <span className="mt-2 text-gray-700 font-medium">TUTORIAL</span>
                        </Link>
                        {/* Opción Actividades */}
                        <Link href={`/actividades/${childId}/tema/${id}/ejercicios`} className="flex flex-col items-center p-3">
                            <Image src={actividadesIcon} alt="Actividades" width={90} height={90} />
                            <span className="mt-2 text-gray-700 font-medium">ACTIVIDADES</span>
                        </Link>
                        {/* Opción Evaluación */}
                        <Link href={`/actividades/${childId}/tema/${id}/evaluacion`} className="flex flex-col items-center p-3">
                            <Image src={evaluacionIcon} alt="Evaluación" width={90} height={90} />
                            <span className="mt-2 text-gray-700 font-medium">EVALUACIÓN</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemaDropdown;