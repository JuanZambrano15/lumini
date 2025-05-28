// src/app/salon/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import Image from 'next/image';
import fondoActividades from '../../../public/salon/fondo.jpg'; // Ruta a tu imagen fondo.webp
import Link from 'next/link';
import nino from "../../../public/actividades/hombre.webp"
import nina from "../../../public/actividades/mujer.webp"
import noBinario from "../../../public/actividades/no-binario.webp"
import imagenDefaultActividades from "../../../public/actividades/no-binario.webp"



const salonPage =() =>{
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
        <div className="min-h-screen bg-cover bg-no-repeat bg-center relative"
            style={{ backgroundImage: `url(${fondoActividades.src})` }}>

            {/* imagen del avatar */}
            <div> {/* Contenedor para la imagen principal */}
                <Image
                    src={displayedImageSrc}
                    alt={`Escenario de actividades para ${activeChildProfile.sexo}`}
                    width={200} // Ajusta el ancho según tus necesidades
                    height={200} // Ajusta la altura para mantener la relación de aspecto de tus imágenes
                    className='absolute mt-95 ml-80'
                />

            </div>

            <div className='relative'>

                {/* puerta de salida */}
                <Link href="/actividades" className='absolute mt-45'>
                    <div className=' py-50 px-13'>

                    </div>
                </Link>
                {/* mesa de actividades*/}
                <Link href="/estudio" className='absolute mt-130 ml-120'>
                    <div className=' py-30 px-60'>

                    </div>
                </Link>
            </div>

        </div>

    );
}

export default salonPage;