// Función para validar si el tablero es vacío
export function esTableroVacio(tableroPlano) {
    return tableroPlano.every(c => c === "0"); 
}

// Función para validar que el tablero ingresado cumple con las reglas de un sudoku
export function tableroEsValido(tableroPlano) {
    const tablero = arrayDosDim([...tableroPlano]);

    const sinDuplicados = arr => {
        const numeros = arr.filter(x => x !== '0');
        return new Set(numeros).size === numeros.length;
    };

    // Validar filas
    for (let fila = 0; fila < 9; fila++) {
        if (!sinDuplicados(tablero[fila])) return false;
    }

    // Validar columnas
    for (let col = 0; col < 9; col++) {
        const columna = tablero.map(f => f[col]);
        if (!sinDuplicados(columna)) return false;
    }

    // Validar cuadrantes 3x3
    for (let sr = 0; sr < 9; sr += 3) {
        for (let sc = 0; sc < 9; sc += 3) {

            const cuadrante = [];

            for (let r = sr; r < sr + 3; r++) {
                for (let c = sc; c < sc + 3; c++) {
                    cuadrante.push(tablero[r][c]);
                }
            }

            if (!sinDuplicados(cuadrante)) return false;
        }
    }

    return true;
}

// Función para verificar que el tablero ingresado tiene solución
export function tableroTieneSolucion(tableroPlano) {
    // Copia profunda
    const tablero = arrayDosDim([...tableroPlano]);

    return solveSudoku(tablero);
}


// Función para preparar tablero
export function prepararTableroInicial(tableroPlano) {

    if (esTableroVacio(tableroPlano)) {
        console.log("TABLERO VACÍO → creando uno automático");
        return generarTablero();
    }

    if (!tableroEsValido(tableroPlano)) {
        console.log("TABLERO INVÁLIDO → incumple reglas de Sudoku");
        return null;
    }

    // Validar si puede resolverse
    if (!tableroTieneSolucion(tableroPlano)) {
        console.log("TABLERO SIN SOLUCIÓN");
        return "NO_SOLUCION";
    }

    // Si todo está bien → devolver tablero ingresado
    return tableroPlano;
}

// Utilidad para mezclar un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function arrayDosDim(tableroPlano) {
    const tablero = [];
    for (let i = 0; i < 81; i += 9) {
        tablero.push(tableroPlano.slice(i, i + 9));
    }
    return tablero;
}

// Función para validar que se cumple las reglas del sudoku
export function isValido(tablero, num, fila, col) {
    const n = num.toString();

    // Validar fila
    for (let c = 0; c < 9; c++) {
        if (tablero[fila][c] === n) return false;
    }

    // Validar columna
    for (let r = 0; r < 9; r++) {
        if (tablero[r][col] === n) return false;
    }

    // Validar subcuadrante
    const startRow = Math.floor(fila / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (tablero[r][c] === n) return false;
        }
    }

    return true;
}

// PASO 1: Generar solución completa por backtracking
function generarSolucionCompleta(tablero) {
    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {

            if (tablero[fila][col] === '0') {
                
                // Mezclar números para que siempre sea diferente
                const numeros = shuffle([1,2,3,4,5,6,7,8,9]);

                for (let num of numeros) {

                    if (isValido(tablero, num, fila, col)) {
                        tablero[fila][col] = num.toString();

                        if (generarSolucionCompleta(tablero)) return true;

                        tablero[fila][col] = '0'; // Backtrack
                    }
                }

                return false; // No se pudo llenar este espacio
            }
        }
    }

    return true; // COMPLETAMENTE LLENO
}

// PASO 2: Vaciar celdas (generar sudoku jugable)
function crearPuzzleDesdeSolucion(tableroCompleto, cantidadAEliminar = 50) {
    let tablero = tableroCompleto.flat();
    
    // Vaciar celdas al azar
    for (let i = 0; i < cantidadAEliminar; i++) {
        let index;
        do {
            index = Math.floor(Math.random() * 81);
        } while (tablero[index] === '0');
        
        tablero[index] = '0';
    }

    return tablero;
}

// Función principal para generar el tablero
export function generarTablero() {

    // Crear tablero vacío
    const tablero = Array.from({length: 9}, () => Array(9).fill('0'));

    // Generar solución completa
    generarSolucionCompleta(tablero);

    // Crear puzzle eliminando celdas
    const sudokuFinal = crearPuzzleDesdeSolucion(tablero, 50); // puedes ajustar 40–55

    return sudokuFinal;
}


// ------------------ SOLVE SUDOKU ------------------

export function solveSudoku(tableroPlano) {
    const tablero = arrayDosDim(tableroPlano);

    if (resolver(tablero)) {
        return tablero.flat();
    }
    return null;
}

function resolver(tablero) {
    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {

            if (tablero[fila][col] === '0') {

                for (let num = 1; num <= 9; num++) {

                    if (isValido(tablero, num, fila, col)) {
                        tablero[fila][col] = num.toString();

                        if (resolver(tablero)) return true;

                        tablero[fila][col] = '0'; // Backtrack
                    }
                }

                return false;
            }
        }
    }

    return true;
}

// Función para validar si se ha llenado todo el tablero
export function esTableroCorrecto(tablero) {
  // Validar filas
    for (let r = 0; r < 9; r++) {
        const fila = tablero[r];
        const set = new Set(fila);
        if (set.size !== 9 || [...set].includes('0')) return false;
    }

    // Validar columnas
    for (let c = 0; c < 9; c++) {
        const col = [];
        for (let r = 0; r < 9; r++) col.push(tablero[r][c]);

        const set = new Set(col);
        if (set.size !== 9 || [...set].includes('0')) return false;
    }

    // Validar subcuadrantes (3x3)
    for (let sr = 0; sr < 9; sr += 3) {
        for (let sc = 0; sc < 9; sc += 3) {
        const sub = [];
        for (let r = sr; r < sr + 3; r++) {
            for (let c = sc; c < sc + 3; c++) {
            sub.push(tablero[r][c]);
            }
        }

        const set = new Set(sub);
        if (set.size !== 9 || [...set].includes('0')) return false;
        }
    }

    return true;
}

// Módulo para funciones de guardado, carga y borrado en el localStorage

export function guardarEstado(tablero, errores, tiempoMs) {
    const data = {
        tablero,
        errores,
        tiempoMs,
        fecha: Date.now()
    };
    localStorage.setItem("sudoku_estado", JSON.stringify(data));
}

export function cargarEstado() {
    const data = localStorage.getItem("sudoku_estado");
    return data ? JSON.parse(data) : null;
}

export function borrarEstado() {
    localStorage.removeItem("sudoku_estado");
}
