const doctorModel = require("../model/doctorModel");
const bookingModel = require("../model/BookingModel");
const userModel = require("../model/userModels");

// logic for getting doctor information
const getDoctorInfoController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const doctor = await doctorModel.findOne({ userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching a single doctor info",
      error: error.message,
    });
  }
};

// logic for updating doctor information provided
const updateDoctorInfoMiddleware = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor info updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while updating doctor information",
      error: error.message,
    });
  }
};

//route for getting a particular doctor information
const getParticularDoctorInfoController = async (req, res) => {
  try {
    const { docId } = req.params;
    const doctor = await doctorModel.findById({ _id: docId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Particular doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching particular doctor details",
      error: error.message,
    });
  }
};

//logic foe getting all the booking done for a particular doctor
const bookingsForThisDoctorController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const bookings = await bookingModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: "All bookings for this doctor fetched successfully",
      data: bookings,
      doctor: doctor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching bookings for this doctor",
      error: error.message,
    });
  }
};



//logic for updating the status of user booking
const updateUserBookingStatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    console.log("Booking ID:", bookingId); 

    const bookings = await bookingModel.findByIdAndUpdate(bookingId, {
      status,
    });

    console.log("Bookings:", bookings); 
    const user = await userModel.findOne({ _id: bookings.userId });
    console.log("User:", user); 
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.notification.push({
      type: "Updated Status",
      message: `Your Booking Request Has Been  ${status} `,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: `Booking request has been ${status} successfully`,
      data: bookings,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while updating user bookings status",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateDoctorInfoMiddleware,
  getParticularDoctorInfoController,
  bookingsForThisDoctorController,
  updateUserBookingStatusController,
};
