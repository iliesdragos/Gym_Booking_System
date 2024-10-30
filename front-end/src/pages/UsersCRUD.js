import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import axios from "axios"; // Importăm axios pentru a face cereri HTTP
import { useNavigate } from "react-router-dom"; // Importăm useNavigate pentru navigarea programatică

function UsersCRUD() {
  const [users, setUsers] = useState([]); // Starea pentru lista de utilizatori
  const [loading, setLoading] = useState(false); // Starea pentru indicatorul de încărcare
  const [showModal, setShowModal] = useState(false); // Starea pentru afișarea modalului
  const navigate = useNavigate(); // Hook pentru gestionarea navigării
  const [currentUser, setCurrentUser] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
    role: "",
  }); // Starea pentru utilizatorul curent (pentru adăugare/editare)

  useEffect(() => {
    fetchUsers(); // Preluăm lista de utilizatori la montarea componentei
  }, []);

  // Funcția pentru a prelua lista de utilizatori de la API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/listAllUsers");
      setUsers(response.data); // Setăm lista de utilizatori
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  // Funcția pentru a deschide modalul pentru adăugare/editare utilizator
  const openModal = (user = {}) => {
    user.password = ""; // Resetăm câmpul de parolă din motive de securitate
    setCurrentUser(user);
    setShowModal(true);
  };

  // Funcția pentru a închide modalul
  const closeModal = () => {
    setCurrentUser({
      id: "",
      email: "",
      name: "",
      password: "",
      role: "",
    });
    setShowModal(false);
  };

  // Funcția pentru a gestiona modificările din formular
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcția pentru a salva utilizatorul (adăugare/editare)
  const handleSave = async () => {
    const userToSave = { ...currentUser };

    if (currentUser.id) {
      // Actualizăm utilizatorul existent
      try {
        await axios.put(`/api/users/update/${currentUser.id}`, userToSave);
        await fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Adăugăm un utilizator nou
      try {
        await axios.post("/api/users/register", userToSave);
        await fetchUsers();
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
    closeModal();
  };

  // Funcția pentru a șterge un utilizator
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Afișăm un mesaj de încărcare dacă datele sunt în curs de preluare
  }

  return (
    <Container>
      <h2>Users Management</h2>
      <Button onClick={() => openModal()}>Add User</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>......</td> {/* Ascundem parola pentru securitate */}
              <td>{user.role}</td>
              <td>
                <Button onClick={() => openModal(user)}>Edit</Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pentru adăugare/editare utilizator */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email || ""}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser.name || ""}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentUser.password || ""}
                onChange={handleFormChange}
                placeholder="Leave blank if you do not wish to change the password."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={currentUser.role || ""}
                onChange={handleFormChange}
              >
                <option value="1">Admin</option>
                <option value="2">User</option>
              </Form.Control>
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
            onClick={() => navigate("/admin-dashboard")}
            className="back-button"
          >
            Back to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default UsersCRUD; // Exportăm componenta UsersCRUD
