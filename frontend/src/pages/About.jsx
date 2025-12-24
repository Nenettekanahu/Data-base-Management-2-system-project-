import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <h1>About Flynext</h1>
        <p>
          Flynext is a modern flight booking management system designed to
          simplify airline operations and enhance user experience.
        </p>
      </section>

      {/* CONTENT */}
      <section className="about-content">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a reliable, efficient, and user-friendly
            platform for managing flights, bookings, and payments in a single
            system.
          </p>
        </div>

        <div className="about-card">
          <h2>What We Offer</h2>
          <ul>
            <li>Flight scheduling and management</li>
            <li>Passenger booking system</li>
            <li>Secure payment tracking</li>
            <li>Role-based access (Admin, Crew, Passenger)</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Technology Stack</h2>
          <p>
            Flynext is built using modern web technologies including React for
            the frontend, PHP for the backend API, and MySQL for database
            management.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
