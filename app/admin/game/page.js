"use client";

import React, { useState, useEffect } from "react";

const HUMAN = "X";
const AI = "O";

const SIZE = 5; // تعداد خانه‌ها در هر ردیف/ستون
const WIN_LENGTH = 4; // طول ترکیب برنده

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

      if (col <= SIZE - WIN_LENGTH && checkLine(idx, 1)) return true; // افقی
      if (row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE)) return true; // عمودی
      if (col <= SIZE - WIN_LENGTH && row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE + 1)) return true; // قطر اصلی
      if (col >= WIN_LENGTH - 1 && row <= SIZE - WIN_LENGTH && checkLine(idx, SIZE - 1)) return true; // قطر فرعی
    }
  }

  return false;
}

function isTie(board) {
  return board.every((cell) => cell !== null);
}

function minimax(newBoard, player) {
  const availSpots = newBoard.reduce((acc, val, idx) => {
    if (val === null) acc.push(idx);
    return acc;
  }, []);

  if (checkWinner(newBoard, HUMAN)) return { score: -10 };
  if (checkWinner(newBoard, AI)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    move.score = player === AI
      ? minimax(newBoard, HUMAN).score
      : minimax(newBoard, AI).score;

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === AI) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState(generateBoard(SIZE));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("ai");

  useEffect(() => {
    if (mode === "ai" && !isHumanTurn && !message) {
      const bestMove = minimax([...board], AI);
      if (bestMove && bestMove.index !== undefined) {
        const newBoard = [...board];
        newBoard[bestMove.index] = AI;

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

  // کد تقلب: Alt + 1 → برد بازیکن
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
      <h2 className="text-2xl font-bold mb-4">بازی دوز ۵×۵ پیشرفته 🎮</h2>

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
