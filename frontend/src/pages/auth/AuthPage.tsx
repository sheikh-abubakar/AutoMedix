import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className={`flip-card-container ${showSignup ? "flipped" : ""}`}>
        <div className="flip-card">
          <div className="flip-card-front">
            <Login onSignupClick={() => setShowSignup(true)} />
          </div>
          <div className="flip-card-back">
            <Signup onLoginClick={() => setShowSignup(false)} />
          </div>
        </div>
      </div>
      <style>
        {`
          .flip-card-container {
            perspective: 1200px;
            width: 700px;
            height: 650px;
          }
          .flip-card {
            width: 100%;
            height: 100%;
            position: relative;
            transition: transform 0.7s cubic-bezier(.68,-0.55,.27,1.55);
            transform-style: preserve-3d;
          }
          .flip-card-container.flipped .flip-card {
            transform: rotateY(180deg);
          }
          .flip-card-front,
          .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0; left: 0;
            backface-visibility: hidden;
          }
          .flip-card-front {
            pointer-events: auto;
          }
          .flip-card-back {
            transform: rotateY(180deg);
            pointer-events: none;
          }
          .flip-card-container.flipped .flip-card-front {
            pointer-events: none;
          }
          .flip-card-container.flipped .flip-card-back {
            pointer-events: auto;
          }
        `}
      </style>
    </div>
  );
}