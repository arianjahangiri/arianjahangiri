import React, { useState } from "react";
import { FaSearch, FaDownload, FaMicrophone, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { saveAs } from "file-saver";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { v4 as uuidv4 } from "uuid";

const SmartAssistant = () => {
  // Search & Download
  const [query, setQuery] = useState("");
  const [downloading, setDownloading] = useState(false);
  const handleSearch = async () => {
    setDownloading(true);
    // فرض: یک API برای دانلود فیلم داری
    // const res = await axios.get(`/api/download?query=${query}`);
    // saveAs(res.data.url, `${query}.mp4`);
    setTimeout(() => {
      alert("دانلود انجام شد (دمو)");
      setDownloading(false);
    }, 2000);
  };

  // ChatBot
  const [messages, setMessages] = useState([{ id: 1, text: "سلام! سوالی داری؟", from: "bot" }]);
  const [input, setInput] = useState("");
  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { id: uuidv4(), text: input, from: "user" }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { id: uuidv4(), text: "پاسخ دمو: " + input, from: "bot" }]);
    }, 1000);
    setInput("");
  };

  // Todo List
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const addTodo = () => {
    if (!todo) return;
    setTodos([...todos, { id: uuidv4(), text: todo, done: false }]);
    setTodo("");
  };
  const toggleTodo = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = id => setTodos(todos.filter(t => t.id !== id));

  // Voice Assistant
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [active, setActive] = useState(false);
  const start = () => {
    setActive(true);
    SpeechRecognition.startListening({ continuous: true, language: "fa-IR" });
  };
  const stop = () => {
    setActive(false);
    SpeechRecognition.stopListening();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#232526] to-[#18181b] py-8 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Search & Download */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow mb-6">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 px-4 py-2 rounded bg-zinc-800 text-amber-200 focus:outline-none"
              placeholder="اسم فیلم یا مطلب را وارد کنید..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              disabled={!query || downloading}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition flex items-center gap-2"
            >
              <FaSearch />
              جستجو و دانلود
            </button>
          </div>
          {downloading && <div className="text-amber-400 mt-2 animate-pulse">در حال دانلود...</div>}
        </div>

        {/* ChatBot */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow mb-6">
          <div className="h-48 overflow-y-auto flex flex-col gap-2 mb-2">
            {messages.map(msg => (
              <div key={msg.id} className={`text-sm px-3 py-2 rounded ${msg.from === "bot" ? "bg-zinc-800 text-amber-300 self-start" : "bg-amber-600 text-white self-end"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded bg-zinc-800 text-amber-200 focus:outline-none"
              placeholder="پیام خود را بنویسید..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition">
              ارسال
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow mb-6">
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 px-4 py-2 rounded bg-zinc-800 text-amber-200 focus:outline-none"
              placeholder="کار جدید..."
              value={todo}
              onChange={e => setTodo(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
            />
            <button onClick={addTodo} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition flex items-center gap-2">
              <FaPlus /> افزودن
            </button>
          </div>
          <ul className="space-y-2">
            {todos.map(t => (
              <li key={t.id} className={`flex items-center justify-between px-3 py-2 rounded ${t.done ? "bg-amber-900 text-amber-400 line-through" : "bg-zinc-800 text-amber-200"}`}>
                <span onClick={() => toggleTodo(t.id)} className="cursor-pointer flex-1">{t.text}</span>
                <button onClick={() => removeTodo(t.id)} className="ml-2 text-red-400 hover:text-red-600"><FaTrash /></button>
                <button onClick={() => toggleTodo(t.id)} className="text-green-400 hover:text-green-600"><FaCheck /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Voice Assistant */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow mb-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={active ? stop : start}
              className={`rounded-full p-4 text-2xl transition shadow ${active ? "bg-amber-500 text-white animate-pulse" : "bg-zinc-800 text-amber-400 hover:bg-amber-600 hover:text-white"}`}
            >
              <FaMicrophone />
            </button>
            <span className="text-amber-200">{active ? "در حال گوش دادن..." : "برای صحبت کلیک کن"}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded p-3 text-amber-200 min-h-[40px]">{transcript}</div>
          <button onClick={resetTranscript} className="mt-2 text-xs text-amber-400 hover:text-amber-200">پاک کردن متن</button>
          {!browserSupportsSpeechRecognition && <div className="text-red-500 mt-2">مرورگر شما پشتیبانی نمی‌کند</div>}
        </div>
      </div>
    </div>
  );
};

export default SmartAssistant;