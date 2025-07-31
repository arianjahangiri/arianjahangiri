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

  useEffect(() => {
    if (!isHumanTurn) {
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
  }, [isHumanTurn, board]);

  const handleClick = (index) => {
    if (board[index] || message) return;

    const newBoard = [...board];
    newBoard[index] = HUMAN;
    setBoard(newBoard);

    if (checkWinner(newBoard, HUMAN)) {
      setMessage("تبریک! شما برنده شدید 🎉");
    } else if (isTie(newBoard)) {
      setMessage("بازی مساوی شد!");
    } else {
      setIsHumanTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setMessage("");
    setIsHumanTurn(true);
  };

  return (
    <div className="max-w-sm mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">بازی دوز سخت 🎯</h2>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={!!cell || !!message}
            className="w-20 h-20 border rounded flex items-center justify-center text-5xl font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {cell}
          </button>
        ))}
      </div>
      {message && <div className="mb-4 text-lg font-semibold">{message}</div>}
      <button
        onClick={resetGame}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        شروع مجدد بازی
      </button>
    </div>
  );
}
function JumpingCarGame() {
  const [carBottom, setCarBottom] = useState(0); // ارتفاع ماشین از پایین (0 یا 1 برای پریدن)
  const [obstacleLeft, setObstacleLeft] = useState(100); // موقعیت مانع (از راست به چپ)
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);

  // کنترل پرش ماشین
  const jump = () => {
    if (isJumping || gameOver) return;
    setIsJumping(true);
    setCarBottom(50); // ارتفاع پریدن (مثلاً 50px)
    setTimeout(() => {
      setCarBottom(0);
      setIsJumping(false);
    }, 500);
  };

  // حرکت مانع به سمت چپ و بررسی برخورد
  useEffect(() => {
    if (gameOver) return;

    const timerId = setInterval(() => {
      setObstacleLeft((prev) => {
        if (prev <= 0) return 100; // مانع به ابتدا برمیگردد
        return prev - 5;
      });
    }, 50);

    return () => clearInterval(timerId);
  }, [gameOver]);

  // چک برخورد مانع با ماشین
  useEffect(() => {
    if (
      obstacleLeft > 0 &&
      obstacleLeft < 20 && // وقتی مانع نزدیک ماشین است
      carBottom < 40 // و ماشین در ارتفاع پایین است (پریدن نکرده)
    ) {
      setGameOver(true);
    }
  }, [obstacleLeft, carBottom]);

  // کنترل دکمه space یا کلیک برای پرش
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.code === "Space") jump();
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [isJumping, gameOver]);

  return (
    <div
      ref={gameAreaRef}
      className="relative w-64 h-32 bg-blue-200 border border-gray-500 rounded overflow-hidden mx-auto mt-8"
      onClick={jump}
      style={{ cursor: "pointer" }}
    >
      {/* ماشین */}
      <div
        style={{
          position: "absolute",
          bottom: carBottom,
          left: 20,
          width: 30,
          height: 30,
          backgroundColor: "red",
          borderRadius: 5,
          transition: "bottom 0.3s",
        }}
      ></div>

      {/* مانع */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: `${obstacleLeft}%`,
          width: 20,
          height: 20,
          backgroundColor: "black",
          borderRadius: 3,
          transition: "left 0.05s linear",
        }}
      ></div>

      {gameOver && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center text-red-700 font-bold text-lg">
          بازی تمام شد! <br />
          برای شروع دوباره کلیک کنید
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGameOver(false);
              setObstacleLeft(100);
              setCarBottom(0);
            }}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            شروع مجدد
          </button>
        </div>
      )}
    </div>
  );
}

export default function MainGame() {
  return (
    <div className="p-6 space-y-8">
      <TicTacToeHard />
      <JumpingCarGame />
    </div>
  );
}