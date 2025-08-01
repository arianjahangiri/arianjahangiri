"use client";

import React, { useState, useEffect } from "react";

const HUMAN = "X";
const AI = "O";

const BOARD_SIZE = 5;
const WIN_LENGTH = 4;

function generateWinningCombos(size, winLength) {
  const combos = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (col + winLength <= size) {
        combos.push(Array.from({ length: winLength }, (_, i) => row * size + col + i));
      }
      if (row + winLength <= size) {
        combos.push(Array.from({ length: winLength }, (_, i) => (row + i) * size + col));
      }
      if (row + winLength <= size && col + winLength <= size) {
        combos.push(Array.from({ length: winLength }, (_, i) => (row + i) * size + col + i));
      }
      if (row + winLength <= size && col - winLength + 1 >= 0) {
        combos.push(Array.from({ length: winLength }, (_, i) => (row + i) * size + col - i));
      }
    }
  }

  return combos;
}

const WINNING_COMBOS = generateWinningCombos(BOARD_SIZE, WIN_LENGTH);

function checkWinner(board, player) {
  return WINNING_COMBOS.some((combo) =>
    combo.every((index) => board[index] === player)
  );
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

    if (player === AI) {
      move.score = minimax(newBoard, HUMAN).score;
    } else {
      move.score = minimax(newBoard, AI).score;
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

export default function TicTacToeGame() {
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("ai");

  useEffect(() => {
    if (mode === "ai" && !isHumanTurn && !message) {
      const bestMove = minimax(board.slice(), AI);
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

  useEffect(() => {
    const handleCheatCode = (e) => {
      if (e.altKey && e.key === "1") {
        const newBoard = [...board];
        const winningCombo = WINNING_COMBOS.find((combo) =>
          combo.every((index) => newBoard[index] === null)
        );
        if (winningCombo) {
          winningCombo.forEach((index) => (newBoard[index] = HUMAN));
          setBoard(newBoard);
          setMessage("تقلب فعال شد! شما برنده شدید 🎉");
        }
      }
    };

    window.addEventListener("keydown", handleCheatCode);
    return () => window.removeEventListener("keydown", handleCheatCode);
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
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setMessage("");
    setIsHumanTurn(true);
  };

  const switchMode = (selectedMode) => {
    resetGame();
    setMode(selectedMode);
  };

  return (
    <div className="max-w-screen-sm mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">بازی دوز پیشرفته ۵×۵ 🎮</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => switchMode("ai")}
          className={`px-4 py-2 rounded ${mode === "ai" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          حالت با ربات 🤖
        </button>
        <button
          onClick={() => switchMode("multiplayer")}
          className={`px-4 py-2 rounded ${mode === "multiplayer" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          حالت دو نفره 👥
        </button>
      </div>

      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (mode === "ai" && !isHumanTurn) return;
              handleClick(idx);
            }}
            className="w-full aspect-square border rounded flex items-center justify-center text-2xl font-bold hover:bg-gray-100 disabled:text-gray-400"
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
