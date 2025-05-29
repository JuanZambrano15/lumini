// src/app/biblioteca/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../src/components/UserProvider';
import {
    logoutUser,
    getUserData,
    createChildProfile,
    getChildrenProfiles,
    ChildProfile,
    updateChildProfile,
    deleteChildProfile,
} from '../../../src/lib/authService';
import Image from 'next/image';
import comentarios from "../../../public/biblioteca/comentarios.svg";
import logout from "../../../public/biblioteca/logout.svg";
import Link from 'next/link';
import pencil from "../../../public/biblioteca/pencil.svg";
import trash from "../../../public/biblioteca/trash.svg";
import plus from "../../../public/biblioteca/añadir.svg";

import { availableAvatars, getAvatarById, getDefaultAvatarIdBySexo } from '../../lib/avatars';

const MAX_CHILDREN_PROFILES = 3;

const BibliotecaPage = () => {
    const router = useRouter();
    const { user, loading, setActiveChildProfile, activeChildProfile } = useUser(); // <-- activeChildProfile es importante aquí
    const [userData, setUserData] = useState<{ email: string; name?: string } | null>(null);
    const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
    const [showAddChildModal, setShowAddChildModal] = useState(false);

    const [newChildName, setNewChildName] = useState('');
    const [newChildSexo, setNewChildSexo] = useState<'hombre' | 'mujer' | 'prefiero no decirlo'>('prefiero no decirlo');
    const [newChildTipoLimitacion, setNewChildTipoLimitacion] = useState<'tdha'>('tdha');
    const [newChildAvatarId, setNewChildAvatarId] = useState<number>(getDefaultAvatarIdBySexo('prefiero no decirlo'));

    const [showEditChildModal, setShowEditChildModal] = useState(false);
    const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
    const [editChildName, setEditChildName] = useState('');
    const [editChildSexo, setEditChildSexo] = useState<'hombre' | 'mujer' | 'prefiero no decirlo'>('prefiero no decirlo');
    const [editChildTipoLimitacion, setEditChildTipoLimitacion] = useState<'tdha'>('tdha');
    const [editChildAvatarId, setEditChildAvatarId] = useState<number | undefined>(undefined);

    const fetchData = useCallback(async () => {
        if (user) {
            console.log("BibliotecaPage: Fetching user data and children profiles...");
            const parentData = await getUserData(user.uid);
            setUserData(parentData);
            const children = await getChildrenProfiles(user.uid);
            setChildrenProfiles(children);

            // IMPORTANTE: Después de cargar los perfiles, si no hay un activeChildProfile ya establecido
            // por UserProvider, o si el que está activo no se encuentra en la nueva lista,
            // podrías querer establecer uno aquí. SIN EMBARGO, el UserProvider ya maneja esto.
            // La única vez que debes llamar setActiveChildProfile aquí es cuando el usuario HACE CLIC en un perfil.
            // Evita establecer un perfil por defecto aquí si UserProvider ya lo hace.

            // Verificar si el activeChildProfile actual sigue siendo válido en la lista cargada
            if (activeChildProfile && !children.find(c => c.id === activeChildProfile.id)) {
                console.log("BibliotecaPage: Active child profile from UserProvider not found in fetched list. Clearing or re-selecting.");
                // Opcional: Si el perfil activo ya no existe (fue eliminado, por ejemplo),
                // UserProvider debería manejarlo al no encontrarlo, o aquí lo limpiamos.
                setActiveChildProfile(null); // Esto puede hacer que UserProvider seleccione uno nuevo.
            }
        }
    }, [user, activeChildProfile, setActiveChildProfile]); // Añadir activeChildProfile a las dependencias

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }

        if (!loading && user) {
            fetchData();
        }
    }, [user, loading, router, fetchData]);

    useEffect(() => {
        setNewChildAvatarId(getDefaultAvatarIdBySexo(newChildSexo));
    }, [newChildSexo]);

    useEffect(() => {
        if (showEditChildModal && editingChild) {
            setEditChildName(editingChild.name); // Asegurar que el nombre también se cargue
            setEditChildSexo(editingChild.sexo);
            setEditChildTipoLimitacion(editingChild.tipoLimitacion);
            setEditChildAvatarId(editingChild.avatarId || getDefaultAvatarIdBySexo(editingChild.sexo));
        }
    }, [showEditChildModal, editingChild]);


    const handleLogout = async () => {
        try {
            await logoutUser();
            setActiveChildProfile(null); // Limpiar el perfil activo al desloguearse
            localStorage.removeItem('activeChildProfile'); // Asegurarse de limpiar localStorage
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleAddChild = async () => {
        // ... (Tu lógica existente para añadir niño) ...
        try {
            const newProfileData: Omit<ChildProfile, 'id'> = {
                name: newChildName.trim(),
                sexo: newChildSexo,
                tipoLimitacion: newChildTipoLimitacion,
                avatarId: newChildAvatarId,
            };

            const createdChild = await createChildProfile(user!.uid, newProfileData); // El servicio devuelve el perfil con ID

            // Después de crear un nuevo perfil, si es el primero o si quieres que sea el activo
            if (!activeChildProfile || childrenProfiles.length === 0) {
                 setActiveChildProfile(createdChild); // Establecer el nuevo perfil como activo
                 console.log("BibliotecaPage: New child created and set as active.", createdChild);
            }

            setNewChildName('');
            setNewChildSexo('prefiero no decirlo');
            setNewChildTipoLimitacion('tdha');
            setNewChildAvatarId(getDefaultAvatarIdBySexo('prefiero no decirlo'));
            setShowAddChildModal(false);
            await fetchData(); // Recargar todos los perfiles después de añadir uno nuevo
        } catch (error) {
            console.error('Error adding child profile:', error);
            alert('Error al agregar el perfil del niño. Consulta la consola para más detalles.');
        }
    };

    const handleEditClick = (child: ChildProfile) => {
        setEditingChild(child);
        setEditChildName(child.name);
        setEditChildSexo(child.sexo);
        setEditChildTipoLimitacion(child.tipoLimitacion);
        setEditChildAvatarId(child.avatarId || getDefaultAvatarIdBySexo(child.sexo));
        setShowEditChildModal(true);
    };

    const handleUpdateChild = async () => {
        // ... (Tu lógica existente para actualizar niño) ...
        try {
            const updatedData: Partial<ChildProfile> = {
                name: editChildName.trim(),
                sexo: editChildSexo,
                tipoLimitacion: editChildTipoLimitacion,
                avatarId: editChildAvatarId,
            };

            await updateChildProfile(user!.uid, editingChild!.id!, updatedData);

            // Si el perfil que se acaba de actualizar es el activo, actualízalo en el UserProvider también
            if (activeChildProfile && activeChildProfile.id === editingChild!.id) {
                setActiveChildProfile({ ...activeChildProfile, ...updatedData });
                console.log("BibliotecaPage: Updated active child profile in UserProvider.");
            }

            setEditingChild(null);
            setEditChildName('');
            setEditChildSexo('prefiero no decirlo');
            setEditChildTipoLimitacion('tdha');
            setEditChildAvatarId(undefined);
            setShowEditChildModal(false);
            await fetchData();
        } catch (error) {
            console.error('Error updating child profile:', error);
            alert('Error al actualizar el perfil del niño. Consulta la consola.');
        }
    };

    const handleDeleteChild = async (childId: string) => {
        // ... (Tu lógica existente para eliminar niño) ...
        try {
            await deleteChildProfile(user!.uid, childId);
            // Si el perfil eliminado era el activo, límpialo del UserProvider
            if (activeChildProfile && activeChildProfile.id === childId) {
                setActiveChildProfile(null);
                console.log("BibliotecaPage: Deleted active child profile. Clearing from UserProvider.");
            }
            await fetchData();
        } catch (error) {
            console.error('Error deleting child profile:', error);
            alert('Error al eliminar el perfil del niño. Consulta la consola.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Verificando autenticación...</p>
            </div>
        );
    }

    if (!user) {
        return null; // o redirigir directamente aquí
    }

    // Aquí ya tenemos un user, pero aún podríamos estar cargando los perfiles de niños.
    // Mostrar un spinner si childrenProfiles está vacío y no estamos en estado de "sin perfiles"
    if (!userData && childrenProfiles.length === 0 && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Cargando datos del usuario y perfiles...</p>
            </div>
        );
    }

    const handleChildClick = (child: ChildProfile) => {
        console.log("BibliotecaPage: Child profile clicked. Setting as active:", child);
        setActiveChildProfile(child);
        router.push(`/actividades`);
    };

    return (
        <div className="bg-no-repeat h-screen bg-[url('/biblioteca/fondo.webp')] opacity-80">
            {/* Navbar superior, similar a tu imagen image_12d88f.png */}
            <nav className="-5xl flex justify-around items-center py-4 px-6 bg-[#C6FFF3] rounded-lg shadow-md mb-8">
                <div className="flex items-center">
                    {/* Logo Lumini, asumiendo que tienes un SVG o imagen en public/logo.svg o similar */}
                    <Link href="/">
                        <img src="/logo.svg" alt="Lumini Logo" className="w-20" /> 
                    </Link>
                </div>
                <div className="flex items-center ">
                    <div className="justify-between">
                        <button className="inline-flex justify-between rounded-md border-2 border-black shadow-sm px-10 py-2 bg-[#C6FFF3] text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {userData?.name || userData?.email || 'Mi Perfil'}
                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {/* Aquí puedes añadir un dropdown menu si usas el componente DropdownMenu.tsx */}
                        {/* <DropdownMenu /> */}
                    </div>
                    
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        {/* Icono de pregunta/ayuda */}
                        <Image alt="comentario" src={comentarios}/>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-gray-100 mx-2"
                    >
                        <Image alt='logout' src={logout}/>
                    </button>
                    <Link href="/parent-web"> {/* Cambiado a la nueva ruta */}
                        <button className="bg-purple-200 py-2 px-4 rounded-full hover:bg-purple-300 text-black border-black border-2">
                            Web de padres
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="">
                {/* Título de la página */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Perfiles de Niños
                </h1>
                
                <div className="flex justify-center gap-6 flex-wrap mb-8">
                    {childrenProfiles.map((child) => (
                    <div key={child.id} // ¡Importante para evitar la advertencia de React keys!
                            onClick={() => handleChildClick(child)}>
                            <div className='py-2 bg-[#E3CFF1] rounded-t-lg border-2 border-[#A159D1] justify-items-center items-center text-[#A23FDE] font-semibold'>  
                                <p>ACTIVO</p>
                            </div>
                            <div key={child.id} className="relative bg-white p-4 rounded-b-lg shadow-2xl w-48 text-center  hover:shadow-xl transition-shadow duration-200">
                                {/* Etiqueta "ACTIVA" si el perfil está activo (ej. si es el que ha iniciado sesión un niño) */}
                                {/* <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">ACTIVA</div> */}
                                <img src={getAvatarById(child.avatarId)} alt={child.name}  className=" bg-[#EBF3F9] w-28 h-28 rounded-full mx-auto mb-3 object-cover object-top border-4 border-purple-400" />
                                <p className="font-semibold text-xl text-purple-800 mb-1">{child.name}</p>
                                
                                
                                {/* Botones de Editar y Eliminar para CADA niño */}
                                <div className="flex justify-center gap-2 mt-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation();handleEditClick(child);}} 
                                        className="p-1 rounded-full  text-white transition-colors duration-200"
                                        title="Editar perfil"
                                    >
                                        <Image src={pencil} alt='pencil'/>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation();handleDeleteChild(child.id!)} } // Aseguramos que child.id exista
                                        className="p-1 rounded-full  text-white transition-colors duration-200"
                                        title="Eliminar perfil"
                                    >
                                        <Image src={trash} alt='trash'/>
                                    </button>
                                </div>
                            </div>
                    </div>
                    ))}
                    {/*  tira 
                    pa que 
                    yo 
                    la pruebe */}
                    {childrenProfiles.length < MAX_CHILDREN_PROFILES && (
                        <div>
                            <div className='py-5 bg-[#E3CFF1] rounded-t-lg border-2 border-[#A159D1] justify-items-center items-center text-[#A23FDE] font-semibold'>  
                            </div>
                            <div
                                className="bg-white p-4 py-28  rounded-lg shadow-2xl w-48 h-48 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-colors duration-200"
                                onClick={() => setShowAddChildModal(true)}
                            >
                            <Image src={plus} alt='plus' className='w-30'/>
            
                            </div>
                        </div>
                    )}
                </div>

                {/* Este botón de cerrar sesión es un duplicado del de la navbar si quieres el de la navbar o el de abajo */}
                {/* <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline mt-8 transition-colors duration-200"
                >
                    Cerrar Sesión
                </button> */}
            </div>

            {/* Modal para añadir nuevo niño */}
            {showAddChildModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Añadir Nuevo Perfil de Niño</h2>
                        <div className="mb-4">
                            <label htmlFor="newChildName" className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Niño:</label>
                            <input
                                type="text"
                                id="newChildName"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={newChildName}
                                onChange={(e) => setNewChildName(e.target.value)}
                                placeholder="Ej: Estrellita"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newChildSexo" className="block text-gray-700 text-sm font-semibold mb-2">Sexo:</label>
                            <select
                                id="newChildSexo"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={newChildSexo}
                                onChange={(e) => setNewChildSexo(e.target.value as 'hombre' | 'mujer' | 'prefiero no decirlo')}
                            >
                                <option value="prefiero no decirlo">Prefiero no decirlo</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newChildTipoLimitacion" className="block text-gray-700 text-sm font-semibold mb-2">Tipo de Limitación:</label>
                            <select
                                id="newChildTipoLimitacion"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={newChildTipoLimitacion}
                                onChange={(e) => setNewChildTipoLimitacion(e.target.value as 'tdha')}
                            >
                                <option value="tdha">TDHA</option>
                            </select>
                        </div>
                            {/*<div className="mb-6">
                            <label htmlFor="newChildAvatarUrl" className="block text-gray-700 text-sm font-semibold mb-2">URL del Avatar (opcional):</label>
                            <input
                                type="text"
                                id="newChildAvatarUrl"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={newChildAvatarUrl}
                                onChange={(e) => setNewChildAvatarUrl(e.target.value)}
                                placeholder="Ej: https://ejemplo.com/avatar.png"
                            />
                            </div> */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowAddChildModal(false);
                                    setNewChildName('');
                                    setNewChildSexo('prefiero no decirlo');
                                    setNewChildTipoLimitacion('tdha');
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddChild}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Crear Perfil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para EDITAR perfil de niño */}
            {showEditChildModal && editingChild && ( // Muestra el modal solo si es true y hay un niño para editar
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Editar Perfil de {editingChild.name}</h2>
                        <div className="mb-4">
                            <label htmlFor="editChildName" className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Niño:</label>
                            <input
                                type="text"
                                id="editChildName"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={editChildName}
                                onChange={(e) => setEditChildName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="editChildSexo" className="block text-gray-700 text-sm font-semibold mb-2">Sexo:</label>
                            <select
                                id="editChildSexo"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={editChildSexo}
                                onChange={(e) => setEditChildSexo(e.target.value as 'hombre' | 'mujer' | 'prefiero no decirlo')}
                            >
                                <option value="prefiero no decirlo">Prefiero no decirlo</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="editChildTipoLimitacion" className="block text-gray-700 text-sm font-semibold mb-2">Tipo de Limitación:</label>
                            <select
                                id="editChildTipoLimitacion"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={editChildTipoLimitacion}
                                onChange={(e) => setEditChildTipoLimitacion(e.target.value as 'tdha')}
                            >
                                <option value="tdha">TDHA</option>
                            </select>
                        </div>
                        {/* <div className="mb-6">
                            <label htmlFor="editChildAvatarUrl" className="block text-gray-700 text-sm font-semibold mb-2">URL del Avatar:</label>
                            <input
                                type="text"
                                id="editChildAvatarUrl"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={editChildAvatarUrl}
                                onChange={(e) => setEditChildAvatarUrl(e.target.value)}
                            />
                        </div> */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowEditChildModal(false);
                                    setEditingChild(null); // Limpiar el niño en edición
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateChild}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BibliotecaPage;