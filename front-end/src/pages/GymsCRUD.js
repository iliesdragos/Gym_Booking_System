import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { useNavigate } from "react-router-dom"; // Importăm useNavigate pentru navigarea programatică

function GymsCRUD() {
  const [gyms, setGyms] = useState([]); // Starea pentru sălile de fitness
  const [loading, setLoading] = useState(false); // Starea pentru încărcare
  const [showModal, setShowModal] = useState(false); // Starea pentru afișarea modalului
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică
  const [currentGym, setCurrentGym] = useState({
    id: "",
    location: "",
    capacity: "",
    description: "",
  }); // Starea pentru sala de fitness curentă

  // Folosim useEffect pentru a obține sălile de fitness când componenta se montează
  useEffect(() => {
    fetchGyms();
  }, []);

  // Funcție pentru a obține sălile de fitness din API
  const fetchGyms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/gyms");
      setGyms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      setLoading(false);
    }
  };

  // Funcție pentru a deschide modalul de adăugare/editare sală de fitness
  const openModal = (gym = {}) => {
    setCurrentGym(gym);
    setShowModal(true);
  };

  // Funcție pentru a închide modalul
  const closeModal = () => {
    setCurrentGym({
      id: "",
      location: "",
      capacity: "",
      description: "",
    });
    setShowModal(false);
  };

  // Funcție pentru a gestiona schimbările în formular
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentGym((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcție pentru a salva sala de fitness
  const handleSave = async () => {
    const gymToSave = { ...currentGym };

    if (currentGym.id) {
      // Actualizăm sala de fitness existentă
      try {
        await axios.put(`/api/gyms/${currentGym.id}`, gymToSave);
        await fetchGyms();
      } catch (error) {
        console.error("Error updating gym:", error);
      }
    } else {
      // Creăm o sală de fitness nouă
      try {
        await axios.post("/api/gyms", gymToSave);
        await fetchGyms();
      } catch (error) {
        console.error("Error creating gym:", error);
      }
    }
    closeModal();
  };

  // Funcție pentru a șterge o sală de fitness
  const handleDelete = async (gymId) => {
    try {
      await axios.delete(`/api/gyms/${gymId}`);
      await fetchGyms();
    } catch (error) {
      console.error("Error deleting gym:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Afișăm un mesaj de încărcare dacă datele sunt în curs de încărcare
  }

  return (
    <Container>
      <h2>Fitness Gyms Management</h2>
      <Button onClick={() => openModal()}>Add Fitness Gym</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gyms.map((gym) => (
            <tr key={gym.id}>
              <td>{gym.id}</td>
              <td>{gym.location}</td>
              <td>{gym.capacity}</td>
              <td>{gym.description}</td>
              <td>
                <Button onClick={() => openModal(gym)}>Edit</Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(gym.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal pentru adăugarea/editarea sălii de fitness */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentGym.id ? "Edit Fitness Gym" : "Add Fitness Gym"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={currentGym.location}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={currentGym.capacity}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentGym.description}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col className="d-flex">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/admin-dashboard")} // Navigăm înapoi la dashboard-ul adminului
            className="back-button"
          >
            Back to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GymsCRUD; // Exportăm componenta GymsCRUD
