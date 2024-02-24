import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

function RegistrationQuery() {
  const [nkid, setRegistrationId] = useState("");
  const [details, setDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attended, setAttended] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [team, setTeam] = useState(null);
  const [selectedField, setSelectedField] = useState("attended");
  const [selectedFields, setSelectedFields] = useState([]);
  const [newValue, setNewValues] = useState("");

  // ... (existing functions)
  const navigate = useNavigate();
  
  
  const navigateTo = (path) => {
    alert("Update successful");
    navigate(path);
    
  };
  const handleFieldsSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFields(selectedOptions);
  };
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const handleDropdownClick = () => {
    setDropdownClicked(true);
  };

  const handleNewValueChange = (field, value) => {
    setNewValues(value);
    console.log(newValue);
}
  
  const handleFieldSelectChange = (e) => {
    setSelectedField(e.target.value);
  };
  useEffect(() => {
    if (details && details.hasOwnProperty("attended")) {
      setAttended(details.attended);
    }
  }, [details]);

  const handleInputChange = (e) => {
    setRegistrationId(e.target.value);
  };

  const handleCheckboxChange = async (e) => {
    const newAttended = e.target.checked;
    setAttended(newAttended);
    if (details) {
      await updateFirestoreAttended(newAttended);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTeam(null); // Reset team state to null here
    await fetchDetails();
    setLoading(false);
  };

  const fetchDetails = async () => {
    console.log("Fetching details...");
    const docRef = doc(db, "Registrations", nkid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Registration details found:", docSnap.data());
      setDetails(docSnap.data());
      await fetchUserDetails(docSnap.data().nkid);
      console.log("This is docsnap", docSnap.data().nkid);
      await fetchRegistrationData(docSnap.data().nkid); // Fetch registration data
    } else {
      alert("No such document!");
      setDetails(null);
    }
  };

  const fetchUserDetails = async (nkid) => {
    console.log("Fetching user details for NKID:", nkid);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("NKID", "==", nkid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      querySnapshot.forEach((doc) => {
        console.log("User details found:", doc.data());
        setUserDetails(doc.data());
      });

      if (querySnapshot.empty) {
        console.log("User details not found for NKID:", nkid);
        setUserDetails(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(null);
    }
  };

  const fetchRegistrationData = async (registrationId) => {
    try {
      const registrationsRef = collection(db, "Registrations");
      const q = query(registrationsRef, where("nkid", "==", registrationId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setRegistrationData(data);
          if (data.team) {
            setTeam(data.team); // Set the team state if it's not null
          }
        });
      } else {
        console.log("No such registration document!");
        setRegistrationData(null);
        setTeam(null); // Ensure team is set to null if there's no document
      }
    } catch (error) {
      console.error("Error fetching registration data:", error);
      setRegistrationData(null);
      setTeam(null); // Ensure team is set to null if an error occurs
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
      <h1 className="font-bold text-2xl mb-5">Online Registration Details</h1>
      <div className="mb-5 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={nkid}
            onChange={handleInputChange}
            placeholder="Enter NK Registration ID"
            className="w-64 px-4 py-2 rounded-l-md border focus:outline-none bg-gray-800"
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

      {details && userDetails && registrationData && (
  <div>
    <div className="px-5 mt-20 flex">
      <div className="flex-1"></div>
      {/* User Details Table */}
      <div className="w-1/4 px-2 flex flex-col items-center">
        <h3 className="font-bold mb-5 text-xl">User Details</h3>
        <table className="border border-gray-200">
          <tbody>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-800">
                Name
              </th>
              <td className="border border-gray-200 p-2 text-left bg-transparent">
                {userDetails.name}
              </td>
            </tr>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-800">
                NKID
              </th>
              <td className="border border-gray-200 p-2 text-left bg-transparent">
                {userDetails.NKID}
              </td>
            </tr>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-800">
                College
              </th>
              <td className="border border-gray-200 p-2 text-left bg-transparent">
                {userDetails.college}
              </td>
            </tr>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-800">
                Branch
              </th>
              <td className="border border-gray-200 p-2 text-left bg-transparent">
                {userDetails.branch}
              </td>
            </tr>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-800">
                Semester
              </th>
              <td className="border border-gray-200 p-2 text-left bg-transparent">
                {userDetails.semester}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Registration Details Table */}
      <div className="w-1/4 px-2 flex flex-col justify-center items-center">
            <h3 className="font-bold mb-5 text-xl">Registration Details</h3>
            <div className="flex justify-center items-center">
              <table className="border border-gray-200">
                <tbody>
                  <tr>
                    <th className="border border-gray-200 p-2 text-left bg-gray-800">
                      Attended
                    </th>
                    <td className="border border-gray-200 p-2 text-left bg-transparent">
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
                    <th className="border border-gray-200 p-2 text-left bg-gray-800">
                      Event ID
                    </th>
                    <td className="border border-gray-200 p-2 text-left bg-transparent">
                      {registrationData.eventid}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-200 p-2 text-left bg-gray-800">
                      Event
                    </th>
                    <td className="border border-gray-200 p-2 text-left bg-transparent">
                      {registrationData.eventname}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-200 p-2 text-left bg-gray-800">
                      Payment ID
                    </th>
                    <td className="border border-gray-200 p-2 text-left bg-transparent">
                      {registrationData.payment_id}
                    </td>
                  </tr>
                  {team && ( // Only render this row if team is not null
                    <tr>
                      <th className="border border-gray-200 p-2 text-left bg-gray-800">
                        Team
                      </th>
                      <td className="border border-gray-200 p-2 text-left bg-transparent">
                        {team}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1"></div>
        </div>

    {/* Dropdown to select field to modify */}
    <div className="mt-10 flex flex-col justify-center alignitems-center flex flex-col items-center">
      <h3 className="font-bold mb-5 text-xl">Select Field to Modify</h3>
      <select
        value={selectedField}
        onChange={handleFieldSelectChange}
        onClick={handleDropdownClick}
        //multiple
        className=" w-64 px-20 py-2 rounded-md border focus:outline-none bg-gray-800 text-white"
      >
        <option value="Name">Name</option>
        <option value="NKID">NKID</option>
        <option value="College">College</option>
        <option value="Branch">Branch</option>
        <option value="Semester">Semester</option>
        <option value="Event ID">Event ID</option>
        <option value="Event Name">Event Name</option>
        <option value="Payment ID">Payment ID</option>
        {/* Add more options for other fields as needed */}
      </select>
    </div>
    {/* Input fields for modifying the selected fields */}
    <div className=" px-2 flex flex-col justify-center items-center">
      
    {dropdownClicked && (
        <>
        <label htmlFor="newValue" className="py-5 font-bold mb-2 text-md text-white">
          New Value:
        </label>
        <input
          type="text"
          id="newValue"
          value={newValue}
          onChange={handleNewValueChange}
          className=" w-64 px-20 py-2 rounded-md border focus:outline-none bg-gray-800 text-white"
      />
      <div className=" w-64 px-20 py-5 rounded-md border:black focus:outline-none bg-black-800 text-white"
     >
      <button 
      onClick={() => navigateTo("/selection")}
      className="mt-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
    >
      Submit
    </button>
    </div>
      </>
    )}
    </div> 
    
  </div>
  
 )}
    
    </div>
  );
}

export default RegistrationQuery;
