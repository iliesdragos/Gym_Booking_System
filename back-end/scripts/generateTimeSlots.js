const pool = require("../lib/database");

// Funcție pentru generarea intervalelor de timp pentru toate sălile de sport
async function generateTimeSlotsForAllGyms() {
  try {
    // Obține toate sălile de sport din baza de date
    const sqlGetGyms = "SELECT * FROM gyms";
    const [gyms] = await pool.execute(sqlGetGyms);

    // Iterează pentru următoarele 3 luni
    for (let monthOffset = 1; monthOffset <= 3; monthOffset++) {
      const targetMonth = new Date();
      targetMonth.setMonth(targetMonth.getMonth() + monthOffset);
      targetMonth.setDate(1); // Setează la prima zi a lunii țintă
      const lastDayOfTargetMonth = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0
      ); // Ultima zi a lunii țintă

      // Funcție pentru formatarea datei în format MySQL
      const formatDateForMySQL = (date) => {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString().split("T")[0];
      };

      // Verifică dacă intervalele de timp au fost deja generate pentru această lună și sală de sport
      const dateStringStart = formatDateForMySQL(
        new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
      );
      const dateStringEnd = formatDateForMySQL(lastDayOfTargetMonth);
      const sqlCheckExistingTimeSlots =
        "SELECT COUNT(*) AS count FROM timeslots WHERE date BETWEEN ? AND ?";
      const [existingTimeSlots] = await pool.execute(
        sqlCheckExistingTimeSlots,
        [dateStringStart, dateStringEnd]
      );

      if (existingTimeSlots[0].count > 0) {
        console.log(
          `Timeslots for month starting ${dateStringStart} already generated.`
        );
        continue; // Sare peste această lună dacă intervalele de timp au fost deja generate
      }

      // Generează intervale de timp pentru fiecare sală de sport
      for (let gym of gyms) {
        for (
          let day = targetMonth.getDate();
          day <= lastDayOfTargetMonth.getDate();
          day++
        ) {
          for (let hour = 8; hour < 22; hour++) {
            const startTime = `${hour}:00:00`;
            const endTime = `${hour + 1}:00:00`;
            const date = new Date(
              targetMonth.getFullYear(),
              targetMonth.getMonth(),
              day
            );
            const dateString = formatDateForMySQL(date);

            // Inserează intervalele de timp în baza de date
            const sqlInsertTimeSlot =
              "INSERT INTO timeslots (gym_id, startTime, endTime, date, reservedCount) VALUES (?, ?, ?, ?, 0)";
            await pool.execute(sqlInsertTimeSlot, [
              gym.id,
              startTime,
              endTime,
              dateString,
            ]);
          }
        }
      }
    }
    console.log("Timeslots generated for the next 3 months.");
  } catch (error) {
    console.error("Error generating timeslots:", error.message);
  } finally {
    // Închide conexiunea la baza de date
    await pool.end();
  }
}

// Apelează funcția pentru a genera intervalele de timp
generateTimeSlotsForAllGyms();
