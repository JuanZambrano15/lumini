// src/components/UserProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { ChildProfile } from '../lib/authService';

interface AuthContextType {
    user: any;
    loading: boolean;
    activeChildProfile: ChildProfile | null;
    setActiveChildProfile: (profile: ChildProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const { user, loading } = useAuth();
    const [activeChildProfile, setActiveChildProfile] = useState<ChildProfile | null>(null);

    useEffect(() => {
        console.log("UserProvider useEffect [user, loading] called.");
        console.log("Current user:", user ? user.uid : 'null', "Loading:", loading);

        if (!loading && user) {
            const storedProfile = localStorage.getItem('activeChildProfile');
            console.log("UserProvider: Checking localStorage for activeChildProfile. Stored:", storedProfile);
            if (storedProfile) {
                try {
                    const parsedProfile = JSON.parse(storedProfile);
                    setActiveChildProfile(parsedProfile);
                    console.log("UserProvider: Active child profile loaded from localStorage:", parsedProfile);
                } catch (e) {
                    console.error("UserProvider: Error parsing activeChildProfile from localStorage", e);
                    localStorage.removeItem('activeChildProfile'); // Limpiar si está corrupto
                }
            } else {
                console.log("UserProvider: No active child profile found in localStorage.");
            }
        } else if (!loading && !user) {
            // Si no hay usuario y no está cargando, limpia el perfil activo
            console.log("UserProvider: User logged out or not authenticated. Clearing active child profile.");
            setActiveChildProfile(null);
            localStorage.removeItem('activeChildProfile');
        }
    }, [user, loading]);

    useEffect(() => {
        console.log("UserProvider useEffect [activeChildProfile, user, loading] called. Current activeChildProfile:", activeChildProfile);
        if (activeChildProfile) {
            localStorage.setItem('activeChildProfile', JSON.stringify(activeChildProfile));
            console.log("UserProvider: Active child profile saved to localStorage:", activeChildProfile);
        } else if (!user && !loading) {
            // Solo limpiar si no hay usuario y no está cargando (cierre de sesión explícito o no logueado)
            localStorage.removeItem('activeChildProfile');
            console.log("UserProvider: Active child profile removed from localStorage (no user/loading).");
        }
    }, [activeChildProfile, user, loading]);


    return (
        <AuthContext.Provider value={{ user, loading, activeChildProfile, setActiveChildProfile }}>
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