import React from "react";

export function Numbers({ onClickNumber }) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="flex justify-center gap-2 mt-4 flex-wrap px-4">
            {nums.map((num) => (
                <button
                    key={num}
                    onClick={() => onClickNumber(num.toString())}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-600 active:scale-95 transition-all shadow-md text-lg"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => onClickNumber('0')} // '0' representa vacío
                className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
                ⌫
            </button>
        </div>
    )
}