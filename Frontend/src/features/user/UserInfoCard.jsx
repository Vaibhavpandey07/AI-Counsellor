import { Pencil, Settings } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "../../Context/Context";

export default function UserInfoCard({ user, settingButtonClicked }) {
  const {
    educationBackground,
    targettedCourse,
  } = user;

  const obj = useContext(Context);


  return (
    <div className="relative w-full rounded-3xl bg-white/60 backdrop-blur border border-purple-200 shadow-xl p-6">

      {/* 🔧 ACTION BUTTONS */}
      <div className="absolute top-5 right-5 flex gap-2">
        <button className="p-2 rounded-xl border border-purple-200 hover:bg-purple-50">
          <Link to="/user/changeDetails" ><Pencil size={16} /></Link>
        </button>
        <button className="p-2 rounded-xl border border-purple-200 hover:bg-purple-50" onClick={settingButtonClicked}>
          <Settings size={16} />
        </button>
      </div>

      {/* 👤 USER BASIC INFO */}
      <div className="flex items-center gap-5">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
          alt={obj.username}
          className="w-16 h-16 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-xl font-semibold text-gray-900">{obj.username}</h2>
          <p className="text-sm text-gray-600">{obj.userEmail}</p>
        </div>
      </div>

      {/* 📚 DETAILS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Education Background */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Education Background
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag text={educationBackground.currentEducationLevel} />
            <Tag text={educationBackground.major} />
            <Tag text={`Graduated ${educationBackground.yearOfGraduation}`} />
            <Tag text={`${educationBackground.marks}% Marks`} />
          </div>
        </div>

        {/* Target Course */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Target Course
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag text={targettedCourse.degreeToAchieve} />
            <Tag text={targettedCourse.degreeField} />
            <Tag
              text={`${targettedCourse.intake} ${targettedCourse.intakeYear}`}
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Budget Preference
          </p>
          <div className="flex gap-2">
            <Tag text={targettedCourse.budget} />
            <Tag text={targettedCourse.fundingPlan} />
          </div>
        </div>

        {/* Target Countries */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Target Countries
          </p>
          <div className="flex flex-wrap gap-2">
            {targettedCourse.targetCountries.map((c) => (
              <Tag key={c} text={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🏷 TAG COMPONENT */
function Tag({ text }) {
  return (
    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
      {text}
    </span>
  );
}