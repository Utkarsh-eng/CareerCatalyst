import { register, login, updateUser } from "../controllers/authController.js";
import express from "express";
import auth from "../middleware/auth.js";
import multer from "multer";

const app = express();

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix+".pdf");
  },
});
const upload = multer({ storage: storage });



app.use(express.urlencoded({ extended: true }));
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(auth, upload.single("resume"), updateUser);

export default router;
