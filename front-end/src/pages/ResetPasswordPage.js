import React, { useState } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { useParams, useNavigate } from "react-router-dom"; // Importăm useParams și useNavigate pentru navigarea programatică
import { Alert, Container } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap

function ResetPasswordPage() {
  const { token } = useParams(); // Obținem token-ul din URL
  const [password, setPassword] = useState(""); // Starea pentru noua parolă
  const [confirmPassword, setConfirmPassword] = useState(""); // Starea pentru confirmarea parolei
  const [message, setMessage] = useState(""); // Starea pentru mesajele de succes
  const [error, setError] = useState(""); // Starea pentru mesajele de eroare
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică

  // Funcția pentru a trimite cererea de resetare a parolei la server
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne comportamentul implicit al formularului
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again."); // Afișăm mesaj de eroare dacă parolele nu se potrivesc
      return; // Încheiem execuția dacă parolele nu se potrivesc
    }
    setMessage(""); // Resetăm mesajele de succes anterioare
    setError(""); // Resetăm mesajele de eroare anterioare
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
      setMessage("Your password has been successfully changed."); // Afișăm mesaj de succes
      setTimeout(() => navigate("/login"), 3000); // Redirecționăm utilizatorul la pagina de login după 3 secunde
    } catch (error) {
      // Gestionează erorile din cerere (de exemplu, token expirat sau invalid)
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
                value={password} // Setăm valoarea input-ului password din starea password
                onChange={(e) => setPassword(e.target.value)} // Actualizăm starea password la fiecare modificare
                required // Marcăm câmpul ca fiind obligatoriu
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
                value={confirmPassword} // Setăm valoarea input-ului confirmPassword din starea confirmPassword
                onChange={(e) => setConfirmPassword(e.target.value)} // Actualizăm starea confirmPassword la fiecare modificare
                required // Marcăm câmpul ca fiind obligatoriu
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

export default ResetPasswordPage; // Exportăm componenta ResetPasswordPage
