import { useContext, useState } from "react";
import Context from "../../Context/Context";

export default function CommentSection() {
  const [commentText, setCommentText] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [showComments, setShowComments] = useState(false);

  const obj = useContext(Context);

  const comments = [
    {
      id: 1,
      name: "Rahul Sharma",
      message: "Amazing video! Very well explained.",
      replies: [
        { id: 1, name: "Creator", message: "Thanks a lot 🙌" },
        { id: 2, name: "Aman", message: "Agree with you!" }
      ]
    },
    {
      id: 2,
      name: "Neha Verma",
      message: "Please make backend videos also.",
      replies: []
    },
    {
      id: 1,
      name: "Rahul Sharma",
      message: "Amazing video! Very well explained.",
      replies: [
        { id: 1, name: "Creator", message: "Thanks a lot 🙌" },
        { id: 2, name: "Aman", message: "Agree with you!" }
      ]
    },
    {
      id: 2,
      name: "Neha Verma",
      message: "Please make backend videos also.",
      replies: []
    },
    {
      id: 1,
      name: "Rahul Sharma",
      message: "Amazing video! Very well explained.",
      replies: [
        { id: 1, name: "Creator", message: "Thanks a lot 🙌" },
        { id: 2, name: "Aman", message: "Agree with you!" }
      ]
    },
    {
      id: 2,
      name: "Neha Verma",
      message: "Please make backend videos also.",
      replies: []
    },
    {
      id: 1,
      name: "Rahul Sharma",
      message: "Amazing video! Very well explained.",
      replies: [
        { id: 1, name: "Creator", message: "Thanks a lot 🙌" },
        { id: 2, name: "Aman", message: "Agree with you!" }
      ]
    },
    {
      id: 2,
      name: "Neha Verma",
      message: "Please make backend videos also.",
      replies: []
    },
    {
      id: 1,
      name: "Rahul Sharma",
      message: "Amazing video! Very well explained.",
      replies: [
        { id: 1, name: "Creator", message: "Thanks a lot 🙌" },
        { id: 2, name: "Aman", message: "Agree with you!" }
      ]
    },
    {
      id: 2,
      name: "Neha Verma",
      message: "Please make backend videos also.",
      replies: []
    },
  ];

  return (
    <div className="w-full mt-6 p-4">

      {/* TOTAL COMMENTS HEADER */}
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h2>

      {/* ADD COMMENT */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment"
            className="w-full outline-none border-b border-gray-500 bg-transparent pb-1 text-sm"
          />

          {commentText && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setCommentText("")}
                className="text-sm text-gray-600"
              >
                Cancel
              </button>
              <button className="px-4 py-1 bg-black text-white rounded-full text-sm">
                Add Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW COMMENTS TOGGLE */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
      >
        {showComments
          ? "Hide comments"
          : `View comments (${comments.length})`}
      </button>

      {/* COMMENTS LIST */}
      {showComments && (
        <div className="mt-6 flex flex-col gap-6">

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">

              {/* AVATAR */}
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://via.placeholder.com/100"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p className="font-semibold text-sm">{comment.name}</p>
                <p className="text-sm text-gray-800 mt-1">
                  {comment.message}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 text-xs text-gray-600 mt-2">
                  <button
                    onClick={() =>
                      setActiveReply(
                        activeReply === comment.id ? null : comment.id
                      )
                    }
                  >
                    Reply
                  </button>

                  {comment.replies.length > 0 && (
                    <button
                      onClick={() =>
                        setShowReplies((prev) => ({
                          ...prev,
                          [comment.id]: !prev[comment.id]
                        }))
                      }
                    >
                      {showReplies[comment.id]
                        ? "Hide replies"
                        : `View replies (${comment.replies.length})`}
                    </button>
                  )}
                </div>

                {/* REPLY INPUT */}
                {activeReply === comment.id && (
                  <div className="flex gap-3 mt-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src="https://via.placeholder.com/100"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Add a reply"
                        className="w-full outline-none border-b border-gray-400 bg-transparent pb-1 text-sm"
                      />

                      {replyText && (
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setActiveReply(null);
                              setReplyText("");
                            }}
                            className="text-xs text-gray-600"
                          >
                            Cancel
                          </button>
                          <button className="px-3 py-1 bg-black text-white rounded-full text-xs">
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* REPLIES */}
                {showReplies[comment.id] && (
                  <div className="mt-4 pl-6 border-l border-gray-200 flex flex-col gap-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src="https://via.placeholder.com/100"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-xs">
                            {reply.name}
                          </p>
                          <p className="text-sm text-gray-700">
                            {reply.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
