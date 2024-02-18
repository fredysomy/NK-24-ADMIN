import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function RegistrationQuery() {
  const [nkid, setRegistrationId] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attended, setAttended] = useState(false);

  useEffect(() => {
    // This effect ensures that when `details` is updated, `attended` matches its current state.
    if (details && details.hasOwnProperty("attended")) {
      setAttended(details.attended);
    }
  }, [details]);

  const handleInputChange = (e) => {
    setRegistrationId(e.target.value);
  };

  const handleCheckboxChange = async (e) => {
    const newAttended = e.target.checked;
    setAttended(newAttended); // Update component state
    // If there are already loaded details, update Firestore immediately
    if (details) {
      await updateFirestoreAttended(newAttended);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchDetails();
    setLoading(false);
  };

  const fetchDetails = async () => {
    const docRef = doc(db, "Registrations", nkid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDetails(docSnap.data());
    } else {
      alert("No such document!");
      setDetails(null);
    }
  };

  const updateFirestoreAttended = async (newAttended) => {
    const docRef = doc(db, "Registrations", nkid);
    try {
      await updateDoc(docRef, {
        attended: newAttended,
      });
      alert("Attendance updated successfully.");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update the document.");
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl mb-10">Online Registration Details</h1>
      <div className="mb-5">
  <form onSubmit={handleSubmit} className="flex">
    <input
      type="text"
      value={nkid}
      onChange={handleInputChange}
      placeholder="Enter NK Registration ID"
      className="flex-1 px-4 py-2 rounded-l-md border focus:outline-none"
    />
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700 disabled:bg-blue-300"
    >
      {loading ? "Loading..." : "Submit"}
    </button>
  </form>
</div>

      {details && (
        <div>
          <h3 className="font-bold mb-5 text-black text-xl">Registration Details</h3>
            <table className="w-full border-collapse ">
              <tbody>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Attended
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {attended ? "Yes" : "No"}
                    <input
                      type="checkbox"
                      checked={attended}
                      onChange={handleCheckboxChange}
                      className="ml-2"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Registration ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.nkid}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Username
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.username}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Event Name
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.eventname}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Phone
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.phone}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Team
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.team}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Event ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.eventid}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.id}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-100">
                    Payment ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left">
                    {details.payment_id}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      )}
    </div>
  );
}

export default RegistrationQuery;
