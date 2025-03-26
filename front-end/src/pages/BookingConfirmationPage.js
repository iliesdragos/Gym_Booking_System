import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Alert } from "react-bootstrap";
import moment from "moment";

function BookingConfirmationPage() {
  const { bookingId } = useParams(); // Extragem bookingId din URL
  const navigate = useNavigate(); // Folosim hook-ul useNavigate pentru navigarea programatică
  const [booking, setBooking] = useState({});
  const [error, setError] = useState("");

  // Folosim useEffect pentru a obține detaliile rezervării când componenta se montează
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/detailed/${bookingId}`);
        // Formatăm data și ora pentru afișare
        setBooking({
          ...response.data,
          date: new Date(response.data.date).toLocaleDateString("en-GB"),
          startTime: moment(response.data.startTime, "HH:mm:ss").format(
            "HH:mm"
          ),
          endTime: moment(response.data.endTime, "HH:mm:ss").format("HH:mm"),
        });
      } catch (err) {
        setError("Failed to fetch booking details.");
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Funcție pentru a confirma rezervarea
  const handleConfirm = async () => {
    try {
      // Actualizăm statusul rezervării la 'confirmed'
      await axios.put(`/api/bookings/${bookingId}`, { status: "confirmed" });
      alert("Booking confirmed successfully!");
      navigate("/gyms"); // Redirecționăm utilizatorul la pagina sălilor de fitness
    } catch (err) {
      setError("Failed to confirm booking.");
    }
  };

  // Funcție pentru a anula rezervarea
  const handleCancel = async () => {
    try {
      // Actualizăm statusul rezervării la 'cancelled'
      await axios.post(`/api/bookings/cancel/${bookingId}`);
      alert("Booking cancelled successfully!");
      navigate("/gyms"); // Redirecționăm utilizatorul la pagina sălilor de fitness
    } catch (err) {
      setError("Failed to cancel booking.");
    }
  };

  return (
    <Container className="booking-confirmation-container">
      <h1 className="booking-confirmation-title">Booking Confirmation</h1>
      {error && (
        <Alert variant="danger" className="booking-alert-message">
          {error}
        </Alert>
      )}
      <div className="booking-details">
        <p className="time-slot-date">
          <strong>Location:</strong> {booking.location}
        </p>
        <p className="time-slot-date">
          <strong>Date:</strong> {booking.date}
        </p>
        <p className="time-slot-interval">
          <strong>Time Interval:</strong> {booking.startTime} -{" "}
          {booking.endTime}
        </p>
      </div>
      <Button
        onClick={handleConfirm}
        className="booking-confirmation-button booking-confirm"
      >
        Confirm Booking
      </Button>
      <Button
        onClick={handleCancel}
        className="booking-confirmation-button booking-cancel"
      >
        Cancel Booking
      </Button>
    </Container>
  );
}

export default BookingConfirmationPage;
