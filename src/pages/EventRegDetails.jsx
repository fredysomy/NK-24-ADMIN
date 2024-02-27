import React, { useState, useEffect,use } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function ParticipantDetailsPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState({});
  const [participants, setParticipants] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = (path) => {
    navigate(path);
  };
  useEffect(() => {
    console.log("Fetching event data...");
    const fetchEventData = async () => {
      const eventsCollectionRef = collection(db, "events");
      const eventQuery = query(eventsCollectionRef, where("id", "==", eventId));

      try {
        const eventQuerySnapshot = await getDocs(eventQuery);
        if (!eventQuerySnapshot.empty) {
          eventQuerySnapshot.forEach((doc) => {
            setEventDetails(doc.data());
          });
        } else {
          console.log("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details: ", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    console.log("Fetching participants...");
    const fetchParticipants = async () => {
      const participantsCollectionRef = collection(db, "Registrations");
      const q = query(
        participantsCollectionRef,
        where("eventid", "==", eventId)
      );

      try {
        const querySnapshot = await getDocs(q);
        const participantList = [];
        querySnapshot.forEach((doc) => {
          participantList.push({ id: doc.id, ...doc.data() });
        });
        setParticipants(participantList);
      } catch (error) {
        console.error("Error fetching participants: ", error);
      } finally {
        setLoading(false); // Set loading to false after attempting to fetch participants
      }
    };

    fetchParticipants();
  }, [eventId]);

  useEffect(() => {
    console.log("Fetching user details...");
    const fetchUserDetails = async () => {
      const usersCollectionRef = collection(db, "users");

      try {
        const userQuerySnapshot = await getDocs(usersCollectionRef);
        const userDetailsMap = {};
        userQuerySnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          userDetailsMap[userData.NKID] = {
            college: userData.college,
            branch: userData.branch,
            semester: userData.semester,
            nkid: userData.NKID,
          };
        });

        setUserDetails(userDetailsMap);
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserDetails();
  }, []); // Fetch user details only once when the component mounts

  // Calculate total count of participants
  const totalParticipants = participants.length;

  return (
    <div className="text-white flex justify-center">
      <div>
        <h2 className="font-bold text-3xl mb-4">
          {eventDetails.name && `Event: ${eventDetails.name}`}
        </h2>
        {loading ? (
          <p className="text-xl font-bold">Loading...</p>
        ) : (
          <>
            <p className="text-xl font-semibold mb-4">
              Total Participants: {totalParticipants}
            </p>
            <Link to="/events">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5" onClick={() => navigateTo("/spotselection", { state: { auth: true } })}>
                Search Another Event
              </button>
            </Link>
            {totalParticipants === 0 ? (
              <p>No participants yet.</p>
            ) : (
              <table className="table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">NK ID</th>
                    <th className="px-4 py-2">College</th>
                    <th className="px-4 py-2">Branch</th>
                    <th className="px-4 py-2">Semester</th>
                    {/* Add more table headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="border px-4 py-2">
                        {participant.username}
                      </td>
                      <td className="border px-4 py-2">
                        {userDetails[participant.nkid]?.nkid || "Loading..."}
                      </td>
                      <td className="border px-4 py-2">
                        {userDetails[participant.nkid]?.college || "Loading..."}
                      </td>
                      <td className="border px-4 py-2">
                        {userDetails[participant.nkid]?.branch || "Loading..."}
                      </td>
                      <td className="border px-4 py-2">
                        {userDetails[participant.nkid]?.semester || "Loading..."}
                      </td>
                      {/* Add more table cells for additional participant details */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ParticipantDetailsPage;



