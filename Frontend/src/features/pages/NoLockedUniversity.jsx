import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoLockedUniversity() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-purple-100 p-8 text-center">

        {/* ICON */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-purple-100">
          <Lock className="text-purple-600" size={36} />
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-2xl font-bold text-gray-800">
          No University Locked Yet
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
          You haven’t locked any university so far.  
          Locking a university helps us guide you with applications, documents,
          deadlines, and AI-powered suggestions.
        </p>

        {/* ACTION BUTTONS */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/user/univeristy/shorlistedUniversity")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            <ArrowRight size={18} />
            Shortlist Universities
          </button>

          <button
            onClick={() => navigate("/user/ai/chat")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition"
          >
            <Sparkles size={18} />
            Ask AI Counsellor
          </button>
        </div>

        {/* FOOTER NOTE */}
        <p className="mt-6 text-xs text-gray-400">
          You can lock a university anytime after shortlisting.
        </p>
      </div>
    </div>
  );
}