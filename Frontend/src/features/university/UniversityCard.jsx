import { useState } from "react";
import {
  Globe,
  MapPin,
  ExternalLink,
  CheckCircle,
  Building2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import api from "../../api/axios";

export default function UniversityCard({ university }) {
  const {
    universityName,
    city,
    country,
    website,
    Description,
    courses,
    scholarships,
    entry_paths,
    feeBand,
    acceptanceScore,
    likelihood,
    reasons,
    shortlisted
  } = university;


  const [shortlistedUni, setShortlistedUni] = useState(shortlisted);
  const initial = universityName?.charAt(0).toUpperCase();

  const likelihoodColor = {
    VeryHigh: "bg-green-100 text-green-700",
    High: "bg-emerald-100 text-emerald-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-red-100 text-red-700",
  };

  const onShortlistClick = async()=>{
    if(!shortlistedUni){
      api.patch('/api/v1/userOtherDetails/shortlistUniversity',{universityId:university._id}).then((res)=>{
        if(res.status ==200){
          setShortlistedUni(true)
        }
      })
    }
    else{
      api.patch('/api/v1/userOtherDetails/removeFromShortlist',{universityId:university._id}).then((res)=>{
        if(res.status ==200){
          setShortlistedUni(false)
        }
      })
    }
  }

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white/40 backdrop-blur-2xl border border-purple-200 shadow-xl overflow-hidden hover:shadow-2xl transition">

      {/* COVER IMAGE */}
      <div
        className="relative h-36 bg-center bg-cover"
        style={{
          backgroundImage: "url('../../../src/assets/images/card.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center justify-between px-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 size={26} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide opacity-80">
                University
              </p>
              <p className="font-semibold text-lg leading-tight">
                {universityName}
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center text-xl font-semibold shadow">
            {initial}
          </div>
        </div>
      </div>

      {/* 🔹 UNIVERSITY NAME BELOW IMAGE */}
      <div className="px-6 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          {universityName}
        </h2>
        <div className="h-px bg-purple-100 mt-3" />
      </div>

      {/* CONTENT */}
      <div className="p-6 pt-4">

        {/* Location + Likelihood */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={14} />
            <span>
              {city}, {country}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              likelihoodColor[likelihood] || "bg-gray-100 text-gray-600"
            }`}
          >
            {likelihood} Chance
          </span>
        </div>

        {/* Acceptance Score */}
        <div className="mt-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Acceptance Score</span>
            <span className="font-medium text-gray-900">
              {acceptanceScore}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${acceptanceScore}%` }}
            />
          </div>
        </div>

        {/* Description */}
        {Description && (
          <p className="mt-4 text-gray-700 text-sm leading-relaxed line-clamp-3">
            {Description}
          </p>
        )}

        {/* Reasons */}
        {reasons?.length > 0 && (
          <div className="mt-4 space-y-2">
            {reasons.slice(0, 3).map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle size={16} className="text-purple-600 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-700">
          {feeBand && (
            <div>
              <span className="font-medium">Fee Band:</span> {feeBand}
            </div>
          )}
          {scholarships?.length > 0 && (
            <div>
              <span className="font-medium">Scholarships:</span> Available
            </div>
          )}
          {courses?.length > 0 && (
            <div>
              <span className="font-medium">Courses:</span> {courses.length}+
            </div>
          )}
          {entry_paths?.length > 0 && (
            <div>
              <span className="font-medium">Entry Paths:</span>{" "}
              {entry_paths.length}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-purple-600 text-sm truncate">
            <Globe size={14} />
            <span className="truncate max-w-[180px]">
              {website?.replace("https://", "")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onShortlistClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                shortlistedUni
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {shortlistedUni ? (
                <>
                  <BookmarkCheck size={16} />
                  Shortlisted
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  Shortlist
                </>
              )}
            </button>

            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition"
            >
              Visit
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}