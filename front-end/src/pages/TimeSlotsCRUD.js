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
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function TimeSlotsCRUD() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [error, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [currentTimeSlot, setCurrentTimeSlot] = useState({
    id: "",
    gym_id: "",
    startTime: "",
    endTime: "",
    date: "",
    reservedCount: 0,
  });

  useEffect(() => {
    fetchTimeSlots(); // Obținem lista de intervale de timp la montarea componentei
  }, []);

  // Funcție pentru obținerea listei de intervale de timp
  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get("/api/timeslots");
      setTimeSlots(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setLoading(false);
    }
  };

  // Funcție pentru deschiderea modalului
  const openModal = (timeSlot = {}) => {
    const date = timeSlot.date
      ? moment(timeSlot.date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    const startTime = timeSlot.startTime
      ? moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")
      : "08:00";
    const endTime = timeSlot.endTime
      ? moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")
      : "09:00";
    const reservedCount = timeSlot.id ? timeSlot.reservedCount : 0;
    setCurrentTimeSlot({ ...timeSlot, reservedCount });
    setSelectedDate(moment(date, "YYYY-MM-DD").toDate());
    setStartTime(moment(date + " " + startTime, "YYYY-MM-DD HH:mm").toDate());
    setEndTime(moment(date + " " + endTime, "YYYY-MM-DD HH:mm").toDate());
    setShowModal(true);
  };

  // Funcție pentru închiderea modalului
  const closeModal = () => {
    setShowModal(false);
    setCurrentTimeSlot({});
    setErrorMessage("");
  };

  // Funcție pentru actualizarea stării la schimbarea inputurilor
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentTimeSlot((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funcție pentru salvarea intervalului de timp
  const handleSave = async () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const formattedStartTime = moment(startTime).format("HH:mm:ss");
    const formattedEndTime = moment(endTime).format("HH:mm:ss");

    if (moment(startTime).isSameOrAfter(endTime)) {
      setErrorMessage("Start Time must be before End Time.");
      return;
    }

    const timeSlotToSave = {
      ...currentTimeSlot,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      if (currentTimeSlot.id) {
        await axios.put(`/api/timeslots/${currentTimeSlot.id}`, timeSlotToSave);
      } else {
        await axios.post("/api/timeslots", timeSlotToSave);
      }
      await fetchTimeSlots();
      closeModal();
    } catch (error) {
      console.error("Error saving timeSlot:", error);
      setErrorMessage("Failed to save the timeSlot.");
    }
  };

  // Funcție pentru ștergerea intervalului de timp
  const handleDelete = async (timeSlotId) => {
    try {
      await axios.delete(`/api/timeslots/${timeSlotId}`);
      await fetchTimeSlots();
    } catch (error) {
      console.error("Error deleting timeSLot:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h2>Time Slots Management</h2>
      <Button onClick={() => openModal()}>Add Time Slot</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Gym ID</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Date</th>
            <th>Reserved Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot.id}>
              <td>{timeSlot.id}</td>
              <td>{timeSlot.gym_id}</td>
              <td>{moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")}</td>
              <td>{moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")}</td>
              <td>{moment(timeSlot.date).format("YYYY-MM-DD")}</td>
              <td>{timeSlot.reservedCount}</td>
              <td>
                <Button onClick={() => openModal(timeSlot)}>Edit</Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(timeSlot.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Time Slot */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTimeSlot.id ? "Edit Time Slot" : "Add Time Slot"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Gym ID</Form.Label>
              <Form.Control
                type="text"
                name="gym_id"
                value={currentTimeSlot.gym_id}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reserved Count</Form.Label>
              <Form.Control
                type="number"
                name="reservedCount"
                value={currentTimeSlot.reservedCount}
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

export default TimeSlotsCRUD;
