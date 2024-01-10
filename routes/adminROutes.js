const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeStatusController,
  removeUserController,
  changeStatusToRejectController,
} = require("../controller/adminCOntroller");

const router = express.Router();

// route for getting all users
router.get("/get-all-users", authMiddleware, getAllUsersController);

// route for getting all doctors
router.get("/get-all-doctors", authMiddleware, getAllDoctorsController);

//route for changing account status
router.post('/change-status', authMiddleware, changeStatusController)

//route for changing status to rejected
router.post("/change-status-to-reject",authMiddleware,changeStatusToRejectController);

//route for removing user
router.delete('/remove-user/:id',authMiddleware,removeUserController)



module.exports = router;
