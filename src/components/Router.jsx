import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";
import SelectionPage from "../pages/SelectionPage";
import AllParticipantDetails from "../pages/AllParticipants";
import Login from "../pages/Login";

export function RouterPaths() {
  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      <Route path="/onlinepage" element={<RegistrationQuery />} />
      <Route path="/selection" element={<SelectionPage />} />
      <Route path="/alldetails" element={<AllParticipantDetails />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
