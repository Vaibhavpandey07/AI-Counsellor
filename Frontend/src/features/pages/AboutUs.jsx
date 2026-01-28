export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-20">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-black">
          About Creators Hub
        </h1>

        {/* PROJECT DESCRIPTION */}
        <p className="mt-6 text-gray-700 text-lg leading-relaxed text-center">
          <strong>Creators Hub</strong> is a content-focused platform designed to
          empower creators by giving them a space to upload, manage, and showcase
          their videos and channels. The goal of this project is to provide a
          clean, modern, and intuitive experience inspired by real-world
          creator platforms.
        </p>

        {/* DIVIDER */}
        <div className="my-8 h-px bg-gray-200" />

        {/* CREATOR SECTION */}
        <div className="flex flex-col items-center text-center">
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-indigo-500">
            <img
              src="https://via.placeholder.com/300"
              alt="Vaibhav Pandey"
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-black">
            Vaibhav Pandey
          </h2>

          <p className="text-gray-600 mt-1">
            Creator & Developer of Creators Hub
          </p>

          {/* LINKS */}
          <div className="flex gap-4 mt-5">
            <a
              href="https://linkedin.com/in/vaibhav-pandey-25280b235"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/Vaibhavpandey07"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* FOOTER TEXT */}
        <p className="mt-10 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Creators Hub. Built with passion for creators.
        </p>
      </div>
    </div>
  );
}
