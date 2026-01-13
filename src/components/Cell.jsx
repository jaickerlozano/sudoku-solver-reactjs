import React from "react";

export default function Cell({ value, onClick, isInitial, isSelected, isHighlighted }) {
    
    // 1. CLASES BASE
    // Quitamos toda la lógica de borders props.
    // Todas las celdas tienen borde gris a la derecha y abajo.
    let classes = "h-10 w-10 sm:h-12 sm:w-12 flex justify-center items-center cursor-pointer select-none text-xl transition-colors duration-200 border-r border-b border-gray-300 ";

    // 2. ESTADOS (PRIORIDAD DE COLORES) 🚨
    if (isSelected) {
        // PRIORIDAD 1: La celda donde hiciste click (Azul oscuro)
        classes += " bg-blue-600 text-white font-bold ring-inset ring-2 ring-blue-600 z-30"; 
        
    } else if (isHighlighted) {
        // PRIORIDAD 2: (NUEVA) Es hermana de la seleccionada (Azul claro)
        // Usamos bg-blue-200 para el fondo.
        // Mantenemos la distinción de texto si es inicial (negrita) o user input (azul)
        classes += isInitial 
            ? " bg-blue-200 text-gray-900 font-extrabold" // Fija resaltada
            : " bg-blue-200 text-blue-800 font-bold";    // User input resaltada

    } else if (isInitial) {
        // PRIORIDAD 3: Celda fija normal (Gris)
        classes += " bg-gray-100 text-gray-900 font-extrabold";
    } else {
        // PRIORIDAD 4: Celda normal vacía o con otro número (Blanco)
        classes += " bg-white text-blue-600 hover:bg-blue-50";
    }

    return (
        <div className={classes} onClick={onClick}>
            {value !== '0' ? value : ''}
        </div>
    );
}