// src/app/closet/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider'; // Asegúrate de la ruta correcta
import Image from 'next/image';
import Link from 'next/link';

// Importa el array de avatares
import { availableAvatars, getAvatarById } from '../../lib/avatars'; // Asegúrate de la ruta correcta

// Fondo para el clóset
import fondoCloset from '../../../public/closet/fondo.png'; // Usa tu imagen de fondo de campamento, o una específica para el clóset

const ClosetPage = () => {
    const router = useRouter();
    const { user, loading, activeChildProfile, updateActiveChildProfile } = useUser(); // Usa la nueva función

    const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined); // Puede ser undefined inicialmente
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (!loading && user && !activeChildProfile) {
            // Si no hay perfil de niño activo, redirige a donde elija o cree uno
            router.push('/biblioteca'); // O '/seleccionar-nino'
            return;
        }

        // Una vez que activeChildProfile está disponible, establece el avatar seleccionado
        if (activeChildProfile) {
            // Usa el avatarId existente, o el ID del primer avatar si no tiene uno
            setSelectedAvatarId(activeChildProfile.avatarId || availableAvatars[0].id);
        }
    }, [user, loading, activeChildProfile, router]);

    const handleAvatarSelect = async (avatarId: number) => {
        if (!activeChildProfile || isUpdating || selectedAvatarId === avatarId) return;

        setIsUpdating(true);
        try {
            await updateActiveChildProfile({ avatarId: avatarId });
            // El estado local se actualizará a través de la actualización del UserProvider
            console.log(`Avatar updated for child ${activeChildProfile.id} to ${avatarId}`);
        } catch (error) {
            console.error('Error updating avatar:', error);
            // Si la actualización falla, podrías revertir el avatar seleccionado en la UI
            setSelectedAvatarId(activeChildProfile.avatarId); // Revertir al último conocido
        } finally {
            setIsUpdating(false);
        }
    };

    // Muestra un estado de carga mientras se obtiene el perfil o el avatar
    if (loading || !user || !activeChildProfile || selectedAvatarId === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Cargando clóset...</p>
            </div>
        );
    }

    // El `src` para el avatar principal y las miniaturas usa `getAvatarById`
    const currentAvatarSrc = getAvatarById(selectedAvatarId);

    return (
        <div
            className="min-h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center p-4 relative"
            style={{ backgroundImage: `url(${fondoCloset.src})` }}
        >
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-center max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                    ¡Elige tu avatar {activeChildProfile.name}!
                </h1>

                {/* Avatar actualmente seleccionado */}
                <div className="mb-8">
                    <Image
                        src={currentAvatarSrc} // Usa la ruta obtenida de getAvatarById
                        alt="Avatar Actual"
                        width={200}
                        height={200}
                        className="mx-auto rounded-full border-4 border-blue-500 shadow-md"
                    />
                    {isUpdating && <p className="text-blue-600 mt-2">Guardando...</p>}
                </div>

                {/* Galería de avatares */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {availableAvatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className={`
                                relative p-2 border-2 rounded-lg cursor-pointer
                                ${selectedAvatarId === avatar.id ? 'border-blue-500 ring-4 ring-blue-300' : 'border-gray-300 hover:border-blue-300'}
                                transition-all duration-200
                            `}
                            onClick={() => handleAvatarSelect(avatar.id)}
                        >
                            <Image
                                src={avatar.src}
                                alt={avatar.alt}
                                width={100}
                                height={100}
                                className="w-full h-auto object-contain rounded-full"
                            />
                            {selectedAvatarId === avatar.id && (
                                <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</span>
                            )}
                        </div>
                    ))}
                </div>

                <Link href="/casa" className="mt-8 inline-block px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200">
                    Volver
                </Link>
            </div>
        </div>
    );
};

export default ClosetPage;