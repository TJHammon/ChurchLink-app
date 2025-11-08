import "./VolunteerEvents.css";

export default function VolunteerEvents() {
  return (
    <div className="volunteer-page">

      <h1>How to Get Involved</h1>
      <p style={{ marginTop: "10px", opacity: 0.9 }}>
        Fill out this form to get started.
      </p>

      {/* ✅ FORM — matches Login + Create Event EXACTLY */}
      <div className="form-wrapper">
  <form className="form-container">

    <input
      type="text"
      placeholder="Full Name"
      className="form-input"
      required
    />

    <input
      type="email"
      placeholder="Email Address"
      className="form-input"
      required
    />

    <input
      type="tel"
      placeholder="Phone Number"
      className="form-input"
    />

    <textarea
      placeholder="Tell us why you want to volunteer..."
      rows="5"
      className="form-input"
      style={{ height: "140px", resize: "vertical" }}
    ></textarea>

    <button type="button" className="form-button">
      Submit
    </button>

  </form>
</div>


    </div>
  );
}
