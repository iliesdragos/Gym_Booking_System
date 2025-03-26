import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică
  return (
    <Container className="dashboard-container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row>
        {/* Coloană pentru gestionarea rezervărilor */}
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Link to="/admin/bookings" className="w-100">
            <Button className="dashboard-button" variant="primary" size="lg">
              Bookings Management
            </Button>
          </Link>
        </Col>
        {/* Coloană pentru gestionarea sălilor de fitness */}
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Link to="/admin/gyms" className="w-100">
            <Button className="dashboard-button" variant="primary" size="lg">
              Fitness Gyms Management
            </Button>
          </Link>
        </Col>
        {/* Coloană pentru gestionarea intervalelor de timp */}
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Link to="/admin/timeslots" className="w-100">
            <Button className="dashboard-button" variant="primary" size="lg">
              Time Slots Management
            </Button>
          </Link>
        </Col>
        {/* Coloană pentru gestionarea utilizatorilor */}
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Link to="/admin/users" className="w-100">
            <Button className="dashboard-button" variant="primary" size="lg">
              Users Management
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/logout")} // Folosim navigate pentru a redirecționa utilizatorul la logout
            className="back-button"
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
