export default function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Contact Us
        </h2>

        {/* FORM */}
        <form className="flex flex-col gap-4">
          {/* NAME */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* MESSAGE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Write your message..."
              className="px-3 py-2 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            className="mt-4 h-11 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
}
