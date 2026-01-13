import React, { useState, useEffect } from "react";

export const Timer = ({ isRunning, resetToken }) => { 
    const [seconds, setSeconds] = useState(0);

    // 1. Efecto para manejar el intervalo (el "tic-tac")
    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1)
            }, 1000);
        }

        // Limpieza: detener el reloj si el componente se desmonta o isRunning cambia
        return () => clearInterval(interval);
    }, [isRunning]);

    // 2. Efecto para Reiniciar (cuando cambia el token)
    useEffect(() => {
        setSeconds(0);
    }, [resetToken]);

    // Helper para formatear HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-xl font-mono font-bold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 min-w-[140px] text-center">
            ⏱️ {formatTime(seconds)}
        </div>
    )
}

