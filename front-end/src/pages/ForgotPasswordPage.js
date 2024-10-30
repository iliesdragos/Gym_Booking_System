import React, { useState } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { Alert, Container } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap

function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); // Starea pentru email
  const [message, setMessage] = useState(""); // Starea pentru mesajele de succes
  const [error, setError] = useState(""); // Starea pentru mesajele de eroare

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
      setMessage("An email to reset your password has been sent."); // Setăm mesajul de succes
    } catch (error) {
      setError("An error occurred, please try again."); // Setăm mesajul de eroare
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
                value={email} // Setăm valoarea input-ului email din starea email
                onChange={(e) => setEmail(e.target.value)} // Actualizăm starea email la fiecare modificare
                required // Marcăm câmpul ca fiind obligatoriu
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

export default ForgotPasswordPage; // Exportăm componenta ForgotPasswordPage
