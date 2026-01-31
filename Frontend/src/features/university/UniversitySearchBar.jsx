import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
 
export default function UniversitySearchBar({
  value,
  onSelect,
  placeholder = "Search universities...",
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const onSearchClick = async()=>{
    navigate(`/search?searchQuery=${query}`,{replace:true})
  }
  const onSearchItemClick = async(item)=>{
    
    navigate(`/search?searchQuery=${item}`,{replace:true})
  }


  const wrapperRef = useRef(null);

  /* 🔍 API CALL */
  const getSearchSuggestion = async (searchQuery) => {
    try {
      const res = await api.get(
        `/api/v1/universities/searchSuggestions?searchQuery=${searchQuery}`
      );

      const data = res?.data?.data || [];
      setSuggestions(data.map((u) => u.universityName));
      setShowSuggestions(true);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🧠 DEBOUNCE */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      getSearchSuggestion(query);
    }, 700);

    return () => clearTimeout(timeout);
  }, [query]);

  /* ❌ CLICK OUTSIDE */
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    // <div ref={wrapperRef} className="relative w-full flex justify-center items-center">
    <div ref={wrapperRef} className="relative w-full ">
      <div className="flex h-11 bg-white rounded-2xl border border-purple-200 shadow-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 outline-none rounded-l-2xl"
          onFocus={() => query && setShowSuggestions(true)}
        />

        <button className="w-12 flex items-center justify-center" onClick={onSearchClick}>
          {loading ? (
            <i className="fas fa-spinner fa-spin text-gray-400"></i>
          ) : (
            <i className="fas fa-search text-gray-500"></i>
          )}
        </button>
      </div>

      {/* 🔽 SUGGESTIONS */}
      {showSuggestions && (
        <div className="absolute top-12 w-full bg-white rounded-xl shadow-xl border overflow-hidden z-20">
          {suggestions.length > 0 ? (
            suggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery(item);
                  setShowSuggestions(false);
                  onSelect(item);
                  onSearchItemClick(item);
                

                }}
                className="px-4 py-3 cursor-pointer hover:bg-purple-50 flex items-center gap-2"
              >
                <i className="fas fa-search text-gray-400 text-sm"></i>
                <span className="line-clamp-1">{item}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
    // {/* // </div> */}
  );
}