import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationQuery from "../pages/AttendanceMarker";
import ParticipantDetails from "../pages/EventParticipantsFullDetails";
import SelectionPage from "../pages/SelectionPage";
import Login from "../pages/Login";
import EventList from "../pages/EventRegistrations";
import ParticipantDetailsPage from "../pages/EventRegDetails";
import SpotReg from "../pages/SpotUserReg";
import ModificationPage from "../pages/ModificationPage";
import EventRegistrationForm from "../pages/SpotEventReg";
export function RouterPaths() {
  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      <Route
        path="/events/:eventId"
        element={<ParticipantDetailsPage />}
      />
      <Route path="/events" element={<EventList />} />
      <Route path="/" element={<Login />} />
      <Route path="/onlinepage" element={<RegistrationQuery />} />
      <Route path="/selection" element={<SelectionPage />} />
      <Route path="/spotuserreg" element={<SpotReg />} />
      <Route path="/spoteventreg" element={<EventRegistrationForm />} />
      <Route path="/modifyreg" element={<ModificationPage />} />
    </Routes>
  );
}
