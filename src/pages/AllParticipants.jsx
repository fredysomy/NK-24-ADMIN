import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function AllParticipantDetails() {
  const [loading, setLoading] = useState(true);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsAndParticipants = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = [];
        for (const eventDoc of eventsSnapshot.docs) {
          const eventId = eventDoc.id;
          const eventName = eventDoc.data().name;
          const participantQuery = query(
            collection(db, "Registrations"),
            where("eventid", "==", eventId)
          );
          const participantSnapshot = await getDocs(participantQuery);

          const participants = [];
          participantSnapshot.forEach((doc) => {
            participants.push({ id: doc.id, ...doc.data() });
          });

          eventsData.push({ eventId, eventName, participants });
        }

        setEventParticipants(eventsData);
      } catch (error) {
        console.error("Error fetching event participants:", error);
        setError("Error fetching event participants. Please try again later.");
      }
      setLoading(false);
    };

    fetchEventsAndParticipants();
  }, []);

  return (
    <div className="text-white">
      <h1 className="font-bold text-2xl mb-4">Event Participant Details</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading &&
        !error &&
        eventParticipants.map(({ eventName, participants }) => (
          <div key={eventName} className="mb-8">
            <h2 className="font-bold text-xl mb-4">{eventName}</h2>
            {participants.length > 0 ? (
              <table className="border border-gray-200 divide-gray-500">
                <tbody className="divide-y divide-gray-200">
                  {participants.map((participant, index) => (
                    <React.Fragment key={participant.id}>
                      {index === 0 && (
                        <tr>
                          <th
                            colSpan="2"
                            className="px-6 py-3 text-center text-sm text-white"
                          >
                            Participants
                          </th>
                        </tr>
                      )}
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
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No participants for this event.</div>
            )}
          </div>
        ))}
    </div>
  );
}

export default AllParticipantDetails;
