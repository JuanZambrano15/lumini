// src/app/parent-web/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../components/UserProvider';
import { getUserData, setParentAccessPassword, verifyParentAccessPassword, logoutUser, ChildProfile } from '../../lib/authService';
import Image from 'next/image';
import Link from 'next/link';
import homeIcon from '../../../public/home.svg'; // Asegúrate de tener un icono de casa o similar
import logout from '../../../public/biblioteca/logout.svg'; // Ya lo tienes
import Comments from '../../../public/biblioteca/comentarios.svg'; // Ya lo tienes
import alumnoIcon from '../../../public/padres/mochila.webp';
import sesionesIcon from '../../../public/padres/calendario.webp';
import evolucionIcon from '../../../public/padres/estadisticas.webp';
import recompensasIcon from '../../../public/padres/regalo.webp';
import diplomasIcon from '../../../public/padres/diploma.webp';
import pozoIcon from '../../../public/padres/pozo.webp';
import calendar from "../../../public/padres/calendario.png"
import mujer from "../../../public/biblioteca/mujer.jpg"



const ParentWebPage = () => {
    const router = useRouter();
    const { user, loading, activeChildProfile } = useUser();
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
    if (activeChildProfile) {
        console.log('Active Child Profile:', activeChildProfile);
        console.log('Avatar URL:', activeChildProfile.avatarUrl);
    } else {
        console.log('No active child profile yet.');
    }
}, [activeChildProfile]);

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
                        {isPasswordSet ? 'Acceso a Web de Padres' : 'Establece tu Contraseña'}
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

    console.log("Rendering main ParentWebPage content.");
    console.log("Current activeChildProfile for rendering:", activeChildProfile);

    return (
        <div className="min-h-screen bg-[url('/padres/fondo.webp')] relative ">
            {/* Navbar superior */}
            <nav className="flex justify-end  items-center py-4 relative z-10">
                <div className="flex items-center gap-3">
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

            <main className="">
                {/* nav izquierdo */}
                <div className='absolute bg-gradient-to-t to-[#795493] from-[#AB89FE] py-43.5 z-50 top-0 pl-20'>
                <ul className="space-y-2 mt-4 bg-[#F4DDF6] text-[#BE83EF] rounded-tl-2xl"> {/* Espacio entre ítems y margen superior */}

                    {/* Alumnos */}
                    <li>
                        <Link href="/parent-web/" className="flex items-center gap-3 p-4 relative z-10
                                transform -translate-x-4
                                w-[calc(100%+1rem)] /* Ancho para sobresalir un poco */
                                bg-[#F4DDF6] bg-opacity-30 
                                shadow-lg rounded-r-none rounded-l-full
                                text-[#BE83EF] transition-all duration-300 ease-in-out">
                            {/* Ícono de Alumnos - Más grande y con color del texto */}
                            <Image src={alumnoIcon} alt="Alumnos Icon" width={32} height={32} className="filter-none" /> {/* Quitado invert si el ícono ya es oscuro, o ajustado */}
                            {/* Texto "Alumnos" - Más grande y más grueso */}
                            <span className="text-xl font-bold">Alumnos</span> {/* text-2xl y font-extrabold */}
                        </Link>
                    </li>

                    {/* Sesiones */}
                    <li>
                        <Link href="/parent-web" className="flex items-center gap-3 p-3 rounded-md 
                                hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
                            <Image src={sesionesIcon} alt="Sesiones Icon" width={24} height={24}  />
                            <span className="text-lg font-medium">Sesiones</span>
                        </Link>
                    </li>

                    {/* Evolución */}
                    <li>
                        <Link href="/parent-web" className="flex items-center gap-3 p-3 rounded-md 
                                hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
                            <Image src={evolucionIcon} alt="Evolucion Icon" width={24} height={24}/>
                            <span className="text-lg font-medium">Evolución</span>
                        </Link>
                    </li>

                    {/* Recompensas */}
                    <li>
                        <Link href="/parent-web" className="flex items-center gap-3 p-3 rounded-md 
                                hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
                            <Image src={recompensasIcon} alt="Recompensas Icon" width={24} height={24}/>
                            <span className="text-lg font-medium">Recompensas</span>
                        </Link>
                    </li>

                    {/* Diplomas */}
                    <li>
                        <Link href="/parent-web" className="flex items-center gap-3 p-3 rounded-md 
                                hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
                            <Image src={diplomasIcon} alt="Diplomas Icon" width={24} height={24}/>
                            <span className="text-lg font-medium">Diplomas</span>
                        </Link>
                    </li>

                    {/* Pozo */}
                    <li>
                        <Link href="/parent-web" className="flex items-center gap-3 p-3 rounded-md 
                                hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
                            <Image src={pozoIcon} alt="Pozo Icon" width={24} height={24}  />
                            <span className="text-lg font-medium">Pozo</span>
                        </Link>
                    </li>

                </ul>
                </div>
                <div className='pt-5'>
                    <div>
                        <Image src={mujer} alt='mujer' className=" bg-[#EBF3F9] w-28 h-28 rounded-full ml-200  object-cover border-4 border-purple-400" />
                    </div>
                <div className='flex justify-center items-center ml-65'>
                    <Image src={calendar} alt='calendario'/>
                </div>
                </div>
            </main>
        </div>
    );
};

export default ParentWebPage;
