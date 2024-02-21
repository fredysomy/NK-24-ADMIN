import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationQuery from "../pages/OnlineReg";
import ParticipantDetails from "../pages/EventParticipants";
import SelectionPage from "../pages/SelectionPage";
import AllParticipantDetails from "../pages/EventsList";
import Login from "../pages/Login";
import EventList from "../pages/EventsList";
import ParticipantDetailsPage from "../pages/EventParticipantsPage";

export function RouterPaths() {
  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
     
      <Route path="/events/:eventId" element={<ParticipantDetailsPage/>} /> {/* Route for the participant details page */}
      <Route path="/events" element={<EventList/>} />
      {/*
      <Route path="/" element={<Login />} />
      <Route path="/onlinepage" element={<RegistrationQuery />} />
      
  <Route path="/selection" element={<SelectionPage />} />*/}
    </Routes>
  );
}
