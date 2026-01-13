import { useEffect, useState } from 'react'
import { Board } from './components/Board';
import { Numbers } from './components/Numbers';
import { Timer } from './components/Timer';
import { generarTablero, isValido, arrayDosDim, esTableroCorrecto, solveSudoku } from './utils/solver';

function App() {
    // ESTADOS
    const [board, setBoard] = useState(Array(81).fill('0')); // Estado para el tablero
    const [initialBoard, setInitialBoard] = useState(Array(81).fill('0')); // Estado para iniciar tablero
    const [selectedIndex, setSelectedIndex] = useState(null); // Estado para seleccionar celdas
    const [errores, setErrores] = useState(0); // Estado para detectar errores
    const [isGameWon, setIsGameWon] = useState(false); // Estado para saber si hay ganador
    const [resetTimer, setResetTimer] = useState(0); // Estado para controlar el reset del timer
    const [hasGivenUp, setHasGivenUp] = useState(false); // Estado para cuando el tablero lo resuelva la computadora

    useEffect(() => {
        iniciarNuevoJuego();
    }, []);

    // DETECCIÓN DE VICTORIA
    useEffect(() => {
        // 1. Si se rindió, salimos inmediatamente (No hay victoria)
        if (hasGivenUp) return;

        // 2. Si el tablero está lleno y correcto, activamos victoria
        if (board.length > 0 && !board.includes('0')) {
            const tablero2D = arrayDosDim(board);
            if (esTableroCorrecto(tablero2D)) {
                setIsGameWon(true);
            }
        }
    }, [board, hasGivenUp]);

    // --- CÁLCULO DEL NÚMERO A RESALTAR (NUEVO) ---
    // Obtenemos el valor de la celda seleccionada actualmente.
    const selectedValue = selectedIndex !== null ? board[selectedIndex] : null;

    // Definimos el número a resaltar: solo si existe y NO es un cero.
    const highlightedNumber = (selectedValue && selectedValue !== '0') ? selectedValue : null;

    const iniciarNuevoJuego = () => {
        const nuevoTablero = generarTablero(); 
        setBoard([...nuevoTablero]);
        setInitialBoard([...nuevoTablero]);
        setErrores(0);
        setSelectedIndex(null);
        setIsGameWon(false);
        setHasGivenUp(false); // Reiniciamos la bandera de rendirse
        setResetTimer(prev => prev + 1); 
    };

    const handleResolver = () => {
        if (!confirm("¿Te rindes? La computadora resolverá el juego.")) return;

        const solucion = solveSudoku(board); 

        if (solucion) {
            setHasGivenUp(true); // ¡Marcamos la derrota moral!
            setBoard(solucion);
            setSelectedIndex(null);
        } else {
            alert("Este tablero no tiene solución (quizás hay un error en los números puestos)");
        }
    };

    const handleCellClick = (index) => {
        // Bloqueamos clicks si ganó O si se rindió
        if (isGameWon || hasGivenUp) return; 
        
        if (initialBoard[index] === '0') {
            setSelectedIndex(index);
        } else {
            setSelectedIndex(null);
        }
    };

    const handleNumberClick = (number) => {
        if (isGameWon || hasGivenUp) return; 
        if (selectedIndex === null) return;
        if (initialBoard[selectedIndex] !== '0') return;

        if (number === '0') {
            const newBoard = [...board];
            newBoard[selectedIndex] = '0';
            setBoard(newBoard);
            return;
        }

        const tablero2D = arrayDosDim([...board]);
        const fila = Math.floor(selectedIndex / 9);
        const col = selectedIndex % 9;

        const esMovimientoValido = isValido(tablero2D, number, fila, col);

        if (esMovimientoValido) {
            const newBoard = [...board];
            newBoard[selectedIndex] = number;
            setBoard(newBoard);
        } else {
            setErrores(prev => prev + 1);
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col items-center py-10 font-sans relative'>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Sudoku React</h1>
            
            <div className="flex items-center gap-8 mb-6">
                <p className="text-lg font-semibold text-gray-700">
                    Errores: <span className={errores > 0 ? "text-red-500" : ""}>{errores}</span>
                </p>
                {/* El Timer se para si ganas O si te rindes */}
                <Timer isRunning={!isGameWon && !hasGivenUp} resetToken={resetTimer} />
            </div>
            
            {/* Mensaje de derrota opcional */}
            {hasGivenUp && (
                <p className="text-yellow-600 font-bold mb-2 animate-pulse">
                    🤖 Resuelto por la IA
                </p>
            )}

            <Board
                board={board}
                initialBoard={initialBoard}
                selectedIndex={selectedIndex}
                onCellClick={handleCellClick}
                highlightedNumber={highlightedNumber} // <--- AGREGAR ESTA LÍNEA
            />

            <Numbers onClickNumber={handleNumberClick} />

            <div className="flex gap-4 mt-8">
                <button 
                    onClick={iniciarNuevoJuego}
                    className="px-6 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition-colors shadow-lg"
                >
                    Nuevo Juego
                </button>
                
                {/* Desactivamos el botón si ya terminó el juego */}
                <button 
                    onClick={handleResolver}
                    disabled={isGameWon || hasGivenUp}
                    className={`px-6 py-2 font-bold rounded shadow-lg transition-colors ${
                        isGameWon || hasGivenUp 
                        ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                >
                    🪄 Resolver
                </button>
            </div>

            {/* MODAL VICTORIA */}
            {isGameWon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 ¡Ganaste!</h2>
                        <p className="text-gray-600 mb-6">Eres un crack del Sudoku.</p>
                        
                        <div className="flex justify-center gap-4 mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg w-full">
                                <p className="text-xs text-gray-500 uppercase">Errores</p>
                                <p className="text-xl font-bold text-blue-600">{errores}</p>
                            </div>
                        </div>

                        <button 
                            onClick={iniciarNuevoJuego}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Jugar Otra Vez
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App