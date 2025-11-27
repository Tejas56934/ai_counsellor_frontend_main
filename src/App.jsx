import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar.jsx";
import ContactActions from "./components/ContactUs.jsx";
import AdmissionWizard from "./components/admissionWizard.jsx";

// Temporary Home component (replace with your real homepage)
function Home() {

}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ContactUs" element={<ContactActions />} />
            <Route path="/admission-wizard" element={<AdmissionWizard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
