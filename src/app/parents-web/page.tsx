// src/app/parent-web/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import { getUserData, setParentAccessPassword, verifyParentAccessPassword, logoutUser } from '../../lib/authService';
import Image from 'next/image';
import Link from 'next/link';

import logout from '../../../public/biblioteca/logout.svg'; // Ya lo tienes
import Comments from '../../../public/biblioteca/comentarios.svg'; // Ya lo tienes


const ParentWebPage = () => {
    const router = useRouter();
    const { user, loading } = useUser();
    const [userData, setUserData] = useState<{ email: string; name?: string; parentPassword?: string } | null>(null);
    const [hasParentPassword, setHasParentPassword] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [isPasswordSet, setIsPasswordSet] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado para controlar si ya se accedió a la web de padres en esta sesión
    const [accessedThisSession, setAccessedThisSession] = useState(false);

    // Cargar datos del usuario y verificar si ya tiene contraseña de padres
    const fetchParentData = useCallback(async () => {
        if (user) {
            const data = await getUserData(user.uid);
            setUserData(data);
            if (data?.parentPassword) {
                setHasParentPassword(true);
                setIsPasswordSet(true); // Indica que ya hay una contraseña establecida
            } else {
                setHasParentPassword(false);
                setIsPasswordSet(false);
            }
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login'); // Redirige si no está autenticado
            return;
        }

        if (!loading && user) {
            fetchParentData();
        }
    }, [user, loading, router, fetchParentData]);

    useEffect(() => {
        // Si no está cargando, hay un usuario, y NO se ha accedido aún en esta sesión,
        // y NO se ha mostrado el modal, entonces verifica si se necesita mostrar el modal.
        if (!loading && user && !accessedThisSession && !showPasswordModal) {
            if (isPasswordSet) {
                // Si la contraseña ya está establecida, muestra el modal para pedirla.
                setShowPasswordModal(true);
            } else if (userData !== null && !hasParentPassword) {
                // Si aún no se ha cargado userData o no tiene contraseña, y ya no está cargando
                // y el userData ya se obtuvo, es la primera vez, muestra el modal para establecerla.
                setShowPasswordModal(true);
            }
        }
    }, [loading, user, accessedThisSession, isPasswordSet, hasParentPassword, userData, showPasswordModal]);


    const handleSetOrVerifyPassword = async () => {
        setError(null);
        if (!user) return;

        if (isPasswordSet) {
            // Verificar contraseña existente
            const isValid = await verifyParentAccessPassword(user.uid, passwordInput);
            if (isValid) {
                setAccessedThisSession(true);
                setShowPasswordModal(false);
                setPasswordInput(''); // Limpiar input
            } else {
                setError('Contraseña incorrecta. Inténtalo de nuevo.');
            }
        } else {
            // Establecer nueva contraseña
            if (passwordInput.length < 6) { // Ejemplo de validación mínima
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            try {
                await setParentAccessPassword(user.uid, passwordInput);
                setAccessedThisSession(true);
                setHasParentPassword(true);
                setIsPasswordSet(true);
                setShowPasswordModal(false);
                setPasswordInput(''); // Limpiar input
                alert('Contraseña de padres establecida con éxito. ¡Bienvenido!');
            } catch (err) {
                console.error('Error al establecer la contraseña de padres:', err);
                setError('Error al establecer la contraseña. Inténtalo de nuevo.');
            }
        }
    };

    const handleLogout = async () => {
        try {
            // Limpia el estado de acceso a la web de padres al cerrar sesión
            setAccessedThisSession(false);
            await logoutUser();
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (loading || (user && !userData && !showPasswordModal)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Cargando información de padres...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Redirigido por useEffect
    }

    // Si el modal está abierto o no se ha accedido en esta sesión, muestra el modal.
    // Esto asegura que el contenido de la página no se vea hasta que se autentique la contraseña de padres.
    if (showPasswordModal || (!accessedThisSession && user)) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                        {isPasswordSet ? 'Acceso a Web de Padres' : 'Establece tu Contraseña de Padres'}
                    </h2>

                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                    <div className="mb-4">
                        <label htmlFor="parentPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                            {isPasswordSet ? 'Ingresa tu contraseña de padres:' : 'Crea una contraseña para la Web de Padres:'}
                        </label>
                        <input
                            type="password"
                            id="parentPassword"
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSetOrVerifyPassword();
                            }}
                            placeholder={isPasswordSet ? 'Contraseña existente' : 'Mínimo 6 caracteres'}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => router.push('/biblioteca')} // Volver a la página anterior
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSetOrVerifyPassword}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                        >
                            {isPasswordSet ? 'Acceder' : 'Establecer y Acceder'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar superior */}
            <nav className="flex justify-between items-center py-4 px-6 bg-[#C6FFF3] rounded-lg shadow-md mb-8">
                <div className="flex items-center">
                    <Link href="/">
                        <img src="/logo.svg" alt="Lumini Logo" className="w-20" />
                    </Link>
                </div>
                <div className="flex items-center">
                    <button className="inline-flex justify-between rounded-md border-2 border-black shadow-sm px-10 py-2 bg-[#C6FFF3] text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {userData?.name || userData?.email || 'Mi Perfil'}
                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 세포 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Image alt="comentario" src={Comments} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-gray-100 mx-2"
                    >
                        <Image alt='logout' src={logout} />
                    </button>
                    <Link href="/biblioteca">
                        <button className="bg-purple-200 py-2 px-4 rounded-full hover:bg-purple-300 text-black border-black border-2">
                            Biblioteca
                        </button>
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
                    Bienvenido a la Web de Padres
                </h1>
                <p className="text-lg text-gray-700 text-center mb-10">
                    Aquí encontrarás información importante y herramientas para gestionar la experiencia de tus hijos.
                </p>

                <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Información General
                    </h2>
                    <p className="text-gray-600">
                        Este espacio está diseñado para padres. Puedes ver estadísticas, gestionar suscripciones,
                        y acceder a recursos exclusivos.
                    </p>
                    {/* Más contenido para padres aquí */}
                </section>

                <section className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Configuración de la Cuenta
                    </h2>
                    <p className="text-gray-600">
                        Aquí puedes actualizar tu contraseña de acceso a padres si lo deseas.
                    </p>
                    <button
                        onClick={() => {
                            setPasswordInput(''); // Limpia cualquier contraseña previa
                            setShowPasswordModal(true); // Abre el modal para re-establecer/cambiar
                        }}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        Cambiar Contraseña de Padres
                    </button>
                </section>

                {/* Otros elementos para la Web de Padres */}
            </main>
        </div>
    );
};

export default ParentWebPage;
