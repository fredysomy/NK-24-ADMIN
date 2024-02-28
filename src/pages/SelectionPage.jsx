import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function SelectionPage() { // Assuming isAdmin is passed as a prop
  const navigate = useNavigate();
  const { auth } = location.state || {};


  return (
    <div className="flex items-center justify-center bg-black">
      <button
        onClick={() => {
          navigate('/onlinepage', { state: { auth: true } })
        }}
        className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Online Registration
      </button>
      <button
        onClick={() => navigate('/spotselection', { state: { auth: true } })}
        className="mx-4 bg-green-500 hover:bg-green-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Spot Registration
      </button>
        <button
          onClick={() => navigate("/modifyreg", { state: { auth: true } })}
          className="mx-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
        >
          Modify Registration
        </button>
    </div>
  );
}

export default SelectionPage;
