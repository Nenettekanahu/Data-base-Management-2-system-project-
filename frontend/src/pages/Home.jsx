import React from 'react';
import './Home.css';
import jetImage from '../assets/private-jet.jpg';

function Home() { 
  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT */}
        <div className="hero-left">
          <span className="hero-tag">Flynext</span>

          <h1>
            Book a private jet <br /> instantly
          </h1>

          <p>
            Curly Airline proudly raises the bar and exceeds the standard for
            luxury and corporate private jet charter services. We pride ourselves
            on offering a professional service.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Make Your Trip</button>
            <button className="secondary-btn">Request Quote →</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <img src={jetImage} alt="Private Jet" />
        </div>
      </div>
    </section>
  );
}

export default Home;
