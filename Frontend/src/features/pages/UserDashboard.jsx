import { useContext, useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  Trash2,
  Sparkles,Pencil,Settings
} from "lucide-react";
import UserInfoCard from "../user/UserInfoCard";
import Context from "../../Context/Context";
import api from "../../api/axios";
import { dummyUser } from "../university/dummyUniversities";

export default function UserDashboard({ sideNav}) {
  const [todos, setTodos] = useState([
    "Shortlist universities in Canada",
    "Prepare Statement of Purpose (SOP)",
    "Research scholarship opportunities",
    "Book IELTS retake if needed",
  ],);

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };
    const stages = [
    "1. Profile Created",
    "2. Onboarding",
    "3. University Shortlisting",
    "4. University Locked",
    ];
  const obj = useContext(Context);
    const [firstRender,setFirstRender] = useState(true);
    const [loading,setLoading] = useState(true);
    const [user,setUser] = useState(dummyUser);
const [editOpen, setEditOpen] = useState(false);


    const getUserDetails = async()=>{
        await api.get('/api/v1/userOtherDetails/getProfileDetails').then(res=>{
            
            setUser(res.data.data);
            setLoading(false);
        })
    }

  useEffect(()=>{
    if(firstRender){
        getUserDetails();
        setFirstRender(false);
        
    }
  },[])


  return ( <>
        { !loading &&
        <div className={`
        fixed top-16 right-0 
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-2 md:px-4 py-4
        overflow-y-auto
        bg-[#f9f7ff]
      `}
    >
    <div className="min-h-screen  px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= USER OVERVIEW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 👤 USER INFO → WIDER */}
        <div className="lg:col-span-9">
            <UserInfoCard user={user} settingButtonClicked={()=>{setEditOpen(true)}} />
        </div>

        {/* 🎯 PROFILE SCORE → NARROWER */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90">
                <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#e9d5ff"
                strokeWidth="12"
                fill="none"
                />
                <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#7c3aed"
                strokeWidth="12"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={
                    377 - (377 * user.profileScore) / 100
                }
                strokeLinecap="round"
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                {user.profileScore}%
                </span>
            </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
            Profile Strength
            </p>
        </div>

        </div>
  
            {/* ================= CURRENT STAGE ================= */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                Application Progress
                </p>
                <span className="text-xs font-semibold text-purple-600">
                Step {user.currentStage} of {stages.length} completed
                </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                <div
                className="h-full bg-purple-600 transition-all duration-500"
                style={{
                    width: `${((user.currentStage) / stages.length) * 100}%`,
                }}
                />
            </div>

            {/* STAGE LABELS */}
            <div className="mt-4 grid grid-cols-4 text-xs">
                {stages.map((stage, index) => {
                const isActive = index === user.currentStage;
                const isCompleted = index < user.currentStage;

                return (
                    <div
                    key={stage}
                    className={`text-center font-medium ${
                        isActive
                        ? "text-purple-700"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                    >
                    {stage}
                    </div>
                );
                })}
            </div>
            </div>



        {/* ================= STRENGTHS & WEAKNESSES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-green-600">
              Profile Strengths
            </h3>
            <ul className="space-y-2">
              {user.profileStrength.map((s, i) => (
                <li key={i} className="text-sm">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-red-500">
              Profile Weaknesses
            </h3>
            <ul className="space-y-2">
              {user.profileWeakness.map((w, i) => (
                <li key={i} className="text-sm">
                  • {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= AI TODO LIST ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">AI Todo List</h3>

          <div className="space-y-3">
            {todos.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Circle className="text-purple-500" size={18} />
                  <span className="text-sm">{task}</span>
                </div>
                <button onClick={() => removeTodo(i)}>
                  <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700">
            <Sparkles size={18} />
            Create Tasks with AI
          </button>
        </div>
      </div>
    </div>
    </div>}
        {loading && <div className="flex justify-center items-center w-full h-screen text-4xl"><i className="fa-solid fa-circle-notch fa-spin"></i></div>}

        <EditProfileModal
  open={editOpen}
  onClose={() => setEditOpen(false)}
  onSuccess={getUserDetails}
/>
    </>
  );
}

function Tag({ text }) {
  return (
    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
      {text}
    </span>
  );
}



function EditProfileModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    educationLevel: "",
    educationField: "",
    year: "",
    marks: "",
    degree: "",
    degreeField: "",
    intake: "",
    intakeYear: "",
    budget: "",
    countries: [],
    scholarship: "no",
    fundingPlan: "",
    exam: "",
    score: "",
    extraExam: "",
  });

  /* ---------- FETCH PROFILE ---------- */
  const getUserDetails = async () => {
    try {
      const res = await api.get(
        "/api/v1/userOtherDetails/getProfileDetails"
      );
      const d = res.data.data;

      setForm({
        educationLevel: d.currentEducationLevel || "",
        educationField: d.major || "",
        year: d.yearOfGraduation || "",
        marks: d.marks || "",
        degree: d.degreeToAchieve || "",
        degreeField: d.degreeField || "",
        intake: d.intake || "",
        intakeYear: d.intakeYear || "",
        budget: d.budget || "",
        countries: d.targetCountries || [],
        scholarship: d.haveScholarship || "no",
        fundingPlan: d.fundingPlan || "",
        exam: d.examGiven || "",
        score: d.examScore || "",
        extraExam: d.otherExamGiven || "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) getUserDetails();
  }, [open]);

  /* ---------- SUBMIT ---------- */
  const onSubmit = async () => {
    await api.put("/api/v1/onboarding/onBoarding", {
      currentEducationLevel: form.educationLevel,
      major: form.educationField,
      yearOfGraduation: form.year,
      marks: form.marks,
      degreeToAchieve: form.degree,
      degreeField: form.degreeField,
      intake: form.intake,
      intakeYear: form.intakeYear,
      budget: form.budget,
      targetCountries: form.countries,
      fundingPlan: form.fundingPlan,
      haveScholarship: form.scholarship,
      examGiven: form.exam,
      examScore: form.score,
      otherExamGiven: form.extraExam,
    });

    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="space-y-4">

            <Input label="Education Level" value={form.educationLevel}
              onChange={(v) => setForm({ ...form, educationLevel: v })} />

            <Input label="Major" value={form.educationField}
              onChange={(v) => setForm({ ...form, educationField: v })} />

            <Input label="Graduation Year" value={form.year}
              onChange={(v) => setForm({ ...form, year: v })} />

            <Input label="GPA / CGPA" value={form.marks}
              onChange={(v) => setForm({ ...form, marks: v })} />

            <Input label="Target Degree" value={form.degree}
              onChange={(v) => setForm({ ...form, degree: v })} />

            <Input label="Course Field" value={form.degreeField}
              onChange={(v) => setForm({ ...form, degreeField: v })} />

            <Input label="Budget (USD)" value={form.budget}
              onChange={(v) => setForm({ ...form, budget: v })} />

            <Input label="Funding Plan" value={form.fundingPlan}
              onChange={(v) => setForm({ ...form, fundingPlan: v })} />

            <button
              onClick={onSubmit}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}