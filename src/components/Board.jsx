import React from "react";
import Cell from "./Cell";

export function Board({ board, initialBoard, onCellClick, selectedIndex, highlightedNumber }) {
    return ( 
        <div className="flex justify-center mt-8 mb-4">
            {/* Contenedor RELATIVO para que las líneas negras se posicionen respecto a él */}
            <div className="relative border-4 border-gray-900 shadow-xl rounded-sm max-w-lg w-full">
                
                {/* --- CAPA 1: EL GRID DE CELDAS --- */}
                {/* bg-gray-300 sirve para pintar los bordes exteriores finales si hiciera falta */}
                <div className="grid grid-cols-9 bg-white">
                    {board.map((cellValue, index) => (
                        <Cell
                            key={index}
                            value={cellValue}
                            isInitial={initialBoard[index] !== '0'}
                            isSelected={index === selectedIndex}
                            onClick={() => onCellClick(index)}

                            // 2. CALCULAMOS EL NUEVO PROP PARA CADA CELDA
                            // ¿El valor de esta celda es igual al número que queremos resaltar?
                            // (Y nos aseguramos que no sea '0')
                            isHighlighted={cellValue !== '0' && cellValue === highlightedNumber}
                        />
                    ))}
                </div>

                {/* --- CAPA 2: LAS LÍNEAS NEGRAS (OVERLAY) --- */}
                {/* pointer-events-none es VITAL para que los clics pasen a través de las líneas */}
                
                {/* Línea Vertical 1 (Al 33.33%) */}
                <div className="absolute top-0 bottom-0 left-[33.33%] w-0.5 bg-gray-900 pointer-events-none z-20"></div>
                
                {/* Línea Vertical 2 (Al 66.66%) */}
                <div className="absolute top-0 bottom-0 left-[66.66%] w-0.5 bg-gray-900 pointer-events-none z-20"></div>
                
                {/* Línea Horizontal 1 (Al 33.33%) */}
                <div className="absolute left-0 right-0 top-[33.33%] h-0.5 bg-gray-900 pointer-events-none z-20"></div>
                
                {/* Línea Horizontal 2 (Al 66.66%) */}
                <div className="absolute left-0 right-0 top-[66.66%] h-0.5 bg-gray-900 pointer-events-none z-20"></div>

            </div>
        </div>
    )
}