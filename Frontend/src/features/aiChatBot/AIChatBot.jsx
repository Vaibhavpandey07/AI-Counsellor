import { useContext, useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import Context from "../../Context/Context";
import { AuroraBackground } from "../../components/layout/AuroraBackground";
import api from "../../api/axios";
import Swal from "sweetalert2";

/* ---------------- QUICK PROMPTS ---------------- */
const QUICK_PROMPTS = [
  {
    label: "🎯 Shortlist universities for me",
    prompt: "Shortlist the best universities for my profile",
  },
  {
    label: "📊 What are my chances?",
    prompt: "What are my chances of getting into top universities?",
  },
  {
    label: "💸 Scholarships I can apply for",
    prompt: "Suggest scholarships suitable for my profile",
  },
  {
    label: "🛂 Next steps after shortlisting",
    prompt: "What should be my next steps after shortlisting universities?",
  },
];

/* ---------------- SIDE CARD ---------------- */
function AISideCard({ onPromptClick }) {
  return (
    <div className="w-[320px] bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          🤖 AI Assistant
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          I analyze your profile, chances, and universities to guide you step by step.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600 uppercase">
          Quick actions
        </p>

        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(p.prompt)}
            className="w-full text-left px-4 py-3 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 text-sm transition shadow-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="text-[11px] text-gray-500 mt-auto">
        AI suggestions are advisory • Always verify requirements
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function AIChatBot() {
  const obj = useContext(Context);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: `Hello ${obj.username}, I’m your AI study abroad assistant. Ask me about universities, chances, scholarships, or next steps.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- SPEECH TO TEXT ---------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  };

  /* ---------- TEXT TO SPEECH ---------- */
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = async (promptOverride) => {
    const message = promptOverride ?? input;
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");

    try {
      const res = await api.post("/api/v1/ai/aiChatBot", { message });
      const data = res.data.data;

      setMessages((prev) => [...prev, { role: "ai", content: data.message }]);
      speak(data.message);

      /* ---------- SWEET ALERT FOR SHORTLIST ---------- */
      if (data.type === "shortlist_action" && data.universitiesMentioned?.length) {
        for (const uni of data.universitiesMentioned) {
          await Swal.fire({
            icon: "success",
            title: "University Shortlisted 🎉",
            html: `
              <strong>${uni.universityName}</strong>
              <br/>
              <small style="color:#666">${uni.reason || ""}</small>
            `,
            confirmButtonText: "Got it",
            confirmButtonColor: "#7c3aed",
          });
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while talking to AI.",
      });
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="relative min-h-screen w-full px-6 py-10 flex justify-center">
      <AuroraBackground />

      {/* CENTERED RESPONSIVE LAYOUT */}
      <div className="mt-16 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start z-10">

        {/* CHAT */}
        <div className="w-full max-w-4xl h-[720px] bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 flex flex-col overflow-hidden mx-auto">
          
          {/* HEADER */}
          <div className="flex items-center gap-3 px-6 py-4 bg-purple-600 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Study Abroad Assistant</h1>
              <p className="text-xs text-purple-100">
                Personalized guidance • Voice enabled
              </p>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-md ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 bg-white/40 backdrop-blur-lg border-t flex items-center gap-3">
            <button
              onClick={startListening}
              className={`p-3 rounded-full transition ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-purple-600 text-white"
              }`}
            >
              <Mic size={20} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about universities, chances, visas…"
              className="flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
            />

            <button
              onClick={() => sendMessage()}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* SIDE CARD (HIDDEN ON MOBILE) */}
        <div className="hidden lg:block">
          <AISideCard onPromptClick={(p) => sendMessage(p)} />
        </div>

      </div>
    </div>
  );
}