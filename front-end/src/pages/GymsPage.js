import React, { useState, useEffect } from "react";
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  Form,
} from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import { useNavigate } from "react-router-dom"; // Importăm useNavigate pentru navigarea programatică

const API_URL = "http://localhost:3001/api/gyms"; // Definim URL-ul API-ului pentru sălile de fitness

// Funcție pentru a obține sălile de fitness din API
const fetchGyms = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Eroare la preluarea sălilor de fitness:", error);
    throw error; // Propagăm eroarea pentru a putea fi tratată în altă parte
  }
};

function GymsPage() {
  const [gyms, setGyms] = useState([]); // Starea pentru sălile de fitness
  const [showProfileModal, setShowProfileModal] = useState(false); // Starea pentru afișarea modalului de profil
  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    newPassword: "",
  }); // Starea pentru datele profilului
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică
  const [nextBooking, setNextBooking] = useState(null); // Starea pentru următoarea rezervare
  const [showNoBookingModal, setShowNoBookingModal] = useState(false); // Starea pentru afișarea modalului de rezervare inexistentă
  const userId = localStorage.getItem("userId"); // Obținem ID-ul utilizatorului din localStorage

  // Funcție pentru formatarea datei
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Folosim useEffect pentru a obține sălile de fitness când componenta se montează
  useEffect(() => {
    const getGyms = async () => {
      try {
        const data = await fetchGyms();
        setGyms(data);
      } catch (error) {
        console.log(error);
      }
    };
    getGyms();
  }, []);

  // Funcție pentru a gestiona selectarea unei săli de fitness
  const handleGymSelect = (gymId) => {
    navigate(`/gyms/${gymId}/timeslots`);
  };

  // Funcție pentru a obține datele profilului utilizatorului
  const fetchProfileData = async () => {
    try {
      const response = await axios.get("/api/users/profile", {
        withCredentials: true,
      });
      setProfileData(response.data);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

  // Funcție pentru a actualiza datele profilului utilizatorului
  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/users/updatedProfile",
        profileData,
        { withCredentials: true }
      );
      alert(response.data.message);
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  // Funcție pentru a gestiona deconectarea utilizatorului
  const handleLogout = () => {
    navigate("/logout");
  };

  // Funcție pentru a gestiona click-ul pe "My Bookings"
  const handleMyBookingsClick = async () => {
    try {
      const response = await axios.get(`/api/users/nextBooking/${userId}`, {
        withCredentials: true,
      });
      if (response.data) {
        setNextBooking(response.data);
        setShowNoBookingModal(false);
      } else {
        setShowNoBookingModal(true);
      }
    } catch (error) {
      console.error("Error fetching next booking", error);
      setShowNoBookingModal(true);
    }
  };

  // Funcție pentru a anula rezervarea
  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(
        `/api/bookings/cancel/${bookingId}`,
        {},
        { withCredentials: true }
      );
      alert("Booking successfully cancelled!");
      setNextBooking(null); // Resetăm starea pentru următoarea rezervare
    } catch (error) {
      console.error("Error cancelling booking", error);
    }
  };

  return (
    <>
      <div className="container-background">
        <Container>
          <div className="profile-icon-container">
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                Profile
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={fetchProfileData}>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handleMyBookingsClick}>
                  My Bookings
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="gyms-list">
            <Row xs={1} md={2} lg={3} className="g-4">
              {gyms.map((gym) => (
                <Col key={gym.id}>
                  <Card className="gym-card h-100">
                    <Card.Img
                      variant="top"
                      src={`/gym-${gym.id}.jpg`}
                      alt={`Sala de fitness ${gym.id}`}
                    />
                    <Card.Body>
                      <Card.Text>Location: {gym.location}</Card.Text>
                      <Card.Text>Capacity: {gym.capacity}</Card.Text>
                      <Card.Text>Description: {gym.description}</Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleGymSelect(gym.id)}
                      >
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>

      {/* Modal pentru profilul utilizatorului */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profilePassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New password"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    newPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal pentru afișarea și anularea următoarei rezervări */}
      {nextBooking && (
        <Modal show={Boolean(nextBooking)} onHide={() => setNextBooking(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Next Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Location: {nextBooking.location}</p>
            <p>Date: {formatDate(nextBooking.date)}</p>
            <p>Start Time: {nextBooking.startTime}</p>
            <p>End Time: {nextBooking.endTime}</p>
            <Button
              variant="danger"
              onClick={() => handleCancelBooking(nextBooking.id)}
            >
              Cancel Booking
            </Button>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal pentru când nu există rezervări viitoare */}
      <Modal
        show={showNoBookingModal}
        onHide={() => setShowNoBookingModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>No Future Bookings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You currently have no future bookings.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowNoBookingModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GymsPage; // Exportăm componenta GymsPage
