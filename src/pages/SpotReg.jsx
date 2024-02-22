import React, { useState,useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function SimpleRegistrationForm() {
  const [formData, setFormData] = useState({
    attended: "true",
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
    teamMembers: [],
    branch: "",
    college: "",
    semester: "",
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddMember = () => {
    const newMemberName = formData.memberName;
    if (newMemberName.trim() !== "") {
      setFormData({
        ...formData,
        memberName: "",
        teamMembers: [...formData.teamMembers, newMemberName],
      });
    }
  };
  useEffect(() => {
    console.log("Captured form data:", formData);
  }, [formData]);

  const handleRegistration = async () => {
    const eventName = await getEventName(formData.eventId);
    try {
      // Update form data with the event name
      setFormData({
        ...formData,
        eventName: eventName,
      });
      console.log("Registration successful!");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
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
              value={formData.email}
              onChange={handleChange}
            />
            <Typography variant="h6" color="white" className="-mb-3">
              Event
            </Typography>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Event
              </option>
              <option value="NK-03">3×3 Football</option>
              <option value="NK-52">AI IMAGE GENERATOR</option>
              <option value="NK-74">ALL TERRAIN ROBO RACE</option>
              <option value="NK-80">AUTOSKETCH</option>
              <option value="NK-36">Animazing</option>
              <option value="NK-47">Artle</option>
              <option value="NK-49">BREAK THE QUERY</option>
              <option value="NK-75">Basketball 5x5(Female)</option>
              <option value="NK-25">Basketball 5x5(Male)</option>
              <option value="NK-59">Best Anchor</option>
              <option value="NK-65">Blockchain Workshop</option>
              <option value="NK-38">CSS CODE CHALLENGE</option>
              <option value="NK-68">CUT THE CLASH</option>
              <option value="NK-11">Cad Clash</option>
              <option value="NK-46">Call of Duty Mobile</option>
              <option value="NK-30">Canoe Workshop</option>
              <option value="NK-57">Chem hunt</option>
              <option value="NK-64">Chemcar</option>
              <option value="NK-21">Circuit Debugging</option>
              <option value="NK-31">CodeOptimizer</option>
              <option value="NK-18">Come let's,build</option>
              <option value="NK-10">County Cricket</option>
              <option value="NK-07">DOUBLE TROUBLE</option>
              <option value="NK-08">Dumb Charades</option>
              <option value="NK-43">Duo-Dance</option>
              <option value="NK-69">E-Soldero</option>
              <option value="NK-15">Efootball 2024 (PES) (Online )</option>
              <option value="NK-28">Fifa 24</option>
              <option value="NK-04">Film triffle</option>
              <option value="NK-42">
                Flavorcraft Ventures: Innovate, Create, Savour
              </option>
              <option value="NK-70">GOURMET BATTLE</option>
              <option value="NK-56">GROMATICI</option>
              <option value="NK-41">Grandmaster Gala</option>
              <option value="NK-61">INQUEST</option>
              <option value="NK-35">IPL Draft</option>
              <option value="NK-05">Infinity glam</option>
              <option value="NK-22">JAM(English)</option>
              <option value="NK-20">JAM(Malayalam)</option>
              <option value="NK-37">Kaptured"24</option>
              <option value="NK-72">Kickering</option>
              <option value="NK-24">Line Follower maze</option>
              <option value="NK-16">Make the cut</option>
              <option value="NK-77">Man Of Steel</option>
              <option value="NK-79">Mech Maniac</option>
              <option value="NK-48">Millet Marvels: A Green Revolution</option>
              <option value="NK-44">Mr. and Ms. Nakshathra</option>
              <option value="NK-12">Neo-Graffiti</option>
              <option value="NK-34">Nirvana Nation</option>
              <option value="NK-71">PCB Designing Workshop</option>
              <option value="NK-19">PIXELATE</option>
              <option value="NK-78">PUBG</option>
              <option value="NK-53">Panoramic</option>
              <option value="NK-32">Pencil Mania</option>
              <option value="NK-29">QUIZADRY</option>
              <option value="NK-13">QUIZZLE</option>
              <option value="NK-67">Quake the structure</option>
              <option value="NK-06">Quiztopia</option>
              <option value="NK-63">REELAGRAM</option>
              <option value="NK-14">REELISTIC DELIGHTS</option>
              <option value="NK-33">ROBOSOCCER</option>
              <option value="NK-27">Racquettes(Men)</option>
              <option value="NK-82">Racquettes(Women)</option>
              <option value="NK-23">SYNC STEP</option>
              <option value="NK-17">Scene de Crime</option>
              <option value="NK-66">Sneak Attack (volleyball)</option>
              <option value="NK-39">Soldering Competition</option>
              <option value="NK-81">Strike'em Down</option>
              <option value="NK-54">Strings Unplugged</option>
              <option value="NK-51">The Laughter Extravaganza</option>
              <option value="NK-26">Titan Actor</option>
              <option value="NK-40">Treasure Pursuit</option>
              <option value="NK-50">UPCYCLE FRENZY</option>
              <option value="NK-62">VR Gaming</option>
              <option value="NK-73">Valorant</option>
              <option value="NK-58">Voice of Nakshatra</option>
              <option value="NK-02">Watts up challenge</option>
              <option value="NK-60">Workshop on Drones</option>
              <option value="NK-55">Xperia - Arduino Coding</option>
            </select>

            <Typography variant="h6" color="white" className="-mb-3">
              College name
            </Typography>
            <Input
              size="lg"
              name="college"
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
              value={formData.team}
              onChange={handleChange}
            >
              <option value="null">Single</option>
              <option value="team">Team</option>
            </select>
            {formData.team.toLowerCase() === "group" && (
              <div className="flex flex-col gap-4">
                {formData.teamMembers.map((member, index) => (
                  <Input
                    key={index}
                    size="lg"
                    placeholder={`Member ${index + 1}'s Name`}
                    value={member}
                    //readOnly
                  />
                ))}
                <Input
                  size="lg"
                  placeholder="Add member's name"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                />
                <Button
                  size="sm"
                  color="blue-gray"
                  onClick={handleAddMember}
                  className="bg-blue-gray-500 hover:bg-blue-gray-600 rounded-md px-3 py-2.5 text-sm font-normal"
                >
                  Add Member
                </Button>
              </div>
            )}
          </div>
          <Button className="mt-4" fullWidth onClick={handleRegistration}>
            Sign Up
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SimpleRegistrationForm;