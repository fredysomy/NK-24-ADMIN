import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export function SimpleRegistrationForm() {
  const [formData, setFormData] = useState({
    attended: true,
    name: "",
    email: "",
    eventId: "",
    eventName: "",
    nkid: "",
    online: false,
    paymentId: "spot",
    phone: "",
    refCode: "nor",
    team: "null",
    branch: "",
    college: "",
    semester: "",
    memberName: "",
    CACode: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);

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
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);

  const handleSignUp = () => {
    setIsSignUpClicked(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMemberChange = (e) => {
    setFormData({
      ...formData,
      memberName: e.target.value,
    });
  };

  const concatenateTeamMembers = (teamMembers) => {
    if (!teamMembers || teamMembers.length === 0) {
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

  const handleRegistration = async () => {
    const eventName = await getEventName(formData.eventId);
    const ids = doc(collection(db, "users2test")).id;
    try {
      setFormData({
        ...formData,
        eventName: eventName,
        CACode: ids,
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
    try {
      await addDoc(collection(db, "users2test"), {
        CACode: ids,
        NKID: `NK-${ids.substring(0, 5).toUpperCase()}`,
        branch: formData.branch,
        college: formData.college,
        email: formData.email,
        name: formData.name,
        phoneNumber: formData.phone,
        semester: formData.semester,
        isCA: false,
        refCount: 0,
      });
      alert("Participant Added Successfully");
    } catch (error) {
      console.error("Error registering user:", error.message);
      console.error("Firestore error details:", error);
    }
    const concatenatedString = concatenateTeamMembers(globalTeamMembers);
    const teamnames =
      globalTeamMembers.length === 0 || concatenatedString === ""
        ? null
        : concatenatedString;

    console.log(teamnames);

    try {
      await addDoc(collection(db, "Registrations2"), {
        attended: true,
        email: formData.email,
        eventId: formData.eventId,
        eventName: eventName,
        id: ids,
        nkid: `NK-${ids.substring(0, 5).toUpperCase()}-${formData.eventId}`,
        online: true,
        paymentId: "spot",
        phone: formData.phone,
        refCode: "nor",
        username: formData.name,
        team: teamnames,
      });
      alert("Event Registration Added Successfully");
    } catch (error) {
      console.error("Error registering user:", error.message);
      console.error("Firestore error details:", error);
    }
    console.log("Registration successful!");
  };

  return (
    <div className="text-white font-pop">
      <Card color="transparent" shadow={true}>
        <Typography variant="h4" color="white">
          Add Participant Details
        </Typography>
        <form className="mt-2 w-80 max-w-screen-lg sm:w-96 mx-auto p-8">
          <div className="mb-2 flex flex-col gap-4">
            <Typography variant="h6" color="white" className="-mb-3">
              Name
            </Typography>
            <Input
              size="lg"
              placeholder="Leonardo DiCaprio"
              name="name"
              className="text-white"
              value={formData.name}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white" className="-mb-3">
              Phone Number
            </Typography>
            <Input
              size="lg"
              placeholder="xxxxxxxxxx"
              name="phone"
              className="text-white"
              value={formData.phone}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="leo@example.com"
              name="email"
              className="text-white"
              value={formData.email}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white" className="-mb-3">
              Event
            </Typography>
            <select
              name="eventId"
              value={formData.eventId}
              className="bg-transparent text-white h-10"
              onChange={handleChange}
            >
              <option className="text-black" value="" disabled>
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

            <Typography variant="h6" color="white" className="-mb-3">
              College name
            </Typography>
            <Input
              size="lg"
              name="college"
              className="text-white"
              placeholder="Saintgits College Of Engineering"
              value={formData.college}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white" className="-mb-3">
              Branch
            </Typography>
            <Input
              size="lg"
              name="branch"
              className="text-white"
              placeholder="CS"
              value={formData.branch}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white" className="-mb-3">
              Semester
            </Typography>
            <Input
              size="lg"
              placeholder="VI"
              className="text-white"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            />

            <Typography variant="h6" color="white" className="-mb-3">
              Team
            </Typography>
            <select
              id="team"
              name="team"
              className="bg-transparent text-white border-white h-10"
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
              <div className="flex flex-col gap-4">
                {teamMembers.map((member, index) => (
                  <Input
                    key={index}
                    size="lg"
                    placeholder={`Member ${index + 1}'s Name`}
                    value={member}
                    className="text-white"
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
                    onChange={handleMemberChange}
                  />
                )}
                <Button
                  size="sm"
                  color="blue-gray"
                  onClick={handleAddMember}
                  className="text-white h-10"
                >
                  Add Member
                </Button>
              </div>
            )}
          </div>
          <Button
            className="mt-4"
            onClick={() => {
              handleSignUp();
              handleAddMember();
              handleRegistration(); // Pass handleRegistration as a callback function
            }}
          >
            Sign Up
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SimpleRegistrationForm;