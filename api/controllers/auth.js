const user = require("../model/user");
const place = require("../model/place");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body.form;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(422).json({
        success: false,
        message: "User already exists",
      });
    }
    let hashedPassword;

    hashedPassword = await bcrypt.hash(password, 10);

    const puser = await user.create({
      name,
      password: hashedPassword,
      email,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: `User ${user} failed to create and try again`,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body.form;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Enter all fields to login",
      });
    }
    const nuser = await user.findOne({ email: email });
    if (!nuser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
    const payload = {
      name: nuser.name,
      email: nuser.email,
      id: nuser._id,
    };
    if (await bcrypt.compare(password, nuser.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      const tuser = nuser.toObject();
      tuser.token = token;
      tuser.password = undefined;
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        tuser,
        message: "Logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

exports.getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (e, user) => {
      if (e) throw e;
      return res.json({
        name: user.name,
        id: user._id,
        email: user.email,
      });
    });
  } else {
    res.json(null);
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "").json({
    success: true,
    message: "logged out",
  });
};

// exports.upload = async (req, res) => {
//   try {
//     // console.log(req.files);
//     const file = req.files.file;

//     console.log(file);
//     let path =
//       __dirname + "/Files/" + Date.now() + "." + `${file.name.split(".")[1]}`;
//     console.log("Uploading to" + path);
//     file.mv(path, (err) => {
//       console.log(err);
//     });
//     res.json({
//       success: true,
//       message: "File uploaded successfully",
//     });
//   } catch (err) {
//     console.log("Error uploading file");
//     console.log(err);
//   }
// };

exports.plaecesAdd = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { addedPhotos, form } = req.body;
    const {
      address,
      checkin,
      checkout,
      description,
      entrance,
      extrainfo,
      guests,
      imglink,
      parking,
      pets,
      title,
      tv,
      wifi,
    } = form;
    const perks = [pets, parking, tv, wifi, entrance];
    console.log(addedPhotos);
    console.log(form);

    try {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (e, userData) => {
        const placeDoc = await place.create({
          owner: userData.id,
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo: extrainfo,
          checkIn: checkin,
          checkOut: checkout,
        });
        return res.json(placeDoc);
      });
    } catch (err) {
      return res.status(404);
    }
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Fill all details correctly",
    });
  }
};

exports.getPlaces = async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (e, userData) => {
      const id = userData.id;

      const places = await place.find({ owner: id });
      return res.json(places);
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
    });
  }
};
