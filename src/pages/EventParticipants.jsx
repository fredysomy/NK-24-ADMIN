import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function ParticipantDetails() {
  const [eventid, setEventid] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [eventName, setEventName] = useState(null);

  // Function to fetch event name
  const fetchEventName = async () => {
    if (!eventid) {
      console.log("No event ID provided");
      return;
    }
    try {
      const eventsQuery = query(collection(db, "events"), where("id", "==", eventid));
      const querySnapshot = await getDocs(eventsQuery);

      if (!querySnapshot.empty) {
        const eventDoc = querySnapshot.docs[0];
        setEventName(eventDoc.data().name);
      } else {
        setEventName(null);
        console.log("No event found for ID:", eventid);
      }
    } catch (error) {
      console.error("Error fetching event name:", error);
      setEventName(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setParticipants([]);

    await fetchEventName(); // Fetch the event name here

    try {
      const participantQuery = query(
        collection(db, "Registrations"),
        where("eventid", "==", eventid)
      );
      const querySnapshot = await getDocs(participantQuery);

      if (!querySnapshot.empty) {
        const participantData = [];
        querySnapshot.forEach((doc) => {
          participantData.push({ id: doc.id, ...doc.data() });
        });
        setParticipants(participantData);
      } else {
        setError("No participants found for the given event ID");
      }
    } catch (error) {
      console.error("Error fetching participant details:", error);
      setError("Error fetching participant details. Please try again later.");
    }

    setLoading(false);
  };

  const handleInputChange = (event) => {
    setEventid(event.target.value);
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
      {loading && <div>Loading...</div>}
      {!loading && eventName && (
        <h2 className="font-semi-bold text-white text-xl mb-4">Event: {eventName}</h2>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex justify-center items-center">
        {participants.length > 0 ? (
          <table className="border border-gray-200 divide-gray-500">
            {participants.map((participant, index) => (
              <tbody key={participant.id} className="divide-y divide-gray-200">
                <tr>
                  <th
                    colSpan="2"
                    className="px-6 py-3 text-center text-sm text-white"
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
                <tr className="bg-gray-500">
                  <td className="px-6 py-4 text-sm text-white">
                    NKID: {participant.nkid}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    Email: {participant.email}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default ParticipantDetails;
