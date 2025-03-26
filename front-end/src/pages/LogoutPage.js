import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const LogoutPage = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  // Funcție pentru a închide modalul și a naviga înapoi în istoria browserului
  const handleClose = () => {
    setShow(false);
    navigate(-1);
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

      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

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

export default LogoutPage;
