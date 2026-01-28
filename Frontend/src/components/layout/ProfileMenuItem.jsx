import React from 'react'

export default function ProfileMenuItem({label,danger}) {
  return (
    <li>
      <button
        className={`w-full text-left px-4 py-2 hover:bg-gray-100 
          ${danger ? "text-red-600 hover:bg-red-50" : ""}`}
      >
        {label}
      </button>
    </li>
  );
}

