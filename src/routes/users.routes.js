const { Router } = require("express");
const router = Router();
const { getCredit, addCredit, resetPass } = require("../controllers/users.controller");
const isAuthenticated = require("../authenticatons/jwt.authentication");
const {
  getUser,
  deleteUser,
  updateUser,
  getTokenSignup,
  tokenSignup,
  createUser2,
  signIn,
  getSingIn,
  getCreateUser,
  getResetPass,
  getResetForm,
  resetForm
} = require("../controllers/users.controller");


router.route("/signup").post(createUser2).get(getCreateUser);
router.route("/signup/:token").get(getTokenSignup).post(tokenSignup);
router.route("/signin").post(signIn).get(getSingIn);
router.route("/reset").get(getResetPass).post(resetPass)
router.route("/reset/:token").get(getResetForm).post(resetForm)

router
  .route("/user/:id")
  .get(getUser)
  .delete(isAuthenticated, deleteUser)
  .put(isAuthenticated, updateUser);

module.exports = router;
