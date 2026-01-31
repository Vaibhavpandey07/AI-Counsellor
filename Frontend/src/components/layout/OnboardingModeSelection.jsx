import { Mic, FileText } from "lucide-react";
import { FloatingOrbsBackground } from "./FloatingOrbsBackground";
import { useNavigate } from "react-router-dom";

export default function OnboardingModeSelection({sideNav}) {

  const navigate = useNavigate();
   const onManual=() => {navigate("/user/onboarding/form")}
   const  onAI= () => {navigate("/user/onboarding/ai")}
  return (
       <div
      className={`
        fixed top-16 right-0 
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-2 md:px-4 py-4
        overflow-y-auto
        bg-gray-100
      `}
    >
      <FloatingOrbsBackground />

    <div className="relative  flex items-center justify-center  p-6">
      {/* Animated Background */}

      <div className="w-full max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            How would you like to complete your onboarding?
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Choose the way that feels most comfortable for you
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Manual Onboarding */}
          <div className="h-[500px] max-w-2xl mx-auto w-full rounded-3xl bg-white/40 backdrop-blur-2xl border border-purple-200 shadow-xl p-8 flex flex-col hover:scale-[1.02] transition">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <FileText className="text-purple-600" size={36} />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Manual Form Fill
              </h2>

              <p className="text-gray-600 text-base leading-relaxed max-w-sm">
                Prefer filling out details yourself? Go step by step through a
                structured form and submit when ready.
              </p>
            </div>

            <button
              onClick={onManual}
              className="mt-6 w-full py-4 rounded-xl bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition"
            >
              Continue Manually
            </button>
          </div>

          {/* AI Voice Assistant */}
          <div className="h-[500px] max-w-2xl mx-auto w-full rounded-3xl bg-white/40 backdrop-blur-2xl border border-purple-200 shadow-xl p-8 flex flex-col hover:scale-[1.02] transition">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Mic className="text-purple-600" size={36} />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                AI Voice Assistant
              </h2>

              <p className="text-gray-600 text-base leading-relaxed max-w-sm">
                Talk naturally with our AI assistant. Answer questions by voice
                or text and let AI fill the form for you.
              </p>
            </div>

            <button
              onClick={onAI}
              className="mt-6 w-full py-4 rounded-xl bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition"
            >
              Start with AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
        
        </div>
  );
}