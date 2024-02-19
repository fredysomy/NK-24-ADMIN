import React from "react";
import { Routes, Route} from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";
import SelectionPage from '../pages/SelectionPage';


export function RouterPaths() {
  return (
    <Routes>
      <Route path="/onlinepage" element={<RegistrationQuery/>} />
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      <Route path="/" element={<SelectionPage/>} />
    </Routes>
  );
}