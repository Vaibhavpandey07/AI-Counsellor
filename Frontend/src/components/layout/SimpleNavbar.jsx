import { Link, useNavigate } from "react-router-dom";

function SimpleNavbar({showButton = true}) {
    const navigate = useNavigate();

    const buttonOnClick = ()=>{
        navigate('/login',{replace:true});
    }
  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl shadow-grey-400">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Name */}
        <div className="text-purple-600 font-bold text-xl">
            <Link to="/">
                YourAppName
            </Link>
        </div>

        {/* Login Button */}
        {showButton && <button className="bg-purple-600 text-white px-5 py-2 rounded-md font-medium hover:cursor-pointer hover:bg-purple-700 transition" onClick={buttonOnClick}>
          Login
        </button>}

      </div>
    </header>
  );
}

export default SimpleNavbar;
