// src/app/estudio/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import Image from 'next/image';
import tabla from "../../../public/estudio/tabla.png"
import Link from 'next/link';
import nino from "../../../public/actividades/hombre.webp"
import nina from "../../../public/actividades/mujer.webp"
import noBinario from "../../../public/actividades/no-binario.webp"
import imagenDefaultActividades from "../../../public/actividades/no-binario.webp"
import TemaDropdown from "../../components/TemaDropdown"



const estudioPage =() =>{
        const router = useRouter();
        const { user, loading, activeChildProfile } = useUser();
        const [displayedImageSrc, setDisplayedImageSrc] = useState(imagenDefaultActividades.src);

        useEffect(() => {
            console.log("ActividadesPage useEffect: loading =", loading, ", user =", !!user, ", activeChildProfile =", activeChildProfile);

            if (!loading && !user) {
                console.log("ActividadesPage: Not authenticated, redirecting to login.");
                router.push('/login');
                return;
            }

            if (!loading && user && !activeChildProfile) {
                console.log("ActividadesPage: No active child profile found, redirecting to Biblioteca to select one.");
                router.push('/biblioteca');
                return;
            }

            // Mueve toda la lógica de asignación de imagen aquí dentro del useEffect
            // Asegúrate de que solo se ejecute si activeChildProfile existe
            if (activeChildProfile) {
                let selectedImage = imagenDefaultActividades.src; // Por defecto
                switch (activeChildProfile.sexo) { // ¡Usamos 'sexo' aquí!
                    case 'hombre':
                        selectedImage = nino.src;
                        break;
                    case 'mujer':
                        selectedImage = nina.src;
                        break;
                    case 'prefiero no decirlo':
                        selectedImage = noBinario.src;
                        break;
                    default:
                        // Si el sexo no coincide o es nulo, usa la imagen por defecto
                        selectedImage = imagenDefaultActividades.src;
                        break;
                }
                setDisplayedImageSrc(selectedImage);
                console.log(`ActividadesPage: Setting displayed image based on sexo (${activeChildProfile.sexo}):`, selectedImage);
            }

    }, [user, loading, activeChildProfile, router]);

    if (loading || !user || !activeChildProfile) {
        // Muestra un estado de carga o mensaje hasta que el perfil esté disponible
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Cargando actividades del niño...</p>
            </div>
        );
    }
    

    // Si tenemos un activeChildProfile, podemos usar sus datos para mostrar actividades personalizadas
    console.log("ActividadesPage: Rendering content for active child:", activeChildProfile.name);
    return(
        <div className='bg-[#26A6BD] min-h-screen justify-items-center items-center'>
            <div className="bg-[url('/estudio/tabla.png')] w-270 h-180 bg-no-repeat bg-cover  justify-items-center content-center relative">
            <h2 className='text-[#685A51] font-bold text-8xl'>Temas</h2>
                {/* 1 actividad */}
                <div className='justify-items-center items-center mt-2'>
                    <TemaDropdown id='1' title="1. Conteo y números del 1 al 20" childId={activeChildProfile.id}/>
                    <TemaDropdown id='2' title="2. Formas geometricas basicas" childId={activeChildProfile.id}/>
                    <TemaDropdown id='3' title="3. Relacion de tamaño y cantidad" childId={activeChildProfile.id}/>
                </div>
            </div>
                 {/* imagen del avatar */}
                    <div> {/* Contenedor para la imagen principal */}
                        <Image
                            src={displayedImageSrc}
                            alt={`Escenario de actividades para ${activeChildProfile.sexo}`}
                            width={250} // Ajusta el ancho según tus necesidades
                            height={250} // Ajusta la altura para mantener la relación de aspecto de tus imágenes
                            className='z-10 left-30 absolute bottom-0'
                        />
                    </div>
                    <Link href="/salon" className='z-10 left-335 absolute bottom-5'>
                    <div className=' py-1 px-9  bg-[#B993A2] text-black rounded-4xl text-2xl'>
                        Salir
                    </div>
                    </Link>
           
        </div>
    );
}

export default estudioPage;