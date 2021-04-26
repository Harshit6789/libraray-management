const express = require("express");
const db = require("../connection");
const router = express.Router();
const moment = require("moment");

router.get("/studentDashboard/:id", async (req, res) => {
    try {
        let query = 'SELECT * FROM student WHERE id= "' + req.params.id + '"';
        db.query(query, (err, results) => {
            if (err) {
                throw err;
            }
            else {
                return res.render("studentDashboard", { results });
            }
        })
    } catch (err) {
        return res.send({
            "code": 404,
            "success": "Oops Something went wrong" + err
        })
    }

})

router.get("/allbooks/:stdId", async (req, res) => {
    try {
        let studId = req.params.stdId;
        let query = 'SELECT * FROM books';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).render("studentBookData", {
                    userData: result,
                    studentId: studId
                });
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})


router.get("/issueBook/:studentId/:bookId", async (req, res) => {
    try {
        let query = `SELECT * FROM issueBook WHERE studentId = '${req.params.studentId}'`;
        db.query(query, (err, result) => {
            if (result.length > 1) {
                res.status(400).send("Your limit is exceed");
                return;
            }
            else {
                let query = `INSERT INTO issueBook (studentId ,bookId,issueDate) VALUES ('${req.params.studentId}','${req.params.bookId}','${moment(new Date()).format("MM/DD/YYYY")}')`;
                db.query(query, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        return res.status(200).send("Your book is added");
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

router.get("/showIssueBook/:id", async (req, res) => {
    try {
        let stdId = req.params.id;
        let query = `SELECT * FROM issueBook WHERE studentId = '${req.params.id}'`;
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                let bookData = [];
                result.forEach(e => {
                    let query1 = `SELECT * FROM books WHERE bookId = '${e.bookId}'`;
                    db.query(query1, (err, result1) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            bookData.push(result1);
                        }
                    })
                })
                return res.status(200).render("showStudentRecord", {
                    data: bookData,
                    studentId: stdId
                });
            }
        })
    } catch (err) {
        return res.status(400).send("Oops Something wents wrong");
    }
})





module.exports = router;
