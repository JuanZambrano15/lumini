// src/components/UserProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { ChildProfile, getChildrenProfiles, updateChildProfile as updateChildProfileInDB } from '../lib/authService';

interface AuthContextType {
    user: any;
    loading: boolean;
    activeChildProfile: ChildProfile | null;
    setActiveChildProfile: (profile: ChildProfile | null) => void;
    updateActiveChildProfile: (updates: Partial<ChildProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const { user, loading } = useAuth();
    const [activeChildProfile, setActiveChildProfile] = useState<ChildProfile | null>(null);

    // Usamos un ref para controlar si ya se intentó cargar el perfil de niño desde la DB
    // Reiniciamos este ref a false cuando el usuario se desconecta.
    const hasFetchedChildrenRef = useRef(false);

    // Función para obtener perfiles desde la base de datos y establecer el activo
    const fetchAndSetChildProfiles = useCallback(async (userId: string) => {
        // Solo intentar cargar si aún no lo hemos hecho en esta sesión (o si el usuario cambió)
        if (hasFetchedChildrenRef.current && activeChildProfile) { // Si ya cargamos y hay un perfil activo, no volver a cargar
             console.log("UserProvider: Already fetched children for this user and active profile exists. Skipping re-fetch.");
             return;
        }
        
        hasFetchedChildrenRef.current = true; // Marcar que ya intentamos cargar para este ciclo de autenticación

        try {
            console.log("UserProvider: Fetching children profiles from DB for user:", userId);
            const profiles = await getChildrenProfiles(userId);
            console.log("UserProvider: Fetched profiles from DB:", profiles);

            if (profiles.length > 0) {
                const storedProfileString = localStorage.getItem('activeChildProfile');
                let foundActiveProfile: ChildProfile | null = null;

                if (storedProfileString) {
                    try {
                        const parsedProfile: ChildProfile = JSON.parse(storedProfileString);
                        if (parsedProfile.id) {
                            foundActiveProfile = profiles.find(p => p.id === parsedProfile.id) || null;
                        }
                    } catch (e) {
                        console.error("UserProvider: Error parsing activeChildProfile from localStorage", e);
                        localStorage.removeItem('activeChildProfile'); // Limpiar si está corrupto
                    }
                }

                if (foundActiveProfile) {
                    setActiveChildProfile(foundActiveProfile);
                    console.log("UserProvider: Active child profile loaded from DB (matched localStorage).", foundActiveProfile);
                } else {
                    setActiveChildProfile(profiles[0]); // Por defecto, el primer perfil
                    console.log("UserProvider: Active child profile loaded from DB (defaulting to first).", profiles[0]);
                    localStorage.setItem('activeChildProfile', JSON.stringify(profiles[0])); // Guardar este por defecto
                }
            } else {
                setActiveChildProfile(null);
                localStorage.removeItem('activeChildProfile');
                console.log("UserProvider: No child profiles found in DB. Clearing active.");
            }
        } catch (error) {
            console.error("UserProvider: Error fetching child profiles from DB:", error);
            setActiveChildProfile(null);
            localStorage.removeItem('activeChildProfile');
        }
    }, []); // Eliminé dependencias aquí porque useRef maneja la ejecución única por sesión de usuario.

    // Efecto principal para manejar la autenticación y la carga de perfiles
    useEffect(() => {
        console.log("UserProvider useEffect [user, loading] called.");
        if (!loading) {
            if (user) {
                // Usuario autenticado: intenta cargar los perfiles de niños.
                // Llamamos a fetchAndSetChildProfiles solo si el usuario está autenticado.
                fetchAndSetChildProfiles(user.uid);
            } else {
                // Usuario desconectado
                console.log("UserProvider: User logged out or not authenticated. Clearing active child profile.");
                setActiveChildProfile(null);
                localStorage.removeItem('activeChildProfile');
                hasFetchedChildrenRef.current = false; // <-- CORRECCIÓN: Resetear aquí para permitir carga en próxima sesión
            }
        }
    }, [user, loading, fetchAndSetChildProfiles]);

    // Efecto para guardar el perfil del niño en localStorage CADA VEZ que cambia (siempre y cuando haya un perfil activo)
    useEffect(() => {
        console.log("UserProvider useEffect [activeChildProfile] called. Current activeChildProfile:", activeChildProfile);
        if (activeChildProfile) {
            localStorage.setItem('activeChildProfile', JSON.stringify(activeChildProfile));
            console.log("UserProvider: Active child profile saved to localStorage:", activeChildProfile);
        } else {
            localStorage.removeItem('activeChildProfile');
            console.log("UserProvider: Active child profile removed from localStorage.");
        }
    }, [activeChildProfile]);


    // Función para actualizar el perfil del niño activo (LOCAL y DB)
    const updateActiveChildProfile = useCallback(async (updates: Partial<ChildProfile>) => {
        if (!activeChildProfile || !user || !activeChildProfile.id) {
            console.warn("No active child profile or user to update.");
            return;
        }

        const updatedProfile = { ...activeChildProfile, ...updates };

        try {
            await updateChildProfileInDB(user.uid, activeChildProfile.id, updates);
            console.log("UserProvider: Child profile updated in database for ID:", activeChildProfile.id);
            setActiveChildProfile(updatedProfile);
            console.log("UserProvider: Active child profile updated locally and will sync to localStorage:", updatedProfile);
        } catch (error) {
            console.error("UserProvider: Error updating child profile:", error);
            throw error;
        }
    }, [activeChildProfile, user]);

    return (
        <AuthContext.Provider value={{ user, loading, activeChildProfile, setActiveChildProfile, updateActiveChildProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};