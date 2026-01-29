import { useContext } from "react";
import Context from "../../Context/Context";

function UserCard({ avatar, name, email }) {
    const obj= useContext(Context);
  return (
    <div className="w-[100%] mx-auto bg-white/70 rounded-xl shadow-sm border border-gray-200/20 p-4 flex items-center gap-4">
      
      {/* Avatar column */}
      <div className="flex-shrink-0">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${obj.userProfilePhoto}`}
          alt={obj.username}
          className="h-14 w-14 rounded-full object-cover"
        />
      </div>

      {/* Info column */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          Hello! {obj.username}, Please tell us about Your academic background
        </span>
        <span className="text-sm text-gray-500">
          {obj.userEmail}
        </span>
      </div>

    </div>
  );
}

export default UserCard;
