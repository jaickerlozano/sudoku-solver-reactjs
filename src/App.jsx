import { useEffect, useState } from 'react'
import { Board } from './components/Board';
import { Numbers } from './components/Numbers';
import { Timer } from './components/Timer';
import { generarTablero, isValido, arrayDosDim, esTableroCorrecto, solveSudoku } from './utils/solver';

// Clave para guardar en el navegador
const STORAGE_KEY = 'sudoku-game-v1';

function App() {
    
    // --- 1. FUNCIÓN PARA CARGAR DATOS (Lazy Init) ---
    // Esta función busca si hay algo guardado. Si no, devuelve el valor por defecto.
    const loadState = (key, defaultValue) => {
        try {
            const savedGame = localStorage.getItem(STORAGE_KEY);
            if (savedGame) {
                const parsedGame = JSON.parse(savedGame);
                // Si existe la propiedad que buscamos, la devolvemos
                return parsedGame[key] !== undefined ? parsedGame[key] : defaultValue;
            }
        } catch (error) {
            console.error("Error cargando partida:", error);
        }
        return defaultValue;
    };

    // --- 2. ESTADOS CON CARGA AUTOMÁTICA ---
    // En lugar de useState(valor), usamos useState(() => loadState(...))
    
    const [board, setBoard] = useState(() => loadState('board', Array(81).fill('0'))); // Estado para el tablero
    const [initialBoard, setInitialBoard] = useState(() => loadState('initialBoard', Array(81).fill('0'))); // Estado para iniciar tablero
    // El timer siempre arranca en 0 al recargar (es complejo persistir el tiempo exacto sin desfasarse)
    const [resetTimer, setResetTimer] = useState(0); // Estado para controlar el reset del timer
    const [selectedIndex, setSelectedIndex] = useState(null); // Estado para seleccionar celdas
    
    // Estos también los guardamos para que no pierda su conteo de errores ni si se rindió
    const [errores, setErrores] = useState(() => loadState('errores', 0)); // Estado para detectar errores
    const [isGameWon, setIsGameWon] = useState(() => loadState('isGameWon', false)); // Estado para saber si hay ganador
    const [hasGivenUp, setHasGivenUp] = useState(() => loadState('hasGivenUp', false)); // Estado para cuando el tablero lo resuelva la computadora

    // --- CÁLCULO DEL NÚMERO A RESALTAR ---
    const selectedValue = selectedIndex !== null ? board[selectedIndex] : null;
    const highlightedNumber = (selectedValue && selectedValue !== '0') ? selectedValue : null;


    // --- 3. EFECTO PARA INICIAR JUEGO SI NO HAY NADA ---
    useEffect(() => {
        // Solo generamos tablero nuevo si el tablero actual está vacío (todo '0')
        // Esto evita que sobrescriba la partida guardada al recargar
        if (board.every(cell => cell === '0')) {
            iniciarNuevoJuego();
        }
    }, []);


    // --- 4. EFECTO MÁGICO DE GUARDADO (Auto-Save) ---
    useEffect(() => {
        // Creamos un objeto con TODO lo que queremos salvar
        const gameState = {
            board,
            initialBoard,
            errores,
            isGameWon,
            hasGivenUp
        };
        // Lo guardamos como texto en el navegador
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        
    }, [board, initialBoard, errores, isGameWon, hasGivenUp]); // Se ejecuta cada vez que algo de esto cambia


    // DETECCIÓN DE VICTORIA
    useEffect(() => {
        if (hasGivenUp) return;
        if (board.length > 0 && !board.includes('0')) {
            const tablero2D = arrayDosDim(board);
            if (esTableroCorrecto(tablero2D)) {
                setIsGameWon(true);
            }
        }
    }, [board, hasGivenUp]);


    const iniciarNuevoJuego = () => {
        const nuevoTablero = generarTablero(); 
        
        // Actualizamos el estado de React
        setBoard([...nuevoTablero]);
        setInitialBoard([...nuevoTablero]);
        setErrores(0);
        setSelectedIndex(null);
        setIsGameWon(false);
        setHasGivenUp(false);
        setResetTimer(prev => prev + 1); 
        
        // IMPORTANTE: El useEffect de guardado (paso 4) se encargará de
        // actualizar el localStorage automáticamente cuando estos estados cambien.
    };

    const handleResolver = () => {
        if (!confirm("¿Te rindes? La computadora resolverá el juego.")) return;

        const solucion = solveSudoku(board); 

        if (solucion) {
            setHasGivenUp(true);
            setBoard(solucion);
            setSelectedIndex(null);
        } else {
            alert("Este tablero no tiene solución (quizás hay un error en los números puestos)");
        }
    };

    const handleCellClick = (index) => {
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
        <div className='min-h-screen w-full flex flex-col items-center py-10 font-sans bg-linear-to-br from-blue-50 via-white to-gray-200'>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Sudoku Master</h1>
            
            <div className="flex items-center gap-8 mb-6">
                <p className="text-lg font-semibold text-gray-700">
                    Errores: <span className={errores > 0 ? "text-red-500" : ""}>{errores}</span>
                </p>
                <Timer isRunning={!isGameWon && !hasGivenUp} resetToken={resetTimer} />
            </div>
            
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
                highlightedNumber={highlightedNumber}
            />

            <Numbers onClickNumber={handleNumberClick} />

            <div className="flex gap-4 mt-8">
                <button 
                    onClick={iniciarNuevoJuego}
                    className="px-6 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition-colors shadow-lg cursor-pointer"
                >
                    Nuevo Juego
                </button>
                
                <button 
                    onClick={handleResolver}
                    disabled={isGameWon || hasGivenUp}
                    className={`px-6 py-2 font-bold rounded shadow-lg transition-colors cursor-pointer ${
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
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
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