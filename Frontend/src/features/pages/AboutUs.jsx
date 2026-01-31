export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-20">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-black">
          About AI Counsellor
        </h1>

        {/* PROJECT DESCRIPTION */}
        <p className="mt-6 text-gray-700 text-lg leading-relaxed text-center">
          <strong>AI Counsellor</strong> is an intelligent, student-first guidance
          platform designed to help applicants make informed decisions about
          universities, applications, and next steps. It combines data-driven
          insights with conversational AI to provide clear, personalized, and
          actionable advice.
        </p>

        <p className="mt-4 text-gray-700 text-lg leading-relaxed text-center">
          From evaluating acceptance likelihood to guiding users through each
          application stage, AI Counsellor acts as a reliable companion throughout
          the entire admissions journey.
        </p>

        {/* DIVIDER */}
        <div className="my-8 h-px bg-gray-200" />

        {/* AI FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div className="p-5 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">
              🎓 Smart University Insights
            </h3>
            <p className="text-sm leading-relaxed">
              Understand acceptance chances, strengths, and risks using AI-powered
              analysis tailored to your profile.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">
              🧭 Step-by-Step Guidance
            </h3>
            <p className="text-sm leading-relaxed">
              Track your application progress and get contextual help at every
              stage, from shortlisting to final decisions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">
              🤖 Conversational AI Support
            </h3>
            <p className="text-sm leading-relaxed">
              Ask questions in plain language and receive clear, structured, and
              practical responses instantly.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">
              🔒 Secure & Private
            </h3>
            <p className="text-sm leading-relaxed">
              Your data stays private and is used only to improve guidance and
              recommendations.
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-gray-200" />

        {/* CREATOR / TEAM SECTION */}
        <div className="flex flex-col items-center text-center">
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-indigo-500 bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
            AI
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-black">
            Built with Students in Mind
          </h2>

          <p className="text-gray-600 mt-2 max-w-xl">
            AI Counsellor is built to reduce confusion, anxiety, and guesswork
            during the admissions process—making guidance accessible to everyone.
          </p>
        </div>

        {/* FOOTER TEXT */}
        <p className="mt-10 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} AI Counsellor. Helping students make confident decisions.
        </p>
      </div>
    </div>
  );
}