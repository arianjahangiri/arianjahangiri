"use client";

import React, { useState, useEffect, useRef } from "react";

const HUMAN = "X";
const AI = "O";

const WINNING_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6], // diagonals
];

// بررسی برنده
function checkWinner(board, player) {
  return WINNING_COMBOS.some(combo =>
    combo.every(idx => board[idx] === player)
  );
}
// بررسی تساوی
function isTie(board) {
  return board.every(cell => cell !== null);
}
// مینی‌مکس
function minimax(newBoard, player) {
  const availSpots = newBoard.reduce((acc, val, idx) => {
    if (val === null) acc.push(idx);
    return acc;
  }, []);
  if (checkWinner(newBoard, HUMAN)) return { score: -10 };
  else if (checkWinner(newBoard, AI)) return { score: 10 };
  else if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for(let i=0; i<availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if(player === AI) {
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
  if(player === AI) {
    let bestScore = -Infinity;
    for(let i=0; i<moves.length; i++) {
      if(moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for(let i=0; i<moves.length; i++) {
      if(moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// استخراج ویژگی ساده انرژی صوت (RMS)
async function getAudioFeatures(audioBlob) {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  // محاسبه RMS (ریشه میانگین مربعات)
  let sumSquares = 0;
  for(let i=0; i<channelData.length; i++) {
    sumSquares += channelData[i] * channelData[i];
  }
  const rms = Math.sqrt(sumSquares / channelData.length);
  audioContext.close();
  return rms;
}

// مقایسه انرژی صوتی دو صدا (تشخیص ساده)
async function compareAudioBlobs(blob1, blob2) {
  const rms1 = await getAudioFeatures(blob1);
  const rms2 = await getAudioFeatures(blob2);
  // اگر اختلاف RMS کمتر از آستانه بود، قبول کن
  return Math.abs(rms1 - rms2) < 0.05;
}

export default function VoiceAuthTicTacToe() {
  const [stage, setStage] = useState("init"); // init, record, verify, success, fail
  const [message, setMessage] = useState("");
  const [storedAudio, setStoredAudio] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [gameMessage, setGameMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // بازی - مینی‌مکس و بقیه در بالا

  // شروع ضبط صدا
  const startRecording = async () => {
    setMessage("در حال ضبط صدا... لطفاً جمله مخفی را بگو");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => {
        chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if(stage === "record") {
          // ذخیره صدا در localStorage به صورت base64
          const base64 = await blobToBase64(blob);
          localStorage.setItem("storedVoice", base64);
          setStoredAudio(blob);
          setMessage("صدای شما ذخیره شد. لطفاً دوباره ورود کنید.");
          setStage("verify");
        } else if(stage === "verify") {
          // مقایسه صدای ضبط شده با ذخیره شده
          const storedBase64 = localStorage.getItem("storedVoice");
          if(!storedBase64) {
            setMessage("صدایی ذخیره نشده است. لطفا ابتدا ثبت کنید.");
            setStage("record");
            return;
          }
          const storedBlob = base64ToBlob(storedBase64, "audio/webm");
          const match = await compareAudioBlobs(blob, storedBlob);
          if(match) {
            setMessage("صدا مطابقت داشت. خوش آمدید!");
            setStage("success");
          } else {
            setMessage("صدای شما مطابقت ندارد. دوباره تلاش کنید.");
            setStage("fail");
          }
        }
      };
      mediaRecorderRef.current.start();
      setTimeout(() => {
        mediaRecorderRef.current.stop();
      }, 4000); // ضبط 4 ثانیه
    } catch (e) {
      setMessage("امکان دسترسی به میکروفون وجود ندارد.");
    }
  };

  // تبدیل Blob به Base64
  const blobToBase64 = (blob) => new Promise((res) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result);
    reader.readAsDataURL(blob);
  });

  // تبدیل Base64 به Blob
  const base64ToBlob = (base64, type) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for(let i=0; i<byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  };

  // بازی Tic Tac Toe:
  useEffect(() => {
    if (!isHumanTurn && stage === "success") {
      const bestMove = minimax(board.slice(), AI);
      if (bestMove && bestMove.index !== undefined) {
        const newBoard = [...board];
        newBoard[bestMove.index] = AI;
        setBoard(newBoard);
        setIsHumanTurn(true);

        if (checkWinner(newBoard, AI)) {
          setGameMessage("کامپیوتر برنده شد! 😢");
        } else if (isTie(newBoard)) {
          setGameMessage("بازی مساوی شد!");
        }
      }
    }
  }, [isHumanTurn, board, stage]);

  const handleClick = (index) => {
    if (board[index] || gameMessage || stage !== "success") return;

    const newBoard = [...board];
    newBoard[index] = HUMAN;
    setBoard(newBoard);

    if (checkWinner(newBoard, HUMAN)) {
      setGameMessage("تبریک! شما برنده شدید 🎉");
    } else if (isTie(newBoard)) {
      setGameMessage("بازی مساوی شد!");
    } else {
      setIsHumanTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameMessage("");
    setIsHumanTurn(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      {(stage === "init" || stage === "record" || stage === "verify" || stage === "fail") && (
        <>
          <h2 className="text-2xl font-bold mb-4">احراز هویت با صدای شما 🎤</h2>
          <p className="mb-2">
            {stage === "init" && "برای اولین بار لطفا صدای خود را ضبط کنید (مثلا جمله 'سلام، من کاربر هستم')."}
            {stage === "record" && "در حال ضبط صدای شما... لطفا صحبت کنید."}
            {stage === "verify" && "لطفا صدای خود را دوباره ضبط کنید برای تایید هویت."}
            {stage === "fail" && "صدای ضبط شده با صدای ذخیره شده مطابقت ندارد. دوباره تلاش کنید."}
          </p>
          <button
            onClick={() => {
              if(stage === "init") setStage("record");
              else if(stage === "fail") setStage("verify");
              else startRecording();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {stage === "init" && "شروع ضبط صدا"}
            {stage === "record" && "شروع ضبط"}
            {stage === "verify" && "تایید صدای من"}
            {stage === "fail" && "تلاش مجدد"}
          </button>
          <p className="mt-4 text-red-600 font-semibold">{message}</p>
        </>
      )}

      {stage === "success" && (
        <>
          <h2 className="text-2xl font-bold mb-4">بازی دوز سخت 🎯</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                disabled={!!cell || !!gameMessage}
                className="w-20 h-20 border rounded flex items-center justify-center text-5xl font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                {cell}
              </button>
            ))}
          </div>
          {gameMessage && <div className="mb-4 text-lg font-semibold">{gameMessage}</div>}
          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            شروع مجدد بازی
          </button>
        </>
      )}
    </div>
  );
}
