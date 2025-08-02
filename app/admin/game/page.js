"use client";

import React, { useState, useEffect } from "react";

const HUMAN = "X";
const AI = "O";

const SIZE = 3;
const WIN_LENGTH = 3;

function generateBoard(size) {
  return Array(size * size).fill(null);
}

function checkWinner(board, player) {
  const checkLine = (start, step) => {
    let count = 0;
    for (let i = 0; i < WIN_LENGTH; i++) {
      if (board[start + i * step] === player) count++;
      else break;
    }
    return count === WIN_LENGTH;
  };

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const idx = row * SIZE + col;

      if (col <= SIZE - WIN_LENGTH && checkLine(idx, 1)) return true;
      if (row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE)) return true;
      if (col <= SIZE - WIN_LENGTH && row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE + 1)) return true;
      if (col >= WIN_LENGTH - 1 && row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE - 1)) return true;
    }
  }
  return false;
}

function isTie(board) {
  return board.every((cell) => cell !== null);
}

function getBestMove(board) {
  const emptyCells = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((x) => x !== null);

  // 1. اگر کامپیوتر می‌تونه ببره، همون‌جا بازی کن
  for (let idx of emptyCells) {
    const testBoard = [...board];
    testBoard[idx] = AI;
    if (checkWinner(testBoard, AI)) return idx;
  }

  // 2. اگر انسان در حرکت بعدی می‌تونه ببره، جلوشو بگیر
  for (let idx of emptyCells) {
    const testBoard = [...board];
    testBoard[idx] = HUMAN;
    if (checkWinner(testBoard, HUMAN)) return idx;
  }

  // 3. وسط رو بگیر اگر خالیه
  const center = Math.floor((SIZE * SIZE) / 2);
  if (board[center] === null) return center;

  // 4. یک خانه رندوم از خانه‌های خالی
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState(generateBoard(SIZE));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("ai");

  useEffect(() => {
    if (mode === "ai" && !isHumanTurn && !message) {
      const bestMove = getBestMove(board);
      if (bestMove !== undefined) {
        const newBoard = [...board];
        newBoard[bestMove] = AI;
        if (checkWinner(newBoard, AI)) {
          setBoard(newBoard);
          setMessage("کامپیوتر برنده شد! 😢");
        } else if (isTie(newBoard)) {
          setBoard(newBoard);
          setMessage("بازی مساوی شد!");
        } else {
          setBoard(newBoard);
          setIsHumanTurn(true);
        }
      }
    }
  }, [isHumanTurn]);

  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key === "1") {
        const newBoard = [...board];
        for (let i = 0; i < WIN_LENGTH; i++) {
          newBoard[i] = HUMAN;
        }
        setBoard(newBoard);
        setMessage("تقلب فعال شد! شما برنده شدید 🎉");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || message) return;

    const newBoard = [...board];
    newBoard[index] = isHumanTurn ? HUMAN : AI;

    if (checkWinner(newBoard, isHumanTurn ? HUMAN : AI)) {
      setBoard(newBoard);
      setMessage(isHumanTurn ? "تبریک! شما برنده شدید 🎉" : "بازیکن دوم برنده شد! 🎉");
    } else if (isTie(newBoard)) {
      setBoard(newBoard);
      setMessage("بازی مساوی شد!");
    } else {
      setBoard(newBoard);
      setIsHumanTurn((prev) => !prev);
    }
  };

  const resetGame = () => {
    setBoard(generateBoard(SIZE));
    setMessage("");
    setIsHumanTurn(true);
  };

  const switchMode = (selectedMode) => {
    resetGame();
    setMode(selectedMode);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">بازی دوز ۵×۵ سریع 🎮</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => switchMode("ai")}
          className={`px-4 py-2 rounded ${mode === "ai" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          با ربات 🤖
        </button>
        <button
          onClick={() => switchMode("multiplayer")}
          className={`px-4 py-2 rounded ${mode === "multiplayer" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          دو نفره 👥
        </button>
      </div>

      <div
        className="grid gap-1 mb-4"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (mode === "ai" && !isHumanTurn) return;
              handleClick(idx);
            }}
            className="aspect-square border rounded flex items-center justify-center text-3xl font-bold hover:bg-gray-100 disabled:text-gray-400"
            disabled={!!cell || !!message}
          >
            {cell}
          </button>
        ))}
      </div>

      {message && <div className="mb-4 text-lg font-semibold">{message}</div>}

      <button
        onClick={resetGame}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full max-w-xs mx-auto block"
      >
        شروع مجدد بازی
      </button>
    </div>
  );
}
