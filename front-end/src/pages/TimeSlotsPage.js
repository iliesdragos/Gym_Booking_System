import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importăm useParams și useNavigate pentru navigarea programatică
import { Container, Row, Col, Card, Button } from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import { FaCalendarCheck } from "react-icons/fa"; // Importăm o pictogramă specifică din react-icons
import DatePicker from "react-datepicker"; // Importăm componenta DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Importăm stilurile pentru DatePicker
import moment from "moment"; // Importăm moment pentru manipularea datei și orei
import axios from "axios"; // Importăm axios pentru a face cereri HTTP

const API_URL = "http://localhost:3001/api/timeslots"; // URL-ul API-ului pentru intervalele orare

// Funcție pentru a prelua intervalele orare disponibile de la API
export const fetchAvailableTimeSlots = async (gymId, date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // Transformă data în formatul yyyy-mm-dd
    const response = await axios.get(
      `${API_URL}/available/${gymId}?date=${formattedDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Eroare la preluarea intervalelor orare disponibile:", error);
    throw error; // Propagăm eroarea pentru a putea fi tratată în altă parte
  }
};

function TimeSlotsPage() {
  const { gymId } = useParams(); // Obținem gymId din parametrii URL-ului
  const [timeSlots, setTimeSlots] = useState([]); // Starea pentru lista de intervale de timp
  const [selectedDate, setSelectedDate] = useState(new Date()); // Starea pentru data selectată
  const navigate = useNavigate(); // Hook pentru gestionarea navigării

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await fetchAvailableTimeSlots(gymId, selectedDate);
        setTimeSlots(slots);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSlots(); // Obținem lista de intervale de timp la schimbarea gymId sau selectedDate
  }, [gymId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Actualizăm data selectată
  };

  const handleBooking = async (timeSlotId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to make a booking");
        return;
      }

      const bookingData = {
        user_id: userId,
        timeslots_id: timeSlotId,
        status: "pending",
      };
      const response = await axios.post("/api/bookings", bookingData);

      if (response.status === 201) {
        alert("Booking made successfully!");
        navigate(`/booking-confirmation/${response.data.booking.id}`);
      } else {
        alert("Booking failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Error making booking:", error);
      if (error.response) {
        alert("Failed to make booking: " + error.response.data.message);
      } else {
        alert("An error occurred while making the booking.");
      }
    }
  };

  const handleBack = () => {
    navigate("/gyms"); // Navigăm înapoi la pagina sălilor de fitness
  };

  return (
    <Container className="timeslots-container">
      <Button
        variant="secondary"
        onClick={handleBack}
        className="time-slot-back-button"
      >
        Back to Gyms
      </Button>
      <h1 className="timeslots-header">Available Time Slots</h1>
      <div className="datepicker-container">
        <DatePicker
          className="datepicker-custom"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd-MM-yyyy"
        />
      </div>
      <Row className="time-slots-row">
        {timeSlots.length > 0 ? (
          timeSlots.map((timeSlot) => (
            <Col key={timeSlot.id} md={4}>
              <Card className="time-slot-card">
                <Card.Body>
                  <FaCalendarCheck className="time-slot-icon" />
                  <Card.Title className="time-slot-title">
                    Interval:{" "}
                    {moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")} -
                    {moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")}
                  </Card.Title>
                  <Card.Text className="time-slot-date">
                    Date: {moment(timeSlot.date).format("DD/MM/YYYY")}
                  </Card.Text>
                  <Button
                    className="time-slot-button"
                    onClick={() => handleBooking(timeSlot.id)}
                  >
                    Book now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="no-slots-message">
            No available time slots for this date.
          </p>
        )}
      </Row>
    </Container>
  );
}

export default TimeSlotsPage; // Exportăm componenta TimeSlotsPage
