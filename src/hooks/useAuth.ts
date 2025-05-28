// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Asegúrate de la ruta correcta

interface AuthState {
    user: User | null;
    loading: boolean;
    }

    const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged es el observador recomendado de Firebase
        // Se ejecuta cada vez que el estado de autenticación del usuario cambia (login, logout, token refrescado)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Una vez que sabemos el estado del usuario, la carga termina
        });

        // Limpia el observador al desmontar el componente para evitar fugas de memoria
        return () => unsubscribe();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar

    return { user, loading };
};

export default useAuth;