import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";

function AllParticipantDetails() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(collection(db, "events"), orderBy("name"));
        const eventsSnapshot = await getDocs(eventsQuery);
        // Inside the fetchEvents function

        const eventDataPromises = eventsSnapshot.docs.map(async (doc) => {
          try {
            const event = doc.data();
            if (!event || !event.name) {
              throw new Error("Event data or name is null");
            }
            const registrationsQuery = query(
              collection(db, "Registrations"),
              where("eventid", "==", doc.data().id)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            const registrationsDataPromises = registrationsSnapshot.docs.map(
              async (regDoc) => {
                const registration = regDoc.data();
                const userQuery = query(
                  collection(db, "users"),
                  where("NKID", "==", registration.nkid)
                );
                const userSnapshot = await getDocs(userQuery);
                const userData = userSnapshot.docs.map((userDoc) =>
                  userDoc.data()
                );
                return {
                  username: userData[0].name,
                  college: userData[0].college,
                  branch: userData[0].branch,
                  email: registration.email,
                };
              }
            );
            const registrationsData = await Promise.all(
              registrationsDataPromises
            );
            return {
              id: doc.data().id,
              name: event.name,
              registrations: registrationsData,
            };
          } catch (error) {
            console.error("Error processing event data: ", error);
          }
        });

        const eventData = await Promise.all(eventDataPromises);
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchEvents();
  }, []);
  if (loading) {
    return <div className="text-center text-white text-3xl font-bold">Loading...</div>; // Or replace with a spinner component
  }

  return (
    <div className="text-white">
      <h2 className="font-bold text-3xl mb-10">
        List of all Events and Participants
      </h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event && event.name ? (
              <div>
                <h3 className="mt-10 mb-5 text-xl font-bold ">
                  {event.name} (Event ID: {event.id})
                </h3>
                {event.registrations.length === 0 ? (
                  <p>No registrations yet</p>
                ) : (
                  <div className="flex justify-center items-center">
                    <table className="table-auto border-collapse border border-gray-100">
                      <tbody>
                        {event.registrations.map((registration, regIndex) => (
                          <tr
                            key={regIndex}
                            className="border-b border-gray-200"
                          >
                            <td className="border border-gray-200 p-4">
                              <p>
                                <strong>Name:</strong> {registration.username}
                              </p>
                              <p>
                                <strong>Email:</strong> {registration.email}
                              </p>
                              <p>
                                <strong>College:</strong> {registration.college}
                              </p>
                              <p>
                                <strong>Branch:</strong> {registration.branch}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <p>Error: Event data is null or missing</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllParticipantDetails;
