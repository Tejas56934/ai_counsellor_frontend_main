import React, { useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import { locationData } from "./locationData";
import "./Sidebar.css";

export default function AdmissionWizard({ onSubmit, onCancel, initial = {} }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    country: initial.country || "",
    state: initial.state || "",
    city: initial.city || "",
    dob: initial.dob || "",
    fullName: initial.fullName || "",
    email: initial.email || "",
    mobile: initial.mobile || "",
    gender: initial.gender || "",
    address: initial.address || "",
  });

  const countries = Object.keys(locationData).map(c => ({ value: c, label: c }));
  const states =
    form.country && locationData[form.country]
      ? Object.keys(locationData[form.country]).map(s => ({ value: s, label: s }))
      : [];
  const cities =
    form.country && form.state
      ? locationData[form.country][form.state].map(city => ({ value: city, label: city }))
      : [];

  const update = (field, value) => {
    if (field === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (field === "country") {
      setForm(f => ({ ...f, country: value, state: "", city: "" }));
    } else if (field === "state") {
      setForm(f => ({ ...f, state: value, city: "" }));
    } else {
      setForm(f => ({ ...f, [field]: value }));
    }
  };

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = e => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!form.fullName.trim()) return setError("Full name is required");
    if (!emailRegex.test(form.email)) return setError("Email must be a valid Gmail address");
    if (!mobileRegex.test(form.mobile)) return setError("Mobile number must be exactly 10 digits");

    window.open("https://www.edupluscampus.com/", "_blank", "noopener,noreferrer");

    const formatted = { ...form, dob: form.dob ? dayjs(form.dob).format("YYYY-MM-DD") : "" };
    onSubmit(formatted);
  };

  return (
    <div className="wizard">
      {error && <p className="error-msg">{error}</p>}

      {step === 1 && (
        <div className="wizard-step">
          <h4>Location</h4>

          <label>Country</label>
          <Select
            options={countries}
            value={form.country ? { value: form.country, label: form.country } : null}
            onChange={opt => update("country", opt.value)}
            placeholder="Select Country"
          />

          <label>State</label>
          <Select
            options={states}
            value={form.state ? { value: form.state, label: form.state } : null}
            onChange={opt => update("state", opt.value)}
            placeholder="Select State"
            isDisabled={!form.country}
          />

          <label>City</label>
          <Select
            options={cities}
            value={form.city ? { value: form.city, label: form.city } : null}
            onChange={opt => update("city", opt.value)}
            placeholder="Select City"
            isDisabled={!form.state}
          />

          <div className="wizard-controls">
            <button onClick={next}>Next</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <h4>Date of Birth</h4>
          <input
            type="date"
            value={form.dob}
            onChange={e => update("dob", e.target.value)}
          />
          <div className="wizard-controls">
            <button onClick={prev}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="wizard-step" onSubmit={handleSubmit}>
          <h4>Personal Details</h4>
          <input placeholder="Full name" value={form.fullName} onChange={e => update('fullName', e.target.value)} />
          <input placeholder="Email (must be Gmail)" value={form.email} onChange={e => update('email', e.target.value)} />
          <input placeholder="Mobile (10 digits)" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
          <input placeholder="Gender" value={form.gender} onChange={e => update('gender', e.target.value)} />
          <input placeholder="Address" value={form.address} onChange={e => update('address', e.target.value)} />

          <div className="wizard-controls">
            <button type="button" onClick={prev}>Back</button>
            <button type="submit">Submit</button>
          </div>
        </form>

      )}
    </div>
  );
}
