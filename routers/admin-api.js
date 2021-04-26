const express = require("express");
const db = require("../connection");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/adminLogin", async (req, res) => {
    return res.status(200).render("adminLogin.ejs");
})

router.get("/adminRegisterForm", async (req, res) => {
    return res.status(200).render("adminRegisterForm.ejs");
})

router.get("/adminDashboard", async (req, res) => {
    return res.status(200).render("adminDashboard.ejs");
})
router.get("/showStudentTable", async (req, res) => {
    try {
        let query = 'SELECT * FROM student';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).render("showStudentTable", { result });
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.get("/getAdminData", async (req, res) => {
    try {
        const query = 'SELECT * FROM admin';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).send(result);
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})


router.post("/adminRegister", async (req, res) => {
    try {
        let query = 'SELECT * FROM admin WHERE email="' + req.body.email + '"';
        db.query(query, async (err, result) => {
            if (result = "") {
                return res.status(400).json({
                    "message": "Oops Invalid email"
                })
            } else {
                const password = await bcrypt.hash(req.body.password, 8);
                let query = 'INSERT INTO admin (name , email ,password, mobileNumber) VALUES ("' + req.body.name + '" , "' + req.body.email + '" , "' + password + '" ,"' + req.body.mobileNumber + '")';
                db.query(query, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        return res.status(200).json({
                            "message": "Data is successfully added"
                        })
                    }
                })
            }

        })
    } catch (err) {
        return res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.post("/adminLogin", async (req, res) => {
    try {
        let query = 'SELECT * FROM admin WHERE email="' + req.body.email + '"';
        db.query(query, async (error, results) => {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                if (results.length > 0) {
                    const comparision = await bcrypt.compare(req.body.password, results[0].password)
                    if (comparision) {
                        res.status(200).render("adminDashboard.ejs");
                    }
                    else {
                        res.send({
                            "code": 204,
                            "success": "Email and password does not match"
                        })
                    }
                }
                else {
                    res.send({
                        "code": 206,
                        "success": "Email does not exits"
                    });
                }
            }

        })
    } catch (err) {
        return res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.patch("/edit", async (req, res) => {
    try {
        let query = 'UPDATE admin SET name= "' + req.body.name + '" ,email="' + req.body.email + '",mobileNumber="' + req.body.mobileNumber + '" WHERE email ="' + req.body.email + '"';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).send(result);
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})


router.delete("/delete", async (req, res) => {
    try {
        let query = 'DELETE FROM admin WHERE email = "' + req.body.email + '"';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).send(result);
            }
        })
    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

module.exports = router;
