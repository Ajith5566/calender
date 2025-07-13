import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import patients from '../data/patients.json';
import doctors from '../data/doctors.json';
import './calender.css';

const Calender = () => {
    // State to hold currently selected date
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Load appointments from localStorage initially
    const [appointments, setAppointments] = useState(() => {
        const stored = localStorage.getItem('appointments');
        return stored ? JSON.parse(stored) : [];
    });

    const [showForm, setShowForm] = useState(false);         // Show/hide appointment form
    const [editIndex, setEditIndex] = useState(null);        // If editing, index of appointment
    const [darkMode, setDarkMode] = useState(false);         // Toggle dark/light mode

    // New appointment data (default values)
    const [newAppointment, setNewAppointment] = useState({
        patient: patients[0],
        doctor: doctors[0],
        time: '09:00'
    });

    const isMobile = window.innerWidth < 768;

    // Save appointments to localStorage on any change
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    // Apply body class based on dark/light mode
    useEffect(() => {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');
    }, [darkMode]);

    // Filter appointments for a specific day
    const getAppointmentsForDay = (date) =>
        appointments.filter((a) => a.date === date.toDateString());

    // When a calendar date is clicked
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setNewAppointment({ patient: patients[0], doctor: doctors[0], time: '09:00' });
        setEditIndex(null);
        setShowForm(true);
    };

    // Save or update an appointment
    const saveAppointment = () => {
        const updated = [...appointments];
        const appointmentData = { ...newAppointment, date: selectedDate.toDateString() };

        if (editIndex !== null) {
            updated[editIndex] = appointmentData;
        } else {
            updated.push(appointmentData);
        }

        setAppointments(updated);
        setShowForm(false);
        setEditIndex(null);
    };

    // Edit existing appointment
    const editAppointment = (index, data) => {
        setSelectedDate(new Date(data.date));
        setNewAppointment({ patient: data.patient, doctor: data.doctor, time: data.time });
        setEditIndex(index);
        setShowForm(true);
    };

    // Delete appointment
    const deleteAppointment = (index) => {
        const updated = [...appointments];
        updated.splice(index, 1);
        setAppointments(updated);
    };

    return (
        <div className={`calendar-wrapper ${darkMode ? 'dark' : 'light'}`}>
            {/* Dark mode toggle button */}
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            <h2 className="text-center mb-4">Clinic Appointment Calendar</h2>

            {/* Mobile day view */}
            {isMobile ? (
                <>
                    <input
                        type="date"
                        className="form-control mb-3"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                    <div className="day-view shadow-sm rounded p-3">
                        <h5>{selectedDate.toDateString()}</h5>

                        {/* List appointments for selected day */}
                        {getAppointmentsForDay(selectedDate).map((a, i) => {
                            const globalIndex = appointments.findIndex(
                                (appt) =>
                                    appt.date === a.date &&
                                    appt.time === a.time &&
                                    appt.patient === a.patient &&
                                    appt.doctor === a.doctor
                            );
                            return (
                                <div key={i} className="appointment-card">
                                    <div>🕒 {a.time} — 👤 {a.patient}</div>
                                    <div>
                                        <button className="cancel-btn me-2" onClick={() => editAppointment(globalIndex, a)}>✏️</button>
                                        <button className="cancel-btn" onClick={() => deleteAppointment(globalIndex)}>❌</button>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-success mt-3 w-100"
                            onClick={() => handleDateChange(selectedDate)}
                        >
                            ➕ Add Appointment
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Desktop month calendar view */}
                    <Calendar
                        value={selectedDate}
                        onClickDay={handleDateChange}
                        tileContent={({ date }) => {
                            const appts = getAppointmentsForDay(date);
                            return appts.map((a, i) => (
                                <div key={i} className="calendar-appointment">
                                    {a.time} - {a.patient}
                                </div>
                            ));
                        }}
                    />
                    <button
                        className="btn btn-outline-primary mt-3"
                        onClick={() => handleDateChange(selectedDate)}
                    >
                        ➕ Add Appointment
                    </button>
                </>
            )}

            {/* Appointment form modal */}
            {showForm && (
                <div className="modal">
                    <form className="appointment-form" onSubmit={(e) => {
                        e.preventDefault();
                        saveAppointment();
                    }}>
                        <h4 className="text-center mb-3">
                            {editIndex !== null ? '✏️ Edit' : '📅 New'} Appointment
                        </h4>
                        <p className="text-muted text-center">{selectedDate.toDateString()}</p>

                        {/* Patient selector */}
                        <div className="mb-2">
                            <label className="form-label">👤 Patient</label>
                            <select
                                className="form-select"
                                value={newAppointment.patient}
                                onChange={(e) =>
                                    setNewAppointment({ ...newAppointment, patient: e.target.value })
                                }
                            >
                                {patients.map((p, i) => (
                                    <option key={i} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Doctor selector */}
                        <div className="mb-2">
                            <label className="form-label">🩺 Doctor</label>
                            <select
                                className="form-select"
                                value={newAppointment.doctor}
                                onChange={(e) =>
                                    setNewAppointment({ ...newAppointment, doctor: e.target.value })
                                }
                            >
                                {doctors.map((d, i) => (
                                    <option key={i} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Time picker */}
                        <div className="mb-3">
                            <label className="form-label">🕒 Time</label>
                            <input
                                className="form-control"
                                type="time"
                                value={newAppointment.time}
                                onChange={(e) =>
                                    setNewAppointment({ ...newAppointment, time: e.target.value })
                                }
                            />
                        </div>

                        {/* Save/Cancel buttons */}
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-success w-50 me-2" type="submit">
                                ✅ Save
                            </button>
                            <button
                                className="btn btn-outline-secondary w-50"
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Calender;
