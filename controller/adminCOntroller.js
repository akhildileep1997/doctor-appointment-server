const doctorModel = require("../model/doctorModel");
const userModel = require("../model/userModels");

//logic for getting all users
const getAllUsersController = async (req, res) => {
  try {
    const user = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "all users list fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while getting all users",
      error,
    });
  }
};

//logic for getting all doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "all doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while getting all users",
      error,
    });
  }
};

// logic for changing account status // ie for approving doctor account
const changeStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status })
    const user = await userModel.findOne({ _id: doctor.userId })
    const notification = user.notification.push({
      type: 'Doctor-Account Request has been accepted',
      message:`Your Doctor Account request has ${status} `,
      onclickPath:'/notification'
    })
    user.isDoctor = status === 'approved' ? true : false
    await user.save()
    res.send({
      success: true,
      message: 'Doctor Account request has been successfully approved by tye admin',
      data: doctor,
      user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while changing the status",
      error,
    });
  }
};

// logic for changing status to reject the  doctor account after approving
const changeStatusToRejectController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });

    // Check if the doctor record is found
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const user = await userModel.findOne({ _id: doctor.userId });

    // Check if the user record is found
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Ensure that user.notification is an array before trying to push to it
    if (!user.notification) {
      user.notification = [];
    }

    const notification = user.notification.push({
      type: "Doctor-Account Request has been Rejected",
      message: `Your Doctor Account request has ${status} `,
      onclickPath: "/notification",
    });

    user.isDoctor = status === "rejected" ? false : true;
    await user.save();

    res.send({
      success: true,
      message: "Doctor Account request has been rejected by the admin",
      data: doctor,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while changing the status",
      error,
    });
  }
};


//logic for removing user by admin
const removeUserController = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findByIdAndDelete({_id:id})
    if (user) {
      return res.status(200).send({
        message:'user removed successfully',
        success:true
      })
    }
  } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "something went wrong while removing the user",
          error,
        });
  }
}

module.exports = {
  getAllUsersController,
  getAllDoctorsController,
  changeStatusController,
  removeUserController,
  changeStatusToRejectController,
};
