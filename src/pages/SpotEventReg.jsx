import React, { useState } from "react";
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
  orderBy,
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
    if (eventName !== null) {
      globalEventName = eventName;
      handleAddToDatabase();
    } else {
      navigate("/selection", { state: { auth: true } });
    }
  };

  const handleAddToDatabase = async () => {
    try {
      const customId = `${formData.nkid}-${formData.eventid}`;
      if (!customId) {
        console.log("No custom ID provided.");
        return;
      }
      const teamString = concatenateTeamMembers(globalTeamMembers);
      const docRef = doc(db, "Registrations", customId);
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
      const docRef = doc(db, "Registrations", id);
      await updateDoc(docRef, {
        team: team,
        eventname: globalEventName,
      });
      alert("Event Registration ID is : " + id);
      alert("Event Registration Successfull");
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
    if (!teamMembers || teamMembers.length === 1 || teamMembers[0] === null) {
      return null;
    }
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
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("id", "==", eventId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const eventDocRef = doc.ref;
        let spotOn = parseInt(doc.data().spot_on);
        if (!isNaN(spotOn)) {
          if (spotOn === 0) {
            alert("No Spots Left");
            return null;
          } else {
            spotOn -= 1;
            const newSpotOn = spotOn.toString();
            await updateDoc(eventDocRef, { spot_on: newSpotOn });
            return doc.data().name;
          }
        }
      }
      return null; // Return null if no event name is found
    } catch (error) {
      console.error("Error fetching event name:", error.message);
      throw error;
    }
  };

  const handleSignUp = () => {
    setIsSignUpClicked(true);
  };

  const handleGoBack = () => {
    navigate("/selection", { state: { auth: true } }); // Navigate to the selection page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchDetails(formData.nkid);
    setLoading(false);
    setSubmitted(true);
  };
  const fetchDetails = async (identifier) => {
    try {
      const usersCollectionRef = collection(db, "users"); // Assuming "users" is your collection name
      let q;

      if (identifier.substring(0, 2).toUpperCase() === "NK") {
        q = query(usersCollectionRef, where("NKID", "==", identifier));
      } else {
        q = query(usersCollectionRef, where("email", "==", identifier));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setFormData({
            ...formData,
            username: doc.data().name,
            email: doc.data().email,
            phone: doc.data().phoneNumber,
            id: doc.data().CACode,
            nkid: doc.data().NKID,
          });
        });
      } else {
        alert("No such user!");
        navigate("/selection", { state: { auth: true } });
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
        <h4 className=" text-xl mb-5">Enter NK ID or Email</h4>
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
              className="bg-transparent text-white h-10 mb-5 border border-white rounded w-80"
              onChange={handleChange}
            >
              <option className="text-black" value="null">
                Select Event
              </option>
              <option className="text-black" value="NK-03">
                3×3 Football (Mar 1, Team (3-5), Rs 300)
              </option>
              <option className="text-black" value="NK-52">
                AI IMAGE GENERATOR (Mar 1, Team (2-2), Rs 50)
              </option>
              <option className="text-black" value="NK-74">
                ALL TERRAIN ROBO RACE (Mar 1, Team (1-4), Rs 200)
              </option>
              <option className="text-black" value="NK-80">
                AUTOSKETCH (Mar 2, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-36">
                Animazing (Mar 1,2, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-47">
                Artle (Mar 1,2, Single, Rs 40)
              </option>
              <option className="text-black" value="NK-49">
                BREAK THE QUERY (Mar 2, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-75">
                Basketball 5x5(Female) (Mar 1,2, Team (5-12), Rs 250)
              </option>
              <option className="text-black" value="NK-25">
                Basketball 5x5(Male) (Mar 1,2, Team (5-12), Rs 250)
              </option>
              <option className="text-black" value="NK-59">
                Best Anchor (Mar 1, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-65">
                Blockchain Workshop (Mar 1, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-38">
                CSS CODE CHALLENGE (Mar 2, Team (1-3), Rs 50)
              </option>
              <option className="text-black" value="NK-68">
                CUT THE CLASH (Feb 24 to Mar 1, Single, Rs 80)
              </option>
              <option className="text-black" value="NK-11">
                Cad Clash (Mar 1, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-46">
                Call of Duty Mobile (Mar 1, Team (3-4), Rs 100)
              </option>
              <option className="text-black" value="NK-30">
                Canoe Workshop (Mar 1, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-57">
                Chem hunt (Mar 2, Team (2-3), Rs 50)
              </option>
              <option className="text-black" value="NK-64">
                Chemcar (Mar 1, Team (2-3), Rs 100)
              </option>
              <option className="text-black" value="NK-21">
                Circuit Debugging (Mar 1, Team (2-3), Rs 80)
              </option>
              <option className="text-black" value="NK-31">
                CodeOptimizer (Mar 1, Team (1-2), Rs 50)
              </option>
              <option className="text-black" value="NK-18">
                Come let's,build (Mar 2, Team (2-4), Rs 80)
              </option>
              <option className="text-black" value="NK-10">
                County Cricket (Mar 1,2, Team (5-7), Rs 500)
              </option>
              <option className="text-black" value="NK-07">
                DOUBLE TROUBLE (Mar 2, Team (2-2), Rs 50)
              </option>
              <option className="text-black" value="NK-08">
                Dumb Charades (Mar 2, Team (2-2), Rs 30)
              </option>
              <option className="text-black" value="NK-43">
                Duo-Dance (Mar 1, Team (2-2), Rs 100)
              </option>
              <option className="text-black" value="NK-69">
                E-Soldero (Mar 1, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-15">
                Efootball 2024 (PES) (Online ) (Feb 25, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-28">
                Fifa 24 (Mar 2, Single, Rs 75)
              </option>
              <option className="text-black" value="NK-04">
                Film triffle (Mar 2, Team (2-2), Rs 40)
              </option>
              <option className="text-black" value="NK-42">
                Flavorcraft Ventures: Innovate, Create, Savour (Mar 2, Single,
                Rs 30)
              </option>
              <option className="text-black" value="NK-70">
                GOURMET BATTLE (Mar 1, Team (2-2), Rs 100)
              </option>
              <option className="text-black" value="NK-56">
                GROMATICI (Mar 1, Team (2-3), Rs 50)
              </option>
              <option className="text-black" value="NK-41">
                Grandmaster Gala (Mar 2, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-61">
                INQUEST (Mar 2, Team (2-5), Rs 25)
              </option>
              <option className="text-black" value="NK-35">
                IPL Draft (Mar 1, Team (1-3), Rs 30)
              </option>
              <option className="text-black" value="NK-05">
                Infinity glam (Mar 2, Team (10-22), Rs 2000)
              </option>
              <option className="text-black" value="NK-22">
                JAM(English) (Mar 1, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-20">
                JAM(Malayalam) (Mar 1, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-37">
                Kaptured"24 (Mar 2, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-72">
                Kickering (Mar 2, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-24">
                Line Follower maze (Mar 1, Single, Rs 200)
              </option>
              <option className="text-black" value="NK-16">
                Make the cut (Feb 28, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-77">
                Man Of Steel (Mar 1, Single, Rs 150)
              </option>
              <option className="text-black" value="NK-79">
                Mech Maniac (Mar 1, Team (1-2), Rs 50)
              </option>
              <option className="text-black" value="NK-48">
                Millet Marvels: A Green Revolution (Mar 1, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-44">
                Mr. and Ms. Nakshatra (Mar 1, Single, Rs 200)
              </option>
              <option className="text-black" value="NK-12">
                Neo-Graffiti (Mar 1, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-34">
                Nirvana Nation (Mar 2, Team (3-10), Rs 300)
              </option>
              <option className="text-black" value="NK-71">
                PCB Designing Workshop (Mar 2, Single, Rs 150)
              </option>
              <option className="text-black" value="NK-19">
                PIXELATE (Feb 24-Mar 1, Single, Rs 10)
              </option>
              <option className="text-black" value="NK-78">
                PUBG (Feb 25, Team (4-4), Rs 60)
              </option>
              <option className="text-black" value="NK-53">
                Panoramic (Mar 1, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-32">
                Pencil Mania (Mar 1, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-29">
                QUIZADRY (Mar 1, Team (2-2), Rs 80)
              </option>
              <option className="text-black" value="NK-13">
                QUIZZLE (Mar 1, Team (2-3), Rs 50)
              </option>
              <option className="text-black" value="NK-67">
                Quake the structure (Mar 1, Team (2-3), Rs 100)
              </option>
              <option className="text-black" value="NK-06">
                Quiztopia (Mar 1, Team (2-3), Rs 80)
              </option>
              <option className="text-black" value="NK-63">
                REELAGRAM (Feb 24-29, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-14">
                REELISTIC DELIGHTS (Mar 1,2, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-33">
                ROBOSOCCER (Mar 1, Team (1-4), Rs 250)
              </option>
              <option className="text-black" value="NK-27">
                Racquettes(Men) (Mar 1,2, Team (2-2), Rs 100)
              </option>
              <option className="text-black" value="NK-82">
                Racquettes(Women) (Mar 1,2, Team (2-2), Rs 100)
              </option>
              <option className="text-black" value="NK-23">
                SYNC STEP (Mar 2, Team (7-30), Rs 600)
              </option>
              <option className="text-black" value="NK-17">
                Scene de Crime (Mar 1, Team, Rs 100)
              </option>
              <option className="text-black" value="NK-66">
                Sneak Attack (volleyball) (Mar 2, Team (6-12), Rs 500)
              </option>
              <option className="text-black" value="NK-39">
                Soldering Competition (Mar 2, Single, Rs 80)
              </option>
              <option className="text-black" value="NK-81">
                Strike'em Down (Mar 2, Single, Rs 40)
              </option>
              <option className="text-black" value="NK-54">
                Strings Unplugged (Mar 2, Team (4-10), Rs 500)
              </option>
              <option className="text-black" value="NK-51">
                The Laughter Extravaganza (Mar 1, Single, Rs 50)
              </option>
              <option className="text-black" value="NK-26">
                Titan Actor (Mar 1, Single, Rs 80)
              </option>
              <option className="text-black" value="NK-40">
                Treasure Pursuit (Mar 2, Team (1-4), Rs 100)
              </option>
              <option className="text-black" value="NK-50">
                UPCYCLE FRENZY (Mar 1, Team, Rs 50)
              </option>
              <option className="text-black" value="NK-62">
                VR Gaming (Mar 1, Single, Rs 60)
              </option>
              <option className="text-black" value="NK-73">
                Valorant (Feb 22,23,24(Final), Team (5-5), Rs 100)
              </option>
              <option className="text-black" value="NK-58">
                Voice of Nakshatra (Mar 1, Single, Rs 150)
              </option>
              <option className="text-black" value="NK-02">
                Watts up challenge (Mar 1, Single, Rs 30)
              </option>
              <option className="text-black" value="NK-60">
                Workshop on Drones (Mar 2, Single, Rs 100)
              </option>
              <option className="text-black" value="NK-55">
                Xperia - Arduino Coding (Mar 2, Team (1-3), Rs 50)
              </option>
            </select>
            <Typography
              variant="h6"
              color="white"
              className="mb-5 font-pop text-xl"
            >
              Type (Single or Team)
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
      <div className="mt-5">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 border text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default EventRegistrationForm;
