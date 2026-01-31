import { useEffect, useState } from "react";
import {
  Lock,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";


/* -------------------- HELPERS -------------------- */
const likelihoodStyles = {
  High: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-red-100 text-red-700",
};

const UniversityAvatar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-14 h-14 rounded-xl flex items-center justify-center
                    bg-gradient-to-br from-purple-500 to-purple-700
                    text-white text-xl font-bold shadow-sm">
      {initial}
    </div>
  );
};

/* -------------------- COMPONENT -------------------- */
export default function ShortlistedUniversitiesPage({sideNav}) {
  const [universities, setUniversities] = useState([]
  );
  const [lockedUniversityId, setLockedUniversityId] = useState(null);
  const [openReasonsId, setOpenReasonsId] = useState(null);

  const [firstRender, setFirstRender] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleRemove = (_id) => {
    if (lockedUniversityId === _id){
      return;
    };
      api.patch('/api/v1/userOtherDetails/removeFromShortlist',{universityId:_id}).then((res)=>{
        if(res.status ==200){
              setUniversities((prev) => prev.filter((u) => u._id !== _id));
        }
      })



  };

  const handleLock = (_id) => {


    api.post('/api/v1/lockUniversity/lockUniversity',{universityId:_id}).then((res)=>{
        if(res.status ==200){
            setLockedUniversityId(_id);
            navigate('/user/univeristy/lockedUniversity',{replace:true});
        }
      })
  };

  const getShortListedUniveristy = async()=>{

    api.get('/api/v1/userOtherDetails/getShortlistedUniversities').then((res)=>{

      if(res.status==200){
        let data = res.data.data;
        setUniversities(data.data);
        setLoading(false);
      }
    })
  }

  useEffect(()=>{
    if(firstRender){
      getShortListedUniveristy();
      setFirstRender(false);
    }
  },[])


  return (<>
    { !loading && <div
      className={`
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
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-gray-900">
          Shortlisted Universities
        </h1>

        {universities.length === 0 && (
          <p className="text-sm text-gray-500">
            No universities shortlisted yet.
          </p>
        )}

        <div className="space-y-4">
          {universities.map((uni) => {
            const isLocked = lockedUniversityId === uni._id;
            const isAnotherLocked =
              lockedUniversityId && lockedUniversityId !== uni._id;

            return (
              <div
                key={uni._id}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  isLocked
                    ? "bg-purple-50 border-purple-400"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">

                  {/* ---------- LEFT CONTENT ---------- */}
                  <div className="flex gap-4 flex-1">
                    <UniversityAvatar name={uni.universityName} />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {uni.universityName}
                        </h2>

                        {isLocked && (
                          <CheckCircle
                            size={18}
                            className="text-purple-600"
                          />
                        )}

                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${likelihoodStyles[uni.likelihood]}`}
                        >
                          {uni.likelihood} Chance
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        {uni.course}
                      </p>

                      <p className="text-xs text-gray-500">
                        {uni.country} • Fee Band: {uni.feeBand}
                      </p>

                      {/* ACCEPTANCE SCORE */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Acceptance Score</span>
                          <span>{uni.acceptanceScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${uni.acceptanceScore}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* REASONS DROPDOWN */}
                      <button
                        onClick={() =>
                          setOpenReasonsId(
                            openReasonsId === uni._id ? null : uni._id
                          )
                        }
                        className="mt-2 flex items-center gap-1 text-sm text-purple-600 hover:underline"
                      >
                        Why this university?
                        {openReasonsId === uni._id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      {openReasonsId === uni._id && (
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                          {uni.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* ---------- RIGHT ACTIONS ---------- */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleRemove(uni._id)}
                      className="flex items-center justify-center gap-1 px-4 py-2 text-sm rounded-xl
                                 border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>

                    <button
                      disabled={isAnotherLocked}
                      onClick={() => handleLock(uni._id)}
                      className={`flex items-center justify-center gap-1 px-4 py-2 text-sm rounded-xl transition ${
                        isLocked
                          ? "bg-purple-600 text-white"
                          : isAnotherLocked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }`}
                    >
                      <Lock size={14} />
                      {isLocked ? "Locked" : "Lock University"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>}

   {loading && <div className="flex justify-center items-center w-full h-screen text-4xl"><i className="fa-solid fa-circle-notch fa-spin"></i></div>}
  </>
  );
}