// components/DropdownMenu.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    // 1. Especificar el tipo de useRef: HTMLDivElement o HTMLElement
    const dropdownRef = useRef<HTMLDivElement>(null); // O useRef<HTMLElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // 2. Especificar el tipo del parámetro 'event' como MouseEvent
        const handleClickOutside = (event: MouseEvent) => {
        // 3. Asegurarse de que dropdownRef.current no es null antes de usar 'contains'
        //    y que event.target es un Node (necesario para contains)
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // El array de dependencias puede ser vacío si dropdownRef es una constante.

    return (
        <div className="relative" ref={dropdownRef}>
        <button
            onClick={toggleDropdown}
            className="
            flex items-center space-x-1
            text-black text-2xl font-medium
            hover:text-black focus:outline-none focus:text-black
            py-2 px-3 rounded-md
            "
        >
            <span>Programas</span>
            <svg
            className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
            ></path>
            </svg>
        </button>

        {isOpen && (
            <div
            className="
                absolute left-0 mt-2 w-48
                bg-[#9DFDE9] border-[#9DFDE9] rounded-md shadow-lg
                py-1 z-20
                origin-top-left transform scale-y-0 opacity-0
                transition-all duration-200 ease-out
                data-[open=true]:scale-y-100 data-[open=true]:opacity-100
            "
            data-open={isOpen}
            style={{ transformOrigin: 'top left' }}
            >
            <Link href="/programas/matematicas" passHref>
                <span
                className="
                    block px-4 py-2 text-BLACK
                    hover:bg-gray-100 hover:text-black
                    cursor-pointer
                "
                onClick={() => setIsOpen(false)}
                >
                Matemáticas
                </span>
            </Link>
            <Link href="/programas/espanol" passHref>
                <span
                className="
                    block px-4 py-2 text-BLACK
                    hover:bg-gray-100 hover:text-black
                    cursor-pointer
                "
                onClick={() => setIsOpen(false)}
                >
                Español
                </span>
            </Link>
            </div>
        )}
        </div>
    );
    };

    export default DropdownMenu;