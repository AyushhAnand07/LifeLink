import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [donorForm, setDonorForm] = useState({
    bloodType: "O+",
    city: "",
    available: true,
  });
  const [donorMsg, setDonorMsg] = useState("");
  const [savingDonor, setSavingDonor] = useState(false);

  const [requestText, setRequestText] = useState("");
  const [requestResult, setRequestResult] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [searching, setSearching] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const submitDonorProfile = async (e) => {
    e.preventDefault();
    setDonorMsg("");
    setSavingDonor(true);
    try {
      await api.post("/donors", donorForm);
      setDonorMsg("✅ Profile saved! You're now visible to nearby requests.");
    } catch (err) {
      setDonorMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setSavingDonor(false);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    setRequestResult(null);
    setSearching(true);
    try {
      const res = await api.post("/requests", { text: requestText });
      const matchRes = await api.get(`/requests/${res.data._id}/matches`);
      setRequestResult(matchRes.data);
    } catch (err) {
      setRequestError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSearching(false);
    }
  };

  const urgencyClass = (urgency) => {
    if (urgency === "high") return "badge-urgency-high";
    if (urgency === "medium") return "badge-urgency-medium";
    return "badge-urgency-low";
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>🩸 LifeLink</h1>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>

      {role === "donor" && (
        <div className="dash-card">
          <h3>Your Donor Profile</h3>
          <p className="subtitle">
            Keep this updated so nearby requests can find you.
          </p>
          <form onSubmit={submitDonorProfile} className="form-group">
            <select
              value={donorForm.bloodType}
              onChange={(e) =>
                setDonorForm({ ...donorForm, bloodType: e.target.value })
              }
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
            <input
              placeholder="Your City"
              value={donorForm.city}
              onChange={(e) =>
                setDonorForm({ ...donorForm, city: e.target.value })
              }
              required
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={donorForm.available}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, available: e.target.checked })
                }
              />
              Available to donate right now
            </label>
            <button type="submit" className="btn-primary" disabled={savingDonor}>
              {savingDonor ? "Saving..." : "Save Profile"}
            </button>
          </form>
          {donorMsg && <p className="success-msg">{donorMsg}</p>}
        </div>
      )}

      {role === "requester" && (
        <div className="dash-card">
          <h3>Need Blood? Describe it in your own words</h3>
          <p className="subtitle">
            Our AI will figure out the blood type, city and urgency for you.
          </p>
          <form onSubmit={submitRequest} className="form-group">
            <textarea
              placeholder='e.g. "Need O negative blood urgently for my father in City Hospital, Dehradun"'
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              required
              rows={3}
            />
            <button type="submit" className="btn-primary" disabled={searching}>
              {searching ? "Searching..." : "Find Donors"}
            </button>
          </form>
          {requestError && <p className="error-text">{requestError}</p>}

          {requestResult && (
            <div className="result-box">
              <h4>AI understood your request as</h4>
              <div className="ai-summary">
                <span className="badge badge-blood">
                  {requestResult.request.bloodType}
                </span>
                <span className="badge badge-city">
                  📍 {requestResult.request.city}
                </span>
                <span
                  className={`badge ${urgencyClass(
                    requestResult.request.urgency
                  )}`}
                >
                  {requestResult.request.urgency} urgency
                </span>
              </div>

              <h4>Matching Donors ({requestResult.matches.length})</h4>
              {requestResult.matches.length === 0 && (
                <div className="empty-state">
                  No matching donors found yet in this city. Try again later.
                </div>
              )}
              {requestResult.matches.map((donor) => (
                <div key={donor._id} className="donor-card">
                  <div>
                    <div className="name-line">{donor.user?.name}</div>
                    <div className="contact-line">
                      {donor.city} · {donor.user?.email}
                    </div>
                  </div>
                  <div className="blood-chip">{donor.bloodType}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
