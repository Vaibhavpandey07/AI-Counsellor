import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// import UniversityCard from "@/components/UniversityCard";
// import { dummyUniversities } from "@/data/dummyUniversities";
// import { useDebounce } from "@/hooks/useDebounce";
import UniversitySearchBar from "./UniversitySearchbar";
import { dummyUniversities } from "./dummyUniversities";
import UniversityCard from "./UniversityCard";
import api from "../../api/axios";

export default function UniversityDiscoveryPage({sideNav}) {
//   const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState(['something']);
  const [country, setCountry] = useState("All");
  const [feeBand, setFeeBand] = useState("All");
  const [minScore, setMinScore] = useState(null);

  const [universities,setUniversities] = useState([]);
  const [loading,setLoading] = useState(true);
  const [firstRender,setFirstRender] = useState(true);
  const [hasMore,setHasMore] = useState(true);

  const [page,setPage] = useState(1);




  const countries = ['All',  'Canada', 'Australia', 'Germany', 'Ireland', 'Netherlands', 'United Kingdom', 'United States',   ]
    

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchSearch =
        u.universityName.toLowerCase().includes(search.toLowerCase());

      const matchCountry =
        country === "All" || u.country === country;

      const matchFee =
        feeBand === "All" || u.feeBand === feeBand;

      const matchScore =
        minScore === null || u.acceptanceScore >= minScore;

      return matchSearch && matchCountry && matchFee && matchScore;
    });
  }, [universities,search, country, feeBand, minScore]);


  
  const onScrollHome = (e)=>{
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // console.log(scrollTop,scrollHeight,clientHeight);

    if(scrollTop+clientHeight >= scrollHeight-5){
      // console.log("You are at the bottom of the page");
      if(hasMore){
        getUniversityData();
      }
    }

  }


  const getUniversityData  =async()=>{
    api.get(`/api/v1/universities/allUniversities?page=${page}`).then((res)=>{
      const data = res.data.data;
      // setUniversities((prev)=>{return [...prev,data.data]});
          setUniversities((prev) => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage((prev)=>prev+1);
      setLoading(false);
    })
  }



  useEffect(()=>{
    if(firstRender){
      getUniversityData();
      setFirstRender(false);
    }
  },[])

  return (
    <>{ !loading &&
           <div
      className={`
        fixed top-16 right-0 
        h-[calc(100vh-4rem)]
        w-full
        ${sideNav ? "md:w-[65%] lg:w-[80%] xl:w-[84%]" : ""}
        px-2 md:px-4 py-4
        overflow-y-auto
        bg-[#f9f7ff]
      `}
      onScroll={onScrollHome}
    >
    <div className="min-h-screen bg-[#f9f7ff] px-6 py-10">
      <div className="max-w-[74rem] mx-auto space-y-8">

        {/* 🔍 SEARCH */}
        <UniversitySearchBar value={search}
            onSelect={(val) => setSearch(val)}
            />

        {/* 🎛 FILTERS */}
        <div className="flex flex-wrap gap-4 items-center justify-between">

          <div className="flex flex-wrap gap-4 items-center">

            {/* Profile Score Buttons */}
            <div className="flex gap-2">
              {[60, 70, 80, 90].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinScore(score)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    minScore === score
                      ? "bg-purple-600 text-white"
                      : "bg-white/60 border border-purple-200 text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  {score}%+
                </button>
              ))}
            </div>

            {/* Country */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/60 border border-purple-200 text-sm"
            >
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Fee Band */}
            <select
              value={feeBand}
              onChange={(e) => setFeeBand(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/60 border border-purple-200 text-sm"
            >
              <option value="All">All Fees</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* 🤖 AI CTA */}
          <button
            // onClick={() => navigate("/user/ai/chat")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 shadow"
          >
            <Sparkles size={18} />
            AI Shortlisting
          </button>
        </div>

        {/* 🧱 RESULTS */}
        <div className="flex flex-wrap gap-6 w-full ">
          {filteredUniversities.map((uni,_) => (
            <UniversityCard key={`${uni.code}${_}`} university={uni} />
          ))}
        </div>
      </div>
    </div>
    </div>}
        {loading && <div className="flex justify-center items-center w-full h-screen text-4xl"><i className="fa-solid fa-circle-notch fa-spin"></i></div>}
    </>
  );
}