const userModel = require("../model/userModels");
const doctorModel = require("../model/doctorModel");
const bookingModel = require("../model/BookingModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//logic for register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userChecked = await userModel.findOne({ email });
    if (userChecked) {
      return res.status(200).send({
        success: true,
        message: "User Already exist please login",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something went wrong while Registering",
      success: false,
      error,
    });
  }
};

// logic for login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: true,
        message: "User Not Found",
      });
    }
    const PasswordMatch = await bcrypt.compare(password, user.password);
    if (!PasswordMatch) {
      return res.status(200).send({
        success: true,
        message: "Incorrect Password Or Email",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something went wrong while login",
      success: false,
      error,
    });
  }
};

//for authorization
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong in authorization",
      success: false,
      error,
    });
  }
};

//logic for adding apply doctor details by user
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has requested for doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Details added and request send for doctor account successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong while adding details",
      success: false,
      error,
    });
  }
};

//logic for getting notification
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    // Move all notifications from 'notification' to 'seenNotification'
    const seenNotification = [...user.seenNotification, ...user.notification];
    // Clear 'notification' array and update 'seenNotification'
    user.notification = [];
    user.seenNotification = seenNotification;
    // Save the updated user
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong while fetching notification",
      success: false,
      error,
    });
  }
};

//logic for deleting all seen notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate({ _id: req.body.userId });
    //clearing all notification
    user.notification = [];
    //clearing all seen notification
    user.seenNotification = [];
    //saving updated details
    const updatedUser = await user.save();
    //removing password from the newly saved user
    updatedUser.password = undefined;
    res.status(200).send({
      message: "All seen notifications has been cleared",
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong while deleting all notification",
      success: false,
      error,
    });
  }
};

//logic for getting all doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctor = await doctorModel.find({ status: "approved" });
    if (doctor) {
      return res.status(200).send({
        success: true,
        message: "All doctors list fetched successfully",
        data: doctor,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "unable to fetch doctors list",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong while getting all doctors",
      success: false,
      error: error.message,
    });
  }
};


//logic for booking an appointment with doctor
const bookAnAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new bookingModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Booking response received and send for doctor approval",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Something went wrong While Booking Appointment",
    });
  }
};


//logic for getting user appointments
const getAppointmentListController = async (req, res) => {
  try {
       const bookings = await bookingModel.find({ userId: req.body.userId })
      .populate('doctorId');
    if (bookings) {
      return res.status(200).send({
        success: true,
        message: 'booking for the given user id fetched successfully',
        data:bookings
      })
    } else {
      return res.status(400).send({
        message: 'unable to fetch the booking for provided user Id',
        success:true
      })
    }
  } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while fetching appointment lists",
          error: error,
        });
  }
}

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAnAppointmentController,
  getAppointmentListController,
};
