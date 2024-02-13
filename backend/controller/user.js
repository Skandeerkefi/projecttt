const express = require("express");
const User = require("../model/user");
const router = express.Router();
const path = require("path");

const sendMail = require("../utils/sendMail");

const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");

// create user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
	const { name, email, password } = req.body;
	const userEmail = await User.findOne({ email });

	if (userEmail) {
		return next(new ErrorHandler("User already exists", 400));
	}

	const filename = req.file.filename;
	const fileUrl = path.join(filename);
	const user = {
		name: name,
		email: email,
		password: password,
		avatar: fileUrl,
	};
	const newUser = await User.create(user);
	res.status(201).json({
		success: true,
		newUser,
	});
});

module.exports = router;
