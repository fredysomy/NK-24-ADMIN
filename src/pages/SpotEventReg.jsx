import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function EventRegistrationForm() {
  const [formData, setFormData] = useState({
    attended: true,
    email: "",
    eventid: "",
    eventname: "",
    id: "",
    nkid: "",
    online: false,
    payment_id: "spot",
    phone: "",
    refcode: "nor",
    team: null,
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);

  let globalEventName = "";
  const handleRegistration = async () => {
    const eventName = await getEventName(formData.eventid);
    globalEventName = eventName;
    handleAddToDatabase();
  };

  const handleAddToDatabase = async () => {
    try {
      const customId = `${formData.nkid}-${formData.eventid}`;
      if (!customId) {
        console.log("No custom ID provided.");
        return;
      }
      console.log("This is Global team ",globalTeamMembers);
      const teamString = concatenateTeamMembers(globalTeamMembers);
      console.log("New : ",teamString);
      const docRef = doc(db, "Registrations2", customId);
      const { memberName, ...dataWithoutId } = formData;
      await setDoc(docRef, dataWithoutId);
      updateDB(customId, teamString);
    } catch (error) {
      console.error("Error registering user:", error.message);
      console.error("Firestore error details:", error);
    }
  };
  const updateDB = async (id, team) => {
    try {
      const docRef = doc(db, "Registrations2", id);
      await updateDoc(docRef, {
        team: team,
        eventname: globalEventName,
      });
      alert("Event Registration Successfull");
      alert("Your Event Registration ID is : " + id);
      navigate("/selection", { state: { auth: true } });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const concatenateTeamMembers = (teamMembers) => {
    console.log("This is Team Members ",teamMembers);
    if (!teamMembers || teamMembers.length === 1 || teamMembers[0] === null) {
      return null;
    }
    console.log("after NULL");
    return teamMembers.join(",");
  };

  let globalTeamMembers = [];
  const handleAddMember = () => {
    const newMemberName = formData.memberName;
    const updatedTeamMembers = [...teamMembers, newMemberName];
    setTeamMembers(updatedTeamMembers);
    globalTeamMembers = updatedTeamMembers;
    setFormData({ ...formData, memberName: "" });
  };

  const getEventName = async (eventId) => {
    try {
      let eventName = "";
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("id", "==", eventId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        eventName = doc.data().name;
      });

      return eventName;
    } catch (error) {
      console.error("Error fetching event name:", error.message);
    }
  };

  const handleSignUp = () => {
    setIsSignUpClicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchDetails(formData.nkid);
    setLoading(false);
    setSubmitted(true);
  };
  const fetchDetails = async (nkid) => {
    try {
      const usersCollectionRef = collection(db, "users2test"); // Assuming "users" is your collection name
      const q = query(usersCollectionRef, where("NKID", "==", nkid)); // Define the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setFormData({
            ...formData,
            username: doc.data().name,
            email: doc.data().email,
            phone: doc.data().phoneNumber,
            id: doc.data().CACode,
          });
        });
      } else {
        alert("No such user!");
        navigate("/selection");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(null); // Reset user details state on error
    }
  };

  return (
    <div className="text-white font-pop">
      <div className="text-white">
        <h1 className="font-bold text-2xl mb-5">Register For an Event</h1>
        <h4 className="font-bold text-xl mb-5">Enter NK ID</h4>
        <div className="mb-5 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              name="nkid"
              value={formData.nkid}
              placeholder="NK-XXXX"
              className="w-64 px-4 py-2 rounded-l-md border focus:outline-none bg-gray-800"
              onChange={handleChange}
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
      </div>
      <div>
        {submitted && (
          <>
            <table className="border border-gray-200 mx-auto mt-5">
              <tbody>
                <tr>
                  <th className="border border-gray-200 p-2 text-left bg-gray-800">
                    Name
                  </th>
                  <td className="border border-gray-200 p-2 text-left bg-transparent">
                    {formData.username}
                  </td>
                </tr>
              </tbody>
            </table>
            <Typography
              variant="h6"
              color="white"
              className="mb-5 mt-5 font-pop text-xl"
            >
              Event
            </Typography>
            <select
              name="eventid"
              value={formData.eventid}
              className="bg-transparent text-white h-10 mb-5 border border-white rounded w-60"
              onChange={handleChange}
            >
              <option className="text-black" value="null">
                Select Event
              </option>
              <option className="text-black" value="NK-03">
                3×3 Football
              </option>
              <option className="text-black" value="NK-52">
                AI IMAGE GENERATOR
              </option>
              <option className="text-black" value="NK-74">
                ALL TERRAIN ROBO RACE
              </option>
              <option className="text-black" value="NK-80">
                AUTOSKETCH
              </option>
              <option className="text-black" value="NK-36">
                Animazing
              </option>
              <option className="text-black" value="NK-47">
                Artle
              </option>
              <option className="text-black" value="NK-49">
                BREAK THE QUERY
              </option>
              <option className="text-black" value="NK-75">
                Basketball 5x5(Female)
              </option>
              <option className="text-black" value="NK-25">
                Basketball 5x5(Male)
              </option>
              <option className="text-black" value="NK-59">
                Best Anchor
              </option>
              <option className="text-black" value="NK-65">
                Blockchain Workshop
              </option>
              <option className="text-black" value="NK-38">
                CSS CODE CHALLENGE
              </option>
              <option className="text-black" value="NK-68">
                CUT THE CLASH
              </option>
              <option className="text-black" value="NK-11">
                Cad Clash
              </option>
              <option className="text-black" value="NK-46">
                Call of Duty Mobile
              </option>
              <option className="text-black" value="NK-30">
                Canoe Workshop
              </option>
              <option className="text-black" value="NK-57">
                Chem hunt
              </option>
              <option className="text-black" value="NK-64">
                Chemcar
              </option>
              <option className="text-black" value="NK-21">
                Circuit Debugging
              </option>
              <option className="text-black" value="NK-31">
                CodeOptimizer
              </option>
              <option className="text-black" value="NK-18">
                Come let's,build
              </option>
              <option className="text-black" value="NK-10">
                County Cricket
              </option>
              <option className="text-black" value="NK-07">
                DOUBLE TROUBLE
              </option>
              <option className="text-black" value="NK-08">
                Dumb Charades
              </option>
              <option className="text-black" value="NK-43">
                Duo-Dance
              </option>
              <option className="text-black" value="NK-69">
                E-Soldero
              </option>
              <option className="text-black" value="NK-15">
                Efootball 2024 (PES) (Online )
              </option>
              <option className="text-black" value="NK-28">
                Fifa 24
              </option>
              <option className="text-black" value="NK-04">
                Film triffle
              </option>
              <option className="text-black" value="NK-42">
                Flavorcraft Ventures: Innovate, Create, Savour
              </option>
              <option className="text-black" value="NK-70">
                GOURMET BATTLE
              </option>
              <option className="text-black" value="NK-56">
                GROMATICI
              </option>
              <option className="text-black" value="NK-41">
                Grandmaster Gala
              </option>
              <option className="text-black" value="NK-61">
                INQUEST
              </option>
              <option className="text-black" value="NK-35">
                IPL Draft
              </option>
              <option className="text-black" value="NK-05">
                Infinity glam
              </option>
              <option className="text-black" value="NK-22">
                JAM(English)
              </option>
              <option className="text-black" value="NK-20">
                JAM(Malayalam)
              </option>
              <option className="text-black" value="NK-37">
                Kaptured"24
              </option>
              <option className="text-black" value="NK-72">
                Kickering
              </option>
              <option className="text-black" value="NK-24">
                Line Follower maze
              </option>
              <option className="text-black" value="NK-16">
                Make the cut
              </option>
              <option className="text-black" value="NK-77">
                Man Of Steel
              </option>
              <option className="text-black" value="NK-79">
                Mech Maniac
              </option>
              <option className="text-black" value="NK-48">
                Millet Marvels: A Green Revolution
              </option>
              <option className="text-black" value="NK-44">
                Mr. and Ms. Nakshathra
              </option>
              <option className="text-black" value="NK-12">
                Neo-Graffiti
              </option>
              <option className="text-black" value="NK-34">
                Nirvana Nation
              </option>
              <option className="text-black" value="NK-71">
                PCB Designing Workshop
              </option>
              <option className="text-black" value="NK-19">
                PIXELATE
              </option>
              <option className="text-black" value="NK-78">
                PUBG
              </option>
              <option className="text-black" value="NK-53">
                Panoramic
              </option>
              <option className="text-black" value="NK-32">
                Pencil Mania
              </option>
              <option className="text-black" value="NK-29">
                QUIZADRY
              </option>
              <option className="text-black" value="NK-13">
                QUIZZLE
              </option>
              <option className="text-black" value="NK-67">
                Quake the structure
              </option>
              <option className="text-black" value="NK-06">
                Quiztopia
              </option>
              <option className="text-black" value="NK-63">
                REELAGRAM
              </option>
              <option className="text-black" value="NK-14">
                REELISTIC DELIGHTS
              </option>
              <option className="text-black" value="NK-33">
                ROBOSOCCER
              </option>
              <option className="text-black" value="NK-27">
                Racquettes(Men)
              </option>
              <option className="text-black" value="NK-82">
                Racquettes(Women)
              </option>
              <option className="text-black" value="NK-23">
                SYNC STEP
              </option>
              <option className="text-black" value="NK-17">
                Scene de Crime
              </option>
              <option className="text-black" value="NK-66">
                Sneak Attack (volleyball)
              </option>
              <option className="text-black" value="NK-39">
                Soldering Competition
              </option>
              <option className="text-black" value="NK-81">
                Strike'em Down
              </option>
              <option className="text-black" value="NK-54">
                Strings Unplugged
              </option>
              <option className="text-black" value="NK-51">
                The Laughter Extravaganza
              </option>
              <option className="text-black" value="NK-26">
                Titan Actor
              </option>
              <option className="text-black" value="NK-40">
                Treasure Pursuit
              </option>
              <option className="text-black" value="NK-50">
                UPCYCLE FRENZY
              </option>
              <option className="text-black" value="NK-62">
                VR Gaming
              </option>
              <option className="text-black" value="NK-73">
                Valorant
              </option>
              <option className="text-black" value="NK-58">
                Voice of Nakshatra
              </option>
              <option className="text-black" value="NK-02">
                Watts up challenge
              </option>
              <option className="text-black" value="NK-60">
                Workshop on Drones
              </option>
              <option className="text-black" value="NK-55">
                Xperia - Arduino Coding
              </option>
            </select>
            <Typography
              variant="h6"
              color="white"
              className="mb-5 font-pop text-xl"
            >
              Team
            </Typography>
            <select
              id="team"
              name="team"
              className="bg-transparent text-white h-10 border border-white rounded w-60 mb-5"
              value={formData.team}
              onChange={handleChange}
            >
              <option className="text-black border-black" value="null">
                Single
              </option>
              <option className="text-black border-black" value="team">
                Team
              </option>
            </select>
            {formData.team === "team" && (
              <div className="flex flex-col items-center w-60 mx-auto">
                {teamMembers.map((member, index) => (
                  <Input
                    key={index}
                    size="lg"
                    placeholder={`Member ${index + 1}'s Name`}
                    value={member}
                    className="text-white mb-5"
                    readOnly
                  />
                ))}
                {!isSignUpClicked && (
                  <Input
                    size="lg"
                    placeholder="Add member's name"
                    name="memberName"
                    className="text-white"
                    value={formData.memberName}
                    onChange={handleChange}
                  />
                )}
                <Button
                  size="sm"
                  color="blue-gray"
                  onClick={handleAddMember}
                  className="text-white h-10 mt-5"
                >
                  Add Member
                </Button>
              </div>
            )}
            <div>
              <Button
                className="mt-4"
                onClick={() => {
                  handleSignUp();
                  handleAddMember();
                  handleRegistration();
                }}
              >
                Register For Event
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EventRegistrationForm;
