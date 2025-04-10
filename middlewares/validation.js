// middlewares/validation.js
const { body } = require("express-validator");

const profileValidationRules = [
  body("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces."),
  body("email")
    .isEmail()
    .withMessage("Invalid email address."),
  body("bio")
    .isLength({ max: 500 })
    .withMessage("Bio must be 500 characters or less.")
    .matches(/^[^<>&"'`]*$/)
    .withMessage("Bio contains forbidden characters."),
];

module.exports = { profileValidationRules };
