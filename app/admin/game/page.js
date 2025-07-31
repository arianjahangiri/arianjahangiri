"use client";

import React, { useState, useEffect } from "react";

const HUMAN = "X";
const AI = "O";

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // ردیف‌ها
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // ستون‌ها
  [0, 4, 8],
  [2, 4, 6], // قطرها
];

// تابع بررسی برنده
function checkWinner(board, player) {
  return WINNING_COMBOS.some((combo) =>
    combo.every((index) => board[index] === player)
  );
}

// تابع بررسی تساوی
function isTie(board) {
  return board.every((cell) => cell !== null);
}

// الگوریتم مینی‌مکس برای بهترین حرکت AI
function minimax(newBoard, player) {
  const availSpots = newBoard.reduce((acc, val, idx) => {
    if (val === null) acc.push(idx);
    return acc;
  }, []);

  if (checkWinner(newBoard, HUMAN)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, AI)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === AI) {
      const result = minimax(newBoard, HUMAN);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, AI);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === AI) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

export default function TicTacToeHard() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(false); // حالت مولتی پلیر

  useEffect(() => {
    if (!isMultiplayer && !isHumanTurn) {
      const bestMove = minimax(board.slice(), AI);
      if (bestMove && bestMove.index !== undefined) {
        const newBoard = [...board];
        newBoard[bestMove.index] = AI;
        setBoard(newBoard);
        setIsHumanTurn(true);

        if (checkWinner(newBoard, AI)) {
          setMessage("کامپیوتر برنده شد! 😢");
        } else if (isTie(newBoard)) {
          setMessage("بازی مساوی شد!");
        }
      }
    }
  }, [isHumanTurn, board, isMultiplayer]);

  const handleClick = (index) => {
    if (board[index] || message) return;

    const newBoard = [...board];
    newBoard[index] = isHumanTurn ? HUMAN : AI;
    setBoard(newBoard);

    if (checkWinner(newBoard, isHumanTurn ? HUMAN : AI)) {
      setMessage(isHumanTurn ? "تبریک! بازیکن اول برنده شد 🎉" : isMultiplayer ? "تبریک! بازیکن دوم برنده شد 🎉" : "کامپیوتر برنده شد! 😢");
    } else if (isTie(newBoard)) {
      setMessage("بازی مساوی شد!");
    } else {
      setIsHumanTurn(!isHumanTurn);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setMessage("");
    setIsHumanTurn(true);
  };

  const toggleMode = () => {
    resetGame();
    setIsMultiplayer((prev) => !prev);
  };

  return (
    <div className="max-w-sm mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">بازی دوز {isMultiplayer ? "مولتی‌پلیر" : "سخت"} 🎯</h2>

      <button
        onClick={toggleMode}
        className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full max-w-xs mx-auto block"
      >
        تغییر حالت به {isMultiplayer ? "ربات" : "مولتی‌پلیر"}
      </button>

      <div className="grid grid-cols-3 gap-2 mb-4 max-w-full mx-auto" style={{ maxWidth: "360px" }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={!!cell || !!message}
            className="
              w-full aspect-square
              border rounded
              flex items-center justify-center
              text-5xl font-bold
              hover:bg-gray-100
              disabled:cursor-not-allowed disabled:text-gray-400
            "
          >
            {cell}
          </button>
        ))}
      </div>

      {message && <div className="mb-4 text-lg font-semibold">{message}</div>}

      <button
        onClick={resetGame}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full max-w-xs mx-auto block"
      >
        شروع مجدد بازی
      </button>
    </div>
  );
}
