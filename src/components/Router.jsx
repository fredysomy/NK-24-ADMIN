import React from "react";
import { Routes, Route} from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";

export function RouterPaths() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationQuery/>} />
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
    </Routes>
  );
}