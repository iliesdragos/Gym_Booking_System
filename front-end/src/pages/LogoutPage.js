import React, { useState } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { useNavigate } from "react-router-dom"; // Importăm useNavigate pentru navigarea programatică
import { Modal, Button } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap

const LogoutPage = () => {
  const [show, setShow] = useState(true); // Starea pentru a controla vizibilitatea modalului
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică

  // Funcție pentru a închide modalul și a naviga înapoi în istoria browserului
  const handleClose = () => {
    setShow(false);
    navigate(-1); // Navighează înapoi în istoria browserului
  };

  // Funcție pentru a gestiona deconectarea utilizatorului
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/logout",
        {
          withCredentials: true,
        }
      );
      console.log("Logout response:", response.data);

      // Ștergem datele de autentificare din local storage
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      // Redirecționăm utilizatorul către pagina principală
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutPage; // Exportăm componenta LogoutPage
