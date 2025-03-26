import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function BookingsCRUD() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [currentBooking, setCurrentBooking] = useState({
    id: "",
    user_id: "",
    gym_id: "",
    timeslots_id: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "pending",
  });
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică

  // Folosim useEffect pentru a obține rezervările când componenta se montează
  useEffect(() => {
    fetchBookings();
  }, []);

  // Funcție pentru a obține rezervările din API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/bookings");
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  // Funcție pentru a deschide modalul de adăugare/editare rezervare
  const openModal = (booking = {}) => {
    // Asigurăm că datele și timpul sunt tratate corect
    const date = booking.date
      ? moment(booking.date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    const startTime = booking.startTime
      ? moment(booking.startTime, "HH:mm:ss").format("HH:mm")
      : "08:00";
    const endTime = booking.endTime
      ? moment(booking.endTime, "HH:mm:ss").format("HH:mm")
      : "09:00";
    setCurrentBooking(booking);
    setSelectedDate(moment(date, "YYYY-MM-DD").toDate());
    setStartTime(moment(date + " " + startTime, "YYYY-MM-DD HH:mm").toDate());
    setEndTime(moment(date + " " + endTime, "YYYY-MM-DD HH:mm").toDate());
    setShowModal(true);
  };

  // Funcție pentru a închide modalul
  const closeModal = () => {
    setShowModal(false);
    setCurrentBooking({});
    setErrorMessage("");
  };

  // Funcție pentru a gestiona schimbările în formular
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentBooking((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcție pentru a salva rezervarea
  const handleSave = async () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const formattedStartTime = moment(startTime).format("HH:mm:ss");
    const formattedEndTime = moment(endTime).format("HH:mm:ss");

    if (moment(startTime).isSameOrAfter(endTime)) {
      setErrorMessage("Start Time must be before End Time.");
      return;
    }

    const bookingToSave = {
      ...currentBooking,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      if (currentBooking.id) {
        await axios.put(`/api/bookings/${currentBooking.id}`, bookingToSave);
      } else {
        await axios.post("/api/bookings", bookingToSave);
      }
      await fetchBookings();
      closeModal();
    } catch (error) {
      console.error("Error saving booking:", error);
      setErrorMessage("Failed to save the booking.");
    }
  };

  // Funcție pentru a șterge o rezervare
  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      await fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Afișăm un mesaj de încărcare dacă datele sunt în curs de încărcare
  }

  return (
    <Container>
      <h2>Bookings Management</h2>
      <Button onClick={() => openModal()}>Add Booking</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Gym ID</th>
            <th>Timeslot ID</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.user_id}</td>
              <td>{booking.gym_id}</td>
              <td>{booking.timeslots_id}</td>
              <td>{moment(booking.date).format("YYYY-MM-DD")}</td>
              <td>{moment(booking.startTime, "HH:mm:ss").format("HH:mm")}</td>
              <td>{moment(booking.endTime, "HH:mm:ss").format("HH:mm")}</td>
              <td>{booking.status}</td>
              <td>
                <Button onClick={() => openModal(booking)}>Edit</Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(booking.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pentru adăugarea/editarea rezervării */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentBooking.id ? "Edit Booking" : "Add Booking"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <Form>
            <Form.Group>
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="user_id"
                value={currentBooking.user_id || ""}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gym ID</Form.Label>
              <Form.Control
                type="text"
                name="gym_id"
                value={currentBooking.gym_id || ""}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Slot ID</Form.Label>
              <Form.Control
                type="text"
                name="timeslots_id"
                value={currentBooking.timeslots_id || ""}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <DatePicker
                selected={startTime}
                onChange={(time) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                timeFormat="HH:mm"
                dateFormat="HH:mm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <DatePicker
                selected={endTime}
                onChange={(time) => setEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                timeFormat="HH:mm"
                dateFormat="HH:mm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentBooking.status || ""}
                onChange={handleFormChange}
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
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

export default BookingsCRUD;
