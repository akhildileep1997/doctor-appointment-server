const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getDoctorInfoController, updateDoctorInfoMiddleware, getParticularDoctorInfoController, bookingsForThisDoctorController, updateUserBookingStatusController } = require('../controller/doctorController')

const router = express.Router()

//get doctor details based on id
router.post('/get-doctor-info', authMiddleware, getDoctorInfoController)

//route for updating the details of doctor
router.post('/update-doctor-info', authMiddleware, updateDoctorInfoMiddleware)

//route for getting the details of a single doctor
router.get('/get-particular-doctor-info/:docId', authMiddleware, getParticularDoctorInfoController)

//route for getting all appoints booked for a particular doctor
router.get('/bookings-for-the-doctor',authMiddleware,bookingsForThisDoctorController)

//route for updating the status of booking request
router.post('/update-user-Booking-status',authMiddleware,updateUserBookingStatusController)


module.exports = router