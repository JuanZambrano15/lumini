// src/components/AuthForm.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Importa Link de next/link

interface AuthFormProps {
    type: 'register' | 'login';
    onSubmit: (email: string, password: string, name?: string) => Promise<void>;
    loading: boolean;
    error: string | null;
    }

    const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Solo para registro

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'register') {
        await onSubmit(email, password, name);
        } else {
        await onSubmit(email, password);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md opacity-80">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {type === 'register' ? 'Registrarse' : 'Iniciar Sesión'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {type === 'register' && (
            <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre (Opcional)
            </label>
            <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
            />
            </div>
        )}

        <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
            </label>
            <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            />
        </div>

        <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña
            </label>
            <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            />
            {type === 'register' && (
            <p className="text-gray-600 text-xs italic">
                La contraseña debe tener al menos 6 caracteres.
            </p>
            )}
        </div>

        <div className="flex items-center justify-between mb-4"> {/* Añadido mb-4 para espacio */}
            <button
            type="submit"
            className="bg-[#B693E4] hover:bg-[#A37ADF] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full opacity-100 border-[#882DC3] border-2"
            disabled={loading}
            >
            {loading ? 'Cargando...' : (type === 'register' ? 'Registrar' : 'Iniciar Sesión')}
            </button>
        </div>

        {/* Condicional para el texto y el enlace */}
        <div className="text-center text-gray-600 text-sm">
            {type === 'login' ? (
            <p>
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-[#882DC3]  font-bold">
                Regístrate
                </Link>
            </p>
            ) : (
            <p>
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#882DC3] font-bold">
                Inicia Sesión
                </Link>
            </p>
            )}
        </div>
        </form>
    );
};

export default AuthForm;