# 🧩 Sudoku Master - React & Tailwind CSS

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-327FC7?style=for-the-badge&logo=github&logoColor=white)

Un juego de Sudoku moderno, interactivo y con capacidad de **autoresolución (Solver)**, construido con las últimas tecnologías del desarrollo web frontend.

🔗 **[JUEGA AQUÍ - DEMO EN VIVO](https://jaickerlozano.github.io/sudoku-solver-reactjs/)**

## 🚀 Características Principales

Este no es solo un tablero estático. Incluye lógica avanzada y una experiencia de usuario (UX) pulida:

- **Algoritmo Backtracking:** Incorpora un motor capaz de resolver cualquier Sudoku válido en milisegundos.
- **Validación en Tiempo Real:** Impide ingresar números que violen las reglas del Sudoku (filas, columnas o cuadrantes).
- **Asistencia Visual Inteligente:** Al seleccionar un número, se resaltan todas las celdas que contienen el mismo valor para facilitar la lectura del tablero.
- **Sistema de Estados de Juego:**
  - ⏱️ **Cronómetro:** Temporizador funcional que se detiene al ganar o rendirse.
  - 🏆 **Detección de Victoria:** Modal de felicitación al completar el tablero correctamente.
  - 🤖 **Modo "Rendirse":** La IA toma el control y resuelve el juego automáticamente.
- **Diseño Responsive:** Adaptado perfectamente para móviles y escritorio gracias a **Tailwind CSS**.
- **UI Moderna:** Uso de gradientes, efectos de glassmorphism y transiciones suaves.

## 🛠️ Tecnologías Utilizadas

- **React JS (Hooks):** Manejo de estados complejos (`useState`, `useEffect`) para la lógica del juego.
- **Vite:** Entorno de desarrollo ultrarrápido.
- **Tailwind CSS:** Estilizado moderno y responsivo (utilizando la última sintaxis de gradientes).
- **Algoritmia:** Lógica de resolución de problemas mediante recursividad (Backtracking).

## 📦 Instalación y Uso Local

Si quieres clonar este proyecto y correrlo en tu máquina:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/jaickerlozano/sudoku-solver-reactjs.git](https://github.com/jaickerlozano/sudoku-solver-reactjs.git)
    cd sudoku-solver-reactjs
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Corre el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre tu navegador en `http://localhost:5173`.

## 💡 ¿Cómo funciona el Solver?

El botón "Resolver" utiliza un algoritmo de **Backtracking** (Vuelta atrás). Funciona de la siguiente manera:
1.  Busca una celda vacía.
2.  Prueba números del 1 al 9.
3.  Si un número es válido según las reglas, lo coloca y pasa a la siguiente celda (recursividad).
4.  Si llega a un punto muerto, se "devuelve" (backtrack), borra el número y prueba el siguiente.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia [MIT](LICENSE).

---

Desarrollado con ❤️ por **[Jaicker Lozano](https://github.com/jaickerlozano)**
