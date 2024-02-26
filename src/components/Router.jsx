import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RegistrationQuery from "../pages/AttendanceMarker";
import ParticipantDetails from "../pages/EventParticipantsFullDetails";
import SelectionPage from "../pages/SelectionPage";
import Login from "../pages/Login";
import EventList from "../pages/EventRegistrations";
import ParticipantDetailsPage from "../pages/EventRegDetails";
import ModificationPage from "../pages/ModificationPage";
import EventRegistrationForm from "../pages/SpotEventReg";
import EventUserSelection from "../pages/EventUserSelection";
import CampusAmbassador from "../pages/CampusAmbassador";
import PrivateRoutes from "./PrivateRoutes";

export function RouterPaths() {
  const location = useLocation();
  const { auth } = location.state || {};

  return (
    <Routes>
      <Route path="/eventparticipants" element={<ParticipantDetails />} />
      <Route path="/ca" element={<CampusAmbassador />} />
      <Route path="/events/:eventId" element={<ParticipantDetailsPage />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/login" element={<Login />} />

      {/* Include PrivateRoutes without a specific path */}
      <Route element={<PrivateRoutes />}>
        {auth && (
          <>
            <Route path="/onlinepage" element={<RegistrationQuery />} />
            <Route path="/selection" element={<SelectionPage />} />
            <Route path="/modifyreg" element={<ModificationPage />} />
            <Route path="/spoteventreg" element={<EventUserSelection />} />
            <Route path="/spotuserreg" element={<EventRegistrationForm />} />
            <Route path="/spotselection" element={<EventUserSelection />} />
          </>
        )}
      </Route>
    </Routes>
  );
}
