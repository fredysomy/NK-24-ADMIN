import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";
import SelectionPage from "../pages/SelectionPage";
import AllParticipantDetails from "../pages/AllParticipants";

export function RouterPaths() {
  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      {/*<Route path="/onlinepage" element={<RegistrationQuery />} />
      <Route path="/" element={<SelectionPage />} />*/}
      <Route path="/allparticipants" element={<AllParticipantDetails />} />
    </Routes>
  );
}
