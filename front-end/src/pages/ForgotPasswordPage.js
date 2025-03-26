import React, { useState } from "react";
import axios from "axios";
import { Alert, Container } from "react-bootstrap";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Funcția de submit pentru trimiterea cererii de resetare a parolei
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii la submit
    setMessage(""); // Resetăm mesajul de succes
    setError(""); // Resetăm mesajul de eroare
    try {
      // Facem o cerere POST către API pentru resetarea parolei
      await axios.post("http://localhost:3001/api/users/forgot-password", {
        email,
      });
      setMessage("An email to reset your password has been sent.");
    } catch (error) {
      setError("An error occurred, please try again.");
    }
  };

  return (
    <div className="Auth-form-container">
      <Container className="Auth-form my-5">
        <div className="auth-form-content">
          <h2 className="Auth-form-title">Forgot Password</h2>
          <div className="text-center">
            Enter your email address and we will send you a link to reset your
            password.
          </div>
          {error && <Alert variant="danger">{error}</Alert>}{" "}
          {/* Afișăm mesajul de eroare dacă există */}
          {message && <Alert variant="success">{message}</Alert>}{" "}
          {/* Afișăm mesajul de succes dacă există */}
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                id="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Send Reset Email
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPasswordPage;
