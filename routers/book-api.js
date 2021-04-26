const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../connection");

router.get("/bookForm", async (req, res) => {
    return res.status(200).render("bookForm.ejs");
})


router.get("/showBookTable", async (req, res) => {
    try {
        let query = 'SELECT * FROM books';
        db.query(query, (err, result) => {
            if (err) throw err;
            else return res.status(200).render("showBookTable", { result });
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.post("/addbook", async (req, res) => {
    try {
        if (req.body.bookName == "" || req.body.authorName == "" || req.body.publishDate == "" || req.body.bookPrice == "" || req.body.totalPage == "") {
            res.status(400).send("Please Enter the all values");
            return;
        }
        let query = 'INSERT INTO books (bookName ,authorName ,publishDate ,bookPrice ,totalPage) VALUES ("' + req.body.bookname + '" , "' + req.body.authorname + '" , "' + req.body.date + '" , "' + req.body.bookprice + '" , "' + req.body.totalpage + '")';
        db.query(query, (err, result) => {
            if (err) throw err;
            else {
                return res.status(200).json({
                    "message": "Data is successfully added"
                })
            }
        })
    } catch (err) {
        return res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.post("/addbook/:id", async (req, res) => {
    try {
        const addId = req.params.id;
        if (addId) {
            const directory = 'public';
            fs.readdir(directory, (err, files) => {
                if (err) {
                    throw err;
                }
                else {
                    for (const file of files) {
                        fs.unlink(path.join(directory, file), err => {
                            if (err) {
                                throw err;
                            }
                            else {
                                return res.status(200).send("Files are deleted");
                            }
                        });
                    }
                }
            });
        } else {
            try {
                if (req.body.bookName == "" || req.body.authorName == "" || req.body.publishDate == "" || req.body.bookPrice == "" || req.body.totalPage == "") {
                    res.status(400).send("Please Enter the all values");
                    return;
                }
                let query = 'INSERT INTO books (bookName ,authorName ,publishDate ,bookPrice ,totalPage) VALUES ("' + req.body.bookName + '" , "' + req.body.authorName + '" , "' + req.body.publishDate + '" , "' + req.body.bookPrice + '" , "' + req.body.totalPage + '")';
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
            } catch (err) {
                return res.status(400).json({
                    "message": "OOPS Something went wrong" + err
                })
            }
        }
    } catch (error) {
        return res.status(400).json({
            "message": "OOPS , Something went wrong" + error
        })
    }
})


router.get("/edit/:bookId", async (req, res) => {
    try {
        let query = 'SELECT * FROM books WHERE bookId= "' + req.params.bookId + '"'
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).render("updateBook", { result });
            }
        })

    } catch (err) {
        res.status(400).json({
            "message": "OOPS Something went wrong" + err
        })
    }
})

router.post("/update/:bookId", async (req, res) => {
    try {
        let query = `UPDATE books SET bookName= '${req.body.bookName}' ,authorName='${req.body.authorName}',publishDate='${req.body.publishDate}' , bookPrice='${req.body.bookPrice}' ,totalPage= '${req.body.totalPage}' WHERE bookId ='${req.params.bookId}'`;
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                const allBook = 'SELECT * FROM books';
                db.query(allBook, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {

                        return res.status(200).render("showBookTable", { result });
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

router.get("/remove/:bookId", async (req, res) => {
    try {
        let query = 'DELETE FROM books WHERE bookId = "' + req.params.bookId + '"';
        db.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                let query = 'SELECT * FROM books';
                db.query(query, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        return res.status(200).render("showBookTable", { result });
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



router.post("/author", async (req, res) => {
    try {
        let query = 'SELECT * FROM books WHERE authorName ="' + req.body.authorName + '"';
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


router.post("/book", async (req, res) => {
    try {
        console.log("req.body>>>",req.body.bookName);
        let query = 'SELECT * FROM books WHERE bookName = "' + req.body.bookName + '"';
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

router.post("/auth", async (req, res) => {
    const searchData = req.body.authorName;
    if (searchData) {
        try {
            let query = 'SELECT * FROM books WHERE authorName ="' + req.body.authorName + '"';
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
    } else {
        try {
            let query = 'SELECT * FROM books WHERE bookName = "' + req.body.bookName + '"';
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
    }
})

module.exports = router;
