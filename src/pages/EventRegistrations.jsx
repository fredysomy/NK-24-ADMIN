import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  doc,
  orderBy,
  getDocs,
  getFirestore,
  where,
} from "firebase/firestore";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [regData,setRegData]=useState([]);
  const navigate = useNavigate();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsCollectionRef = collection(db, "events");
        const eventsQuerySnapshot = await getDocs(
          query(eventsCollectionRef, orderBy("name"))
        );
        const eventList = eventsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventList);

        const registrationsCollectionRef = collection(
          db,
          "Registrations"
        );
        const registrationsQuerySnapshot = await getDocs(
          registrationsCollectionRef
        );
        const totalRegistrationsCount = registrationsQuerySnapshot.size;
        setRegData(registrationsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })))
       
        setTotalRegistrations(totalRegistrationsCount);

        const eventRegistrationsMap = {};
        for (const event of eventList) {
          const q = query(
            collection(firestore, "Registrations"),
            where("eventid", "==", event.id)
          );
          const querySnapshot = await getDocs(q);
          eventRegistrationsMap[event.id] = querySnapshot.size;
        }

        setEventRegistrations(eventRegistrationsMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
fetchData();

 

    return () => {
      // Cleanup function to prevent state updates if unmounted
      setLoading(false);
    };
  }, []);

  const handleViewDetails = (eventId) => {
    console.log("Navigating to event details page:", eventId);
    navigate(`/events/${eventId}`);
  };


  if (loading) {
    return <p className="text-white font-bold text-2xl">Loading...</p>;
  }

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="text-white flex justify-center">
      <div>
        <h2 className="font-bold text-3xl mb-4">Events</h2>
        <p className="text-xl font-semibold mb-4">
          Total Registrations: {totalRegistrations}
        </p>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Total Registrations</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="border px-4 py-2">{event.name}</td>
                <td className="border px-4 py-2">
                 {regData.filter(e=>e.eventid==event.id).length}
                  
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleViewDetails(event.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventList;
