import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

function ParticipantDetails() {
  const [eventid, setEventId] = useState(""); // State for storing the event ID
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [participants, setParticipants] = useState([]); // State for storing participant details
  const [eventName, setEventName] = useState(""); // State for storing the event name

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setParticipants([]);
    setEventName(""); // Reset event name
  
    try {
      const eventData = await fetchEvent(eventid); // Fetch event details
      setEventName(eventData.name); // Set the event name
      const participantDetails = await fetchParticipantDetails(eventid); // Fetch participant details
      setParticipants(participantDetails);
    } catch (error) {
      setError(error.message);
    }
  
    setLoading(false);
  };
  

  const handleInputChange = (event) => {
    setEventId(event.target.value);
  };

  const fetchEvent = async (eventId) => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("id", "==", eventId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const eventData = querySnapshot.docs[0].data();
        return eventData;
      } else {
        throw new Error("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      throw error;
    }
  };
  

  const fetchParticipantDetails = async (eventId) => {
    try {
      const participantsRef = collection(db, "Registrations");
      const q = query(participantsRef, where("eventid", "==", eventId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No participants found for the entered event ID");
      }
      const participantDetails = [];
      for (const docRef of querySnapshot.docs) {
        const participantData = docRef.data();
        const userData = await fetchUserData(participantData.nkid);
        participantDetails.push({
          ...participantData,
          college: userData.college,
          semester: userData.semester,
          branch: userData.branch,
          team: participantData.team ? participantData.team : null // Check if team details exist, otherwise set to null
        });
      }
      return participantDetails;
    } catch (error) {
      console.error("Error fetching participant details:", error);
      throw error;
    }
  };

  const fetchUserData = async (nkid) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("NKID", "==", nkid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  return (
    <div className="text-white">
      <h1 className="font-bold text-2xl mb-4">Event Participant Details</h1>
      <div className="mb-5 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={eventid}
            onChange={handleInputChange}
            placeholder="Enter Event ID"
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
      {eventName && <h2 className="text-lg font-semibold mb-4">Event Name: {eventName}</h2>} {/* Display event name */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
      <div className="flex justify-center items-center">
        {participants.length > 0 ? (
          <table className="border border-gray-200 divide-gray-500">
            {participants.map((participant, index) => (
              <tbody key={index} className="divide-y divide-gray-200">
                <tr>
                  <th
                    colSpan="2"
                    className="px-6 py-3 text-center text-sm text-white bg-gray-500"
                  >
                    Participant {index + 1}
                  </th>
                </tr>
                <tr className="bg-transparent">
                  <td className="px-6 py-4 text-sm text-white">
                    Name: {participant.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    Phone: {participant.phone}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-white">
                    NKID: {participant.nkid}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    Email: {participant.email}
                  </td>
                </tr>
                <tr className="bg-transparent">
                  <td className="px-6 py-4 text-sm text-white" colSpan="2">
                    College: {participant.college}
                  </td>
                </tr>
                <tr className="bg-transparent">
                  <td className="px-6 py-4 text-sm text-white">
                    Branch: {participant.branch}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    Semester: {participant.semester}
                  </td>
                </tr>
                {participant.team && ( // Check if team details exist
                  <tr className="bg-transparent">
                    <td className="px-6 py-4 text-sm text-white" colSpan="2">
                      Team: {participant.team}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default ParticipantDetails;
