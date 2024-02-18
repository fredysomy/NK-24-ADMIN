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
    <div className="text-white">
      <h1 className="font-bold text-2xl mb-10">Online Registration Details</h1>
      <div className="mb-5 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={nkid}
            onChange={handleInputChange}
            placeholder="Enter NK Registration ID"
            className="w-64 px-4 py-2 rounded-l-md border focus:outline-none bg-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>

      {details && (
        <div className="px-5">
          <h3 className="font-bold mb-5 text-xl">Registration Details</h3>
          <div className="flex justify-center items-center">
            <table className="border border-gray-200">
              <tbody>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Attended
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
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
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Registration ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.nkid}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Username
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.username}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Event Name
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.eventname}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Phone
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.phone}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Email
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.email}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Team
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.team}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Event ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.eventid}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.id}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-500">
                    Payment ID
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {" "}
                    {/* Right column */}
                    {details.payment_id}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationQuery;
