import React from 'react';
import { useNavigate } from 'react-router-dom';

function SelectionPage() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-center bg-black h">
      <button
        onClick={() => navigateTo('/onlinepage')}
        className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Online Registration
      </button>
      <button
        onClick={() => navigateTo('/spot-registration')}
        className="mx-4 bg-green-500 hover:bg-green-700 text-white font-bold py-20 px-20 rounded-lg text-2xl"
      >
        Spot Registration
      </button>
    </div>
  );
}

export default SelectionPage;
