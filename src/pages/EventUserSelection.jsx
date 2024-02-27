import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function SelectionPage() { // Assuming isAdmin is passed as a prop
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-black">
      <button
        onClick={() => {
            navigate('/spotuserreg', { state: { auth: true } })
          }}
        className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Add Participant
        </button>
      <button
        onClick={() => {
            navigate('/spoteventreg', { state: { auth: true } })
          }}
        className="mx-4 bg-green-500 hover:bg-green-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Event Registration
      </button>
      
    </div>
  );
}

export default SelectionPage;
