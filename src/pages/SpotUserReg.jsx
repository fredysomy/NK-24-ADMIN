import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistration = async () => {
    const ids = doc(collection(db, "users2test")).id;
    try {
      setFormData({
        ...formData,
        CACode: ids,
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
    try {
      const ids = doc(collection(db, "users2test")).id;
      const NKID = `NK-${ids.substring(0, 5).toUpperCase()}`;

      await addDoc(collection(db, "users2test"), {
        CACode: ids,
        NKID: NKID,
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
      alert("NKID is : " + NKID);
      navigate("/spoteventreg", { state: { auth: true } });
    } catch (error) {
      console.error("Error registering user:", error.message);
      console.error("Firestore error details:", error);
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
          </div>
          <Button
            className="mt-4"
            onClick={() => {
              handleRegistration();
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
