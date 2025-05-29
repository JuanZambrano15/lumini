// src/app/salon/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import Image from 'next/image';
import fondoActividades from '../../../public/casa/fondo.jpg'; // Ruta a tu imagen fondo.webp
import Link from 'next/link';
import nino from "../../../public/actividades/hombre.webp"
import nina from "../../../public/actividades/mujer.webp"
import noBinario from "../../../public/actividades/no-binario.webp"
import imagenDefaultActividades from "../../../public/actividades/no-binario.webp"
import { getAvatarById } from '../../lib/avatars';



const casaPage =() =>{
        const router = useRouter();
        const { user, loading, activeChildProfile } = useUser();
        const [displayedImageSrc, setDisplayedImageSrc] = useState('/path/to/loading_avatar.webp'); // Puedes poner un avatar de carga aquí

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
            // Usa el avatarId del perfil para obtener la imagen
            const avatarSrc = getAvatarById(activeChildProfile.avatarId);
            setDisplayedImageSrc(avatarSrc);
            console.log(`Página: Setting displayed avatar based on avatarId (${activeChildProfile.avatarId}):`, avatarSrc);
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
                    className='absolute mt-95 ml-120'
                />

            </div>

            <div className='relative'>
                {/* closet */}
                <Link href="/closet" className='absolute ml-45 mt-6'>
                <div className=' px-35 py-78'>

                </div>
                </Link>
            </div>
            <Link href="/actividades" className='z-10 left-335 absolute bottom-5'>
                    <div className=' py-1 px-9  bg-[#B993A2] text-black rounded-4xl text-2xl'>
                        Salir
                    </div>
            </Link>

        </div>

    );
}

export default casaPage;