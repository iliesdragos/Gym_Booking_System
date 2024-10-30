# Gym Booking System 🏋️‍♂️💻

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Selenium](https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white)](https://www.selenium.dev/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)

## Project Overview

The **Gym Booking System** is a web application designed to streamline gym access and manage employee reservations for fitness facilities within a company. It allows employees to book gym slots, helping prevent overcrowding and ensuring an organized, efficient reservation process.

## Description
The Gym Booking System provides a platform for employees to reserve gym slots in different locations based on their preferences. Users can view available gym centers, check time slots, and make reservations, while administrators can manage gyms, view reservations, and monitor the booking system.

## Features

- **User Registration and Login**: Employees register using their corporate email, ensuring secure access.
- **Real-time Booking System**: View available fitness locations, select a slot, and book a gym session.
- **Admin Dashboard**: Manage gym details, users, and booking schedules with ease.
- **Password Recovery via SendGrid**: Allows users to reset their password through an email link for added security.
- **Data Security**: Encrypted passwords and secure data handling.

## System Architecture

Below is the system architecture of the application:

![System Architecture](link-to-system-architecture-image)

The system follows a **client-server** model:
1. **Back-end**: Built using Node.js and Express for API handling and data management.
2. **Front-end**: Developed with React for a responsive and interactive user experience.
3. **Database**: MySQL, organized in a structured ERD, manages user, booking, time slots and gym data.

### Database Structure

The database includes the following tables:
- **Users**: Holds user data including roles (Admin/User).
- **Gyms**: Details for each gym location and its capacity.
- **TimeSlots**: Time slots available for booking.
- **Bookings**: Stores user reservations and associated gym slots.

Here is a visual representation of the Entity-Relationship Diagram (ERD):

![ERD](link-to-ERD-image)

## Technology Stack

- **Node.js** and **Express** for the backend server and API.
- **React** for a dynamic and responsive front-end experience.
- **MySQL** as the relational database.
- **Postman** for API testing.
- **Selenium** for automated UI testing.
- **SendGrid** for email-based password recovery.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iliesdragos/Gym_Booking_System.git
   cd Gym_Booking_System
   ```
   
2.  **Install Dependencies**:
   - Navigate to both `back-end` and `front-end` directories and run:
     ```bash
     npm install
     ```

3. **Database Setup**:
   - Ensure MySQL is running.
   - Import the provided SQL schema (located in the `back-end` folder) to create the necessary tables.

4. **Environment Variables**:
   - Add a `.env` file in the `back-end` directory with the following variables:
     ```makefile
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     SENDGRID_API_KEY=your_sendgrid_api_key
     ```

5. **Running the Application**:
   - Start the back-end server:
     ```bash
     cd back-end
     node app.js
     ```
   - Start the front-end development server:
     ```bash
     cd front-end
     npm start
     ```
