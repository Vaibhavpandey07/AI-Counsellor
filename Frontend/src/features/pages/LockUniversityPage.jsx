import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import api from "../../api/axios";

/* ================= MAIN COMPONENT ================= */
export default function LockUniversityPage({ sideNav }) {
  const [university, setUniversity] = useState({});
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  



  /* ================= FETCH ================= */
  const getLockedUniversity = async () => {
    try {
      const res = await api.get(
        "/api/v1/lockUniversity/getLockedUniversityDetails"
      );
      setUniversity(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const markCurrentStepCompleted = async () => {
  try {
    await api.patch("/api/v1/lockUniversity/updateStage");
    getLockedUniversity(); // refresh data
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    getLockedUniversity();
  }, []);

  /* ================= DEADLINE ================= */
const daysRemaining = useMemo(() => {
  if (!university?.deadline) return 0;

  const today = new Date();
  const deadline = new Date(university.deadline);
  return Math.max(
    Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)),
    0
  );
}, [university.deadline]);

  /* ================= PROGRESS ================= */
  const progressPercent = useMemo(() => {
    if (!university?.stages?.length) return 0;
    return Math.round(
      (university.currentStage / university.stages.length) * 100
    );
  }, [university]);

  /* ================= UNLOCK ================= */
  const unlockUniversity = async () => {
    try {
      await api.delete("/api/v1/lockUniversity/unlockUniversity");
      setUniversity(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-4xl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No locked university
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div
      className={`
        fixed top-16 right-0
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-4 py-6
        overflow-y-auto
        bg-gradient-to-br from-[#f6f4ff] to-white
      `}
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HERO ================= */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
          <button
            onClick={() => setShowRemoveModal(true)}
            className="absolute top-5 right-5 flex items-center gap-2
                       bg-white/20 hover:bg-white/30
                       px-4 py-2 rounded-xl text-sm"
          >
            <Trash2 size={16} />
            Remove
          </button>

          <h1 className="text-3xl font-semibold">
            {university.universityName}
          </h1>
          <p className="opacity-90 mt-1">
            {university.city}, {university.country}
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            <StatDark label="Acceptance Score" value={`${university.acceptanceScore}%`} />
            <StatDark label="Likelihood" value={university.likelihood} />
            <StatDark label="Fee Band" value={university.feeBand} />
            <StatDark label="Ranking" value={university.isInTop200 ? "Top 200" : "—"} />
          </div>

          <a
            href={university.website}
            target="_blank"
            className="inline-flex items-center gap-2 mt-6 text-sm underline"
          >
            Visit University Website <ExternalLink size={14} />
          </a>
        </div>

        {/* ================= DEADLINE + PROGRESS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" />
              <h3 className="font-semibold">Application Deadline</h3>
            </div>

            <p className="text-2xl font-bold mt-3">
              {daysRemaining} days left
            </p>
            <p className="text-sm text-gray-500">
              {new Date(university.deadline).toDateString()}
            </p>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">Application Progress</h3>
              <span className="text-sm text-purple-600 font-medium">
                {progressPercent}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= ACCEPTANCE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold mb-3">Acceptance Insights</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              {university.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-purple-50 rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold text-purple-900">
              AI Application Assistant
            </h3>
            <p className="text-sm text-purple-800 mt-2">
              SOP review, eligibility checks, interview prep & timeline planning.
            </p>
            <button className="mt-4 px-5 py-2 rounded-xl bg-purple-600 text-white">
              Chat with AI
            </button>
          </div>
        </div>
{/* ================= CURRENT STEP CARD ================= */}
<div className="bg-gradient-to-r from-indigo-500 to-purple-600 
                rounded-2xl p-6 text-white shadow-lg">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    <div>
      <p className="text-sm opacity-80">Current Step</p>
      <h3 className="text-xl font-semibold mt-1">
        {university.stages[university.currentStage - 1]}
      </h3>
      <p className="text-sm opacity-90 mt-1">
        Step {university.currentStage} of {university.stages.length}
      </p>
    </div>

    <button
      onClick={markCurrentStepCompleted}
      disabled={university.currentStage >= university.stages.length}
      className={`px-5 py-2 rounded-xl font-medium
        ${
          university.currentStage >= university.stages.length
            ? "bg-white/30 cursor-not-allowed"
            : "bg-white text-purple-700 hover:bg-gray-100"
        }`}
    >
      {university.currentStage >= university.stages.length
        ? "All steps completed"
        : "Mark as completed"}
    </button>
  </div>
</div>
        {/* ================= STAGES ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold mb-4">Application Steps</h3>

          <div className="space-y-3">
            {university.stages.map((step, index) => {
              const done = index < university.currentStage;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-xl p-4
                    ${done ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border" />
                    )}
                    <span className={done ? "line-through text-gray-500" : ""}>
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= REMOVE MODAL ================= */}
      {showRemoveModal && (
        <ConfirmRemoveModal
          universityName={university.universityName}
          onCancel={() => setShowRemoveModal(false)}
          onConfirm={unlockUniversity}
        />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

const StatDark = ({ label, value }) => (
  <div>
    <p className="text-xs opacity-80">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const ConfirmRemoveModal = ({ universityName, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400">
        <X size={18} />
      </button>

      <h3 className="text-lg font-semibold">Remove University?</h3>
      <p className="text-sm mt-2">
        Remove <strong>{universityName}</strong> from locked universities?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onCancel} className="px-4 py-2 border rounded-xl">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-xl"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

