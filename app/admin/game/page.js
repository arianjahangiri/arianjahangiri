// بازی پیشرفته فکری با React - بازی مسیر پنهان (Path Finder)
// بازیکن باید با کلیک روی سلول‌ها، یک مسیر درست از شروع تا پایان را پیدا کند

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
 

const GRID_SIZE = 5;
const createGrid = () => Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill("?"));

const generatePath = () => {
  let path = [[0, 0]];
  let [x, y] = [0, 0];

  while (x !== GRID_SIZE - 1 || y !== GRID_SIZE - 1) {
    const move = Math.random() < 0.5 ? "RIGHT" : "DOWN";
    if (move === "RIGHT" && y < GRID_SIZE - 1) y++;
    else if (move === "DOWN" && x < GRID_SIZE - 1) x++;
    path.push([x, y]);
  }

  return path;
};

export default function AdvancedMemoryGame() {
  const [grid, setGrid] = useState(createGrid());
  const [path, setPath] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const generated = generatePath();
    setPath(generated);
  }, []);

  const handleClick = (row, col) => {
    const current = [...selected, [row, col]];
    setSelected(current);

    const isCorrect = path[current.length - 1]?.[0] === row && path[current.length - 1]?.[1] === col;
    if (!isCorrect) {
      setMessage("مسیر اشتباه بود! دوباره تلاش کن.");
      setSelected([]);
    } else if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) {
      setMessage("تبریک! مسیر درست را پیدا کردی 🎉");
    }
  };

  const handleReset = () => {
    setGrid(createGrid());
    setSelected([]);
    setPath(generatePath());
    setMessage("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🧠 بازی مسیر پنهان</h2>
      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const isSelected = selected.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );
            return (
              <Button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                variant="outline"
                className={`h-12 w-12 ${isSelected ? "bg-green-500 text-white" : ""}`}
              >
                {isSelected ? "✔️" : "?"}
              </Button>
            );
          })
        )}
      </div>
      {message && <div className="mt-4 text-center text-lg font-semibold">{message}</div>}
      <div className="text-center mt-4">
        <Button onClick={handleReset} variant="secondary">
          شروع مجدد بازی 🔄
        </Button>
      </div>
    </div>
  );
}
