import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Funcția pentru a trimite cererea de resetare a parolei la server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    setMessage("");
    setError("");
    try {
      // Trimitem cererea de resetare a parolei la server
      const response = await axios.post(
        "http://localhost:3001/api/users/reset-password",
        {
          token, // Token-ul pentru resetarea parolei
          password, // Noua parolă
        }
      );
      console.log(response.data);
      setMessage("Your password has been successfully changed.");
      setTimeout(() => navigate("/login"), 3000); // Redirecționăm utilizatorul la pagina de login după 3 secunde
    } catch (error) {
      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "An error occurred, please try again."
        );
      } else {
        setError("An error occurred, please try again.");
      }
    }
  };

  return (
    <div className="Auth-form-container">
      <Container className="Auth-form my-5">
        <div className="Auth-form-content">
          <h2 className="Auth-form-title">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}{" "}
          {/* Afișăm mesajul de eroare dacă există */}
          {message && <Alert variant="success">{message}</Alert>}{" "}
          {/* Afișăm mesajul de succes dacă există */}
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                className="form-control mt-1"
                id="password"
                name="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                className="form-control mt-1"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default ResetPasswordPage;
