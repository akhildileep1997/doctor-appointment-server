const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAnAppointmentController,
  checkAvailabilityForBookingController,
  getAppointmentListController,
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

//for login
router.post("/login", loginController);

//for register
router.post("/register", registerController);

//Authorization
router.post("/getUserData", authMiddleware, authController);

//user applying for doctor-role
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//route for fetching notification 
router.post(
  "/getAllNotification",
  authMiddleware,
  getAllNotificationController
);

//route for deleting all notifications
router.post(
  "/deleteAllNotification",
  authMiddleware,
  deleteAllNotificationController
);

// router for getting all doctors
router.get('/get-all-doctors',authMiddleware,getAllDoctorsController)


//route for booking an appointment with doctor
router.post('/book-an-appointment', authMiddleware, bookAnAppointmentController)


//route for getting appointment list
router.get('/user-appointment-lists',authMiddleware,getAppointmentListController)

module.exports = router
