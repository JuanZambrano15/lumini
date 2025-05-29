// src/app/actividades/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import Image from 'next/image';
import fondoActividades from '../../../public/actividades/fondo.jpg'; // Ruta a tu imagen fondo.webp
import Link from 'next/link';
import nino from "../../../public/actividades/hombre.webp"
import nina from "../../../public/actividades/mujer.webp"
import noBinario from "../../../public/actividades/no-binario.webp"
import imagenDefaultActividades from "../../../public/actividades/no-binario.webp"
import { getAvatarById } from '../../lib/avatars'; // Ajusta la ruta



const ActividadesPage = () => {
    const router = useRouter();
    const { user, loading, activeChildProfile } = useUser();
    const [displayedImageSrc, setDisplayedImageSrc] = useState('/path/to/loading_avatar.webp');

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

    return (
        <div       className="min-h-screen bg-cover bg-no-repeat bg-center relative"
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
            

            {/* Aquí puedes mapear las áreas clicables de tu fondo.webp */}
            {/* Por ejemplo, un área para la tienda naranja, otra para la azul, etc. */}
            {/* Estas son solo coordenadas de ejemplo, tendrás que ajustarlas a tu imagen */}
            <div className="relative  ">
                {/* Tienda Naranja */}
                <Link href="/casa" className="absolute mt-78 ">
                    <div className=' py-35 px-69'>
                    </div>
                </Link>

                {/* Pozo */}
                <Link href={`/actividades/${activeChildProfile.id}/historia`} className="absolute ml-135 mt-56" >
                    <div className=' py-45 px-40'>

                    </div>
                </Link>

                {/* Tienda Morada (educacion) */}
                <Link href="/juegos" className="absolute ml-262 mt-111" >
                    <div className=' py-32 px-52  '>
                    </div>
                </Link>
                {/* Tienda azul (educacion) */}
                <Link href="/salon" className="absolute ml-208 mt-82" >
                    <div className=' py-28 px-44 '>
                    </div>
                </Link>
                {/* Casa del árbol */}
                <Link href={`/actividades/${activeChildProfile.id}/recompensas`} className="absolute ml-257 mt-12" >
                    <div className=' py-28 px-40  '>
                    </div>
                </Link>
                <Link href="/biblioteca" className="absolute ml-10 mt-4" >
                    <div className=' py-1 px-9  bg-[#B993A2] text-black rounded-4xl text-2xl'>
                        Salir
                    </div>
                </Link>

                
            </div>
            
        </div>
    );
};

export default ActividadesPage;