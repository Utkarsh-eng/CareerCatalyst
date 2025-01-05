import express from "express";
import multer from "multer";

const router = express.Router();

const upload= multer({ dest: 'uploads/users/resume'});

router.post('/upload',upload.single('resume'),(req,res)=>{

    const file = req.file;
    console.log(file);

    res.send('File uploaded successfully');
})

export default router;