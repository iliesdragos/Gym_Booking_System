import React, { useState } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { useNavigate, Link } from "react-router-dom"; // Importăm useNavigate și Link pentru navigarea programatică
import { Alert, Container } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap

function LoginPage() {
  const [email, setEmail] = useState(""); // Starea pentru email
  const [password, setPassword] = useState(""); // Starea pentru parolă
  const [errorMessage, setErrorMessage] = useState(""); // Starea pentru mesajele de eroare
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică

  // Funcția de login pentru a trimite cererea de autentificare la server
  const handleLogin = async (event) => {
    event.preventDefault(); // Previne comportamentul implicit al formularului
    setErrorMessage(""); // Resetează mesajele de eroare la fiecare încercare de autentificare
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);

      // 'userRole' și 'userId' sunt parte din răspunsul care indică rolul utilizatorului
      const userRole = response.data.user.role;
      const userId = response.data.user.id;

      // Salvăm rolul și ID-ul utilizatorului în localStorage
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userId", userId);

      // Redirecționăm utilizatorul pe baza rolului său
      if (userRole === 1) {
        navigate("/admin-dashboard"); // Dacă utilizatorul este administrator
      } else if (userRole === 2) {
        navigate("/gyms"); // Dacă utilizatorul este utilizator obișnuit
      }
    } catch (error) {
      // Gestionează erorile din cerere (de exemplu, utilizatorul nu există, parolă greșită)
      if (error.response && error.response.data) {
        // Serverul a răspuns cu un cod de status care indică o eroare
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Authentication error. Please try again.");
      }
    }
  };

  return (
    <div className="Auth-form-container">
      <Container className="Auth-form my-5">
        <div className="Auth-form-content">
          <h2 className="Auth-form-title">Login</h2>
          <div className="text-center">
            New here?{" "}
            <Link to="/signUp" className="link-primary">
              Register
            </Link>
          </div>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <form onSubmit={handleLogin}>
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
            <div className="form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control mt-1"
                id="password"
                name="password"
                placeholder="Enter password"
                value={password} // Setăm valoarea input-ului password din starea password
                onChange={(e) => setPassword(e.target.value)} // Actualizăm starea password la fiecare modificare
                required // Marcăm câmpul ca fiind obligatoriu
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              Forgot <a href="/forgot-password">password?</a>
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage; // Exportăm componenta LoginPage
