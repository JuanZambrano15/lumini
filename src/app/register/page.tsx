"use client"; // Marca como Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // O 'next/navigation' si usas App Router
import AuthForm from '../../components/AuthForm';
import { registerUser } from '../../lib/authService';
import { useUser } from '../../components/UserProvider'; // Para redirigir si ya está logueado

    const RegisterPage = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Si el usuario ya está autenticado y no estamos en fase de carga inicial, redirige al dashboard
        if (!authLoading && user) {
        router.push('/biblioteca');
        }
    }, [user, authLoading, router]);

    const handleRegister = async (email: string, password: string, name?: string) => {
        setFormLoading(true);
        setError(null);
        try {
        await registerUser(email, password, name);
        router.push('/biblioteca'); // Redirige al dashboard después del registro exitoso
        } catch (err: any) {
        // Manejo de errores de Firebase Auth
        let errorMessage = 'Error al registrar. Inténtelo de nuevo.';
        switch (err.code) {
            case 'auth/email-already-in-use':
            errorMessage = 'El email ya está registrado.';
            break;
            case 'auth/invalid-email':
            errorMessage = 'El formato del email no es válido.';
            break;
            case 'auth/weak-password':
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            break;
            default:
            errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        } finally {
        setFormLoading(false);
        }
    };

    if (authLoading || user) { // Muestra un spinner o nada mientras se verifica la sesión o si ya está logueado
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p>Cargando...</p>
        </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/login_register/login.png')]">
        <AuthForm
            type="register"
            onSubmit={handleRegister}
            loading={formLoading}
            error={error}
        />
        </div>
    );
};

export default RegisterPage;