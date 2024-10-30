import React, { useState } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { Container, Alert, Form } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import { useNavigate, Link } from "react-router-dom"; // Importăm useNavigate și Link pentru navigarea programatică

function SignUpPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  }); // Starea pentru datele utilizatorului
  const [error, setError] = useState(""); // Starea pentru gestionarea mesajelor de eroare
  const [success, setSuccess] = useState(false); // Starea pentru gestionarea succesului operațiunii
  const navigate = useNavigate(); // Hook pentru gestionarea navigării

  // Funcție pentru actualizarea stării utilizatorului la schimbarea inputurilor
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Funcție pentru trimiterea formularului de înregistrare
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne comportamentul implicit al formularului
    setError(""); // Resetează mesajul de eroare la fiecare încercare
    try {
      // Trimite cererea de înregistrare la server
      const response = await axios.post(
        "http://localhost:3001/api/users/register",
        user
      );
      console.log(response.data);
      setSuccess(true); // Actualizează starea pentru a reflecta succesul operațiunii
      setTimeout(() => navigate("/login"), 2000); // Redirecționează către pagina de login după 2 secunde
    } catch (error) {
      // Gestionează erorile din cerere
      if (error.response && error.response.data) {
        setError(error.response.data.message); // Setează mesajul de eroare primit de la server
      } else {
        setError("Eroare la înregistrare. Încearcă din nou."); // Setează un mesaj de eroare generic
      }
      setSuccess(false); // Asigură-te că starea de succes este falsă
    }
  };

  return (
    <div className="Auth-form-container">
      <Container className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Register</h3>
          <div className="text-center">
            Already registered?{" "}
            <Link to="/login" className="link-primary">
              Login
            </Link>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}{" "}
          {/* Afișează mesajul de eroare dacă există */}
          {success && (
            <Alert variant="success">
              Registration successful! You will be redirected to the login page.
            </Alert>
          )}{" "}
          {/* Afișează mesajul de succes dacă înregistrarea este reușită */}
          <Form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                id="name"
                name="name"
                required
                onChange={handleChange} // Actualizează starea la fiecare modificare
                placeholder="e.g Michael William"
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                id="email"
                name="email"
                required
                onChange={handleChange} // Actualizează starea la fiecare modificare
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                id="password"
                name="password"
                required
                onChange={handleChange} // Actualizează starea la fiecare modificare
                placeholder="Enter password"
              />
            </div>
            <div className="d-grip gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Sign up!
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default SignUpPage; // Exportăm componenta SignUpPage
