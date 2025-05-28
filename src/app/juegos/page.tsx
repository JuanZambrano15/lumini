// src/app/juegos/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import Image from 'next/image';
import Link from 'next/link';

// Avatares del niño
import ninoImage from "../../../public/actividades/hombre.webp";
import ninaImage from "../../../public/actividades/mujer.webp";
import noBinarioImage from "../../../public/actividades/no-binario.webp";
import defaultAvatarImage from "../../../public/actividades/no-binario.webp"; // Fallback o imagen neutra

// Fondo general de la página de juegos
import fondoJuegos from '../../../public/juego/fondo.png'; // Usa el fondo de campamento que proporcionaste

// Componente para las categorías
import CategoriaSelector from '../../components/CategoriaSelector';

// Imágenes de los juegos
// Asegúrate de tener estas imágenes en tu carpeta public/juegos/ o similar
// Y ajusta las rutas de importación según donde las guardes.
import ticTacToeIcon from '../../../public/juego/tiktaktoe.png'; // Ejemplo
import puzzleIcon from '../../../public/juego/puzzle.png'; // Ejemplo
import completaIcon from '../../../public/juego/completar.png'; // Ejemplo
import cuboIcon from '../../../public/juego/cubo.png'; // Ejemplo
import cartasIcon from '../../../public/juego/cartas.png'; // Ejemplo
import faltanteMemoriaIcon from '../../../public/juego/falta.png'; // Ejemplo
import dondeEstaIcon from '../../../public/juego/donde.png'; // Ejemplo
import coloresIcon from '../../../public/juego/pelota.png'; // Ejemplo
import faltanteAtencionIcon from '../../../public/juego/peces.png'; // Ejemplo
import laberintoIcon from '../../../public/juego/laberinto.png'; // Ejemplo
import coloreaIcon from '../../../public/juego/colorear.png'; // Ejemplo
import ositoIcon from '../../../public/juego/osito.png'

const JuegosPage = () => {
    const router = useRouter();
    const { user, loading, activeChildProfile } = useUser();
    const [displayedAvatarSrc, setDisplayedAvatarSrc] = useState(defaultAvatarImage.src);
    const [activeCategory, setActiveCategory] = useState<'razonamiento' | 'memoria' | 'atencion'>('razonamiento'); // Estado para la categoría activa

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (!loading && user && !activeChildProfile) {
            router.push('/biblioteca'); // Redirigir si no hay niño activo
            return;
        }

        if (activeChildProfile) {
            let selectedImage = defaultAvatarImage.src;
            switch (activeChildProfile.sexo) {
                case 'hombre':
                    selectedImage = ninoImage.src;
                    break;
                case 'mujer':
                    selectedImage = ninaImage.src;
                    break;
                case 'prefiero no decirlo':
                    selectedImage = noBinarioImage.src;
                    break;
                default:
                    selectedImage = defaultAvatarImage.src;
                    break;
            }
            setDisplayedAvatarSrc(selectedImage);
        }
    }, [user, loading, activeChildProfile, router]);

    if (loading || !user || !activeChildProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Cargando juegos...</p>
            </div>
        );
    }

    // Definir los juegos por categoría
    const juegosPorCategoria = {
        razonamiento: [
            { id: 'tic-tac-toe', name: 'TIC TAC TOE', icon: ticTacToeIcon },
            { id: 'puzzle', name: 'PUZLE', icon: puzzleIcon },
            { id: 'completa', name: 'COMPLETA', icon: completaIcon },
            { id: 'cubo', name: 'CUBO', icon: cuboIcon },
        ],
        memoria: [
            { id: 'cartas', name: 'CARTAS', icon: cartasIcon },
            { id: 'faltante', name: 'FALTANTE', icon: faltanteMemoriaIcon },
            { id: 'donde-esta', name: '¿DÓNDE ESTÁ?', icon: dondeEstaIcon },
            { id: 'colores', name: 'COLORES', icon: coloresIcon },
        ],
        atencion: [
            { id: 'faltante-atencion', name: 'FALTANTE', icon: faltanteAtencionIcon },
            { id: 'laberinto', name: 'LABERINTO', icon: laberintoIcon },
            { id: 'colorea', name: 'COLOREA', icon: coloreaIcon },
            { id: 'osito-blash', name: 'OSITO BLASH', icon: ositoIcon },
        ],
    };

    const currentGames = juegosPorCategoria[activeCategory];

    return (
        <div
            className="min-h-screen bg-cover bg-no-repeat bg-center p-4 flex flex-col items-center relative"
            style={{ backgroundImage: `url(${fondoJuegos.src})` }} // Fondo de campamento
        >
            {/* Contenedor principal de la "game zone" */}
            <div className="relative w-full max-w-6xl h-[600px] bg-[#AB90D6] rounded-[40px] shadow-2xl flex flex-col items-center pt-8 pr-12 pl-12 pb-4 overflow-hidden"
                    
            >
                

                {/* Seleccionador de Categorías (R M A y título) */}
                <CategoriaSelector
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Área de visualización de juegos (El "pizarrón" grande) */}
                <div className={`
                    w-full h-full bg-[#FFFAC7] rounded-xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center items-center
                    transition-opacity duration-500 ease-in-out
                `}>
                    {currentGames.map((game) => (
                        <Link
                            key={game.id} // Siempre usa una key única cuando mapees listas
                            href={`/juegos/${activeChildProfile.id}/${activeCategory}/${game.id}`}
                            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer w-[180px] h-[180px]" // Ajusta el tamaño de cada tarjeta de juego
                        >
                            <Image src={game.icon} alt={game.name} width={100} height={100} className="mb-2" />
                            <span className="text-lg font-semibold text-gray-700 text-center">{game.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Personaje del niño/a (avatar) - Posiciona abajo a la izquierda del CONTENEDOR PRINCIPAL */}
            <Image
                src={displayedAvatarSrc}
                alt={`Personaje ${activeChildProfile.sexo}`}
                width={250}
                height={250}
                className="absolute bottom-0 left-4 z-10" // Posicionamiento similar a la página de actividades
            />

            

            

            {/* Botón Salir - Posiciona abajo a la derecha del CONTENEDOR PRINCIPAL */}
            <Link href="/actividades" className="absolute bottom-4 right-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 z-10 text-lg font-semibold">
                Salir
            </Link>
        </div>
    );
};

export default JuegosPage;