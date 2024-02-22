import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

const CampusAmbData = () => {
  const [campusAmbData, setCampusAmbData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "campusAmb"), orderBy("refcount", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCampusAmbData(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-center font-bold text-3xl mb-10">Campus Ambassador Data</h2>
      {loading ? ( // Render loading indicator if data is still loading
        <div className="flex justify-center items-center h-20">
          <p className="text-white font-bold text-2xl">Loading...</p>
        </div>
      ) : ( // Render table once data is loaded
        <div className="overflow-x-auto">
          <table className="mx-auto border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-bold text-xl">Name</th>
                <th className="border border-gray-300 px-4 py-2 font-bold text-xl">Email</th>
                <th className="border border-gray-300 px-4 py-2 font-bold text-xl">Referral Count</th>
                {/* Add additional table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {campusAmbData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.refcount}</td>
                  {/* Render additional columns as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CampusAmbData;





