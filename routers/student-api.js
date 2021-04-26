const express = require("express");
const db = require("../connection");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
    return res.status(200).render("index.ejs");
})

router.get("/studentLogin", async (req, res) => {
    return res.status(200).render("studentLogin.ejs");
})

router.get("/studentRegisterForm", async (req, res) => {
    return res.status(200).render("studentRegisterForm.ejs");
})

router.get("/showStudentTable", async (req, res) => {
    try {
        let query = 'SELECT * FROM student';
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


router.post("/register", async (req, res) => {
    try {
        let query = 'SELECT * FROM student WHERE email="' + req.body.email + '"';
        db.query(query, async (err, result) => {
            if (result = "") {
                return res.status(400).json({
                    "message": "Oops Invalid email"
                })
            } else {
                const password = await bcrypt.hash(req.body.password, 8);
                let query = 'INSERT INTO student (name , email ,class ,password) VALUES ("' + req.body.name + '" , "' + req.body.email + '" , "' + req.body.class + '" ,"' + password + '")';
                db.query(query, (err, result) => {
                    if (err) throw err;
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

router.post("/login", async (req, res) => {
    try {
        let query = 'SELECT * FROM student WHERE email="' + req.body.email + '"';
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
                        res.render("studentDashboard",{results});                      
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

router.get("/edit/:id", async (req, res) => {
    try {
        let query = 'SELECT * FROM student WHERE id= "' + req.params.id + '"'
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).render("updateStudent", { result });
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.post("/update/:id", async (req, res) => {
    try {
        let query = `UPDATE student SET name= '${req.body.name}' ,email='${req.body.email}',class='${req.body.class}' WHERE id ='${req.params.id}'`;
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                const query = 'SELECT * FROM student';
                db.query(query, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        return res.status(200).render("showStudentTable", { result });
                    }
                })
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.get("/delete/:id", async (req, res) => {
    try {
        let query = 'DELETE FROM student WHERE id = "' + req.params.id + '"';
        db.query(query, (err, result) => {
            if (err) throw err;
            else {
                let query = 'SELECT * FROM student';
                db.query(query, (err, result) => {
                    if (err) throw err;
                    else {
                        return res.status(200).render("showStudentTable", { result });
                    }
                })

            }
        })
    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})


router.post("/student", async (req, res) => {
    try {
        let query = `SELECT * FROM student WHERE name = '${req.body.name}'`;
        db.query(query, (err, result) => {
            console.log("result",result);
            if (err) {
                throw err;
            } else{
                return res.status(200).send(result);
            }
       
        })
    } catch (err) {
        return res.status(400).json({
            "message":"Oops Something went wrong"+err
        })
    }
})
module.exports = router;
