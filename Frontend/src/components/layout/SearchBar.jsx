import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";



export default function SearchBar({ showSearchBar }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(["something","something"]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef(null);

  const navigate = useNavigate();

  const getSearchSuggestion = async(query)=>{
    api.get(`/api/v1/videos/searchSuggestion?searchQuery=${query}`).then(async(res)=>{
      if(res?.data?.data){
        
        
        const dataReceived = await res.data.data.map((ele)=>{
          return ele.title;
        })
        // console.log(dataReceived);
        setSuggestions(dataReceived);
        setLoading(false);
        setShowSuggestions(true);
        return dataReceived;
      }
      else{
        throw err;
      }
    }).catch(err=>{
      setLoading(false);
      return ['no results found'];
    })
  }

  const onSearchClick = async()=>{
    navigate(`/search?searchQuery=${query}`,{replace:true})
  }
  const onSearchItemClick = async(item)=>{
    
    navigate(`/search?searchQuery=${item}`,{replace:true})
  }




  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(async () => {
      await getSearchSuggestion(query).then(res=>{
        
        // console.log(res);
      })
      // setSuggestions(res);
      // setLoading(false);
      // setShowSuggestions(true);
    }, 800); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    showSearchBar && (
      <div ref={wrapperRef} className="relative mx-2 w-[52%] md:w-[63%] lg:w-[42%] ">
        

        <div className="flex h-9 bg-white rounded-xl shadow-xs border-2 border-purple-600">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mx-2 flex-1 outline-none"
            placeholder="Search"
            onFocus={() => query}
          />


          <button className="w-10 flex justify-center items-center hover:bg-gray-200"  onClick={onSearchClick}>
            {loading ? (
              <i className="fas fa-spinner fa-spin text-gray-500"></i>
            ) : (
              <i className="fas fa-search" ></i>
            )}
          </button>

          <button className="w-10 hover:bg-gray-200 rounded-r-xl">
            <i className="fa-solid fa-microphone"></i>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-11 w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            {suggestions.map((item, i) => { return (
              <div
                key={i}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 line-clamp-1"  
                onClick={()=>{
                  setQuery(item);
                  setShowSuggestions(false);
                  onSearchItemClick(item);
                }}
              >
                <i className="fas fa-search text-gray-400 text-sm"></i>
                <span>{item}</span>
              </div>
            )})}

          </div>
        )}

        {showSuggestions && suggestions.length == 0 && (
          
             
            <div className="absolute top-11 w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            <div
                className="px-4 py-2  bg-gray-100 flex items-center gap-2 line-clamp-1"  
              >
                <i className="fas fa-search text-gray-400 text-sm"></i>
                <span>No Results</span>
              </div>
            
            </div>
            )}


      </div>
    )
  );
}
