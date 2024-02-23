import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";
import SelectionPage from "../pages/SelectionPage";
import Login from "../pages/Login";
import EventList from "../pages/EventsList";
import ParticipantDetailsPage from "../pages/EventParticipantsPage";
import SpotReg from "../pages/SpotReg";
import CampusAmbData from "../pages/CampusAmbassador";
export function RouterPaths() {
  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      <Route
        path="/events/:eventId"
        element={<ParticipantDetailsPage />}
      />
      <Route path="/events" element={<EventList />} />
      <Route path="/ca" element={<CampusAmbData />} />
      <Route path="/selection" element={<SelectionPage />} />
      <Route path="/" element={<Login />} />
      {/*
      <Route path="/" element={<Login />} />
      <Route path="/onlinepage" element={<RegistrationQuery />} />
      <Route path="/selection" element={<SelectionPage />} />
      <Route path="/spot-registration" element={<SpotReg />} />
  */}

    </Routes>
  );
}
