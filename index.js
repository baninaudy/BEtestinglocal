const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection")
const response = require("./response")

app.use(bodyParser.json());

app.get("/", (req, res) => {
    response(200, "api v1 ready", "SUCCESS", res)
});

app.get("/pengguna", (req, res) => {
    const sql = "SELECT * FROM pengguna"
    db.query(sql, (err,fields) => {
        if (err) throw err
        response(200, fields,"list pengguna", res)
    })
});

app.get("/pengguna/:nim", (req, res) => {
    const nim = req.params.nim
    const sql = `SELECT * FROM pengguna WHERE nim = ${nim}`
    db.query(sql, (err,fields) => {
        if (err) throw err
        response(200, fields,"get detailed", res)
    })
});

app.post("/pengguna", (req, res) => {
    const { nim, nama_lengkap, kelas, alamat} = req.body

    const sql = `INSERT INTO pengguna (nim, nama_lengkap, kelas, alamat) VALUES 
    (${nim}, '${nama_lengkap}', '${kelas}', '${alamat}')`

    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId,
            }
            response(200, data, "data added SUCCESS", res)
        }
    })  
});

app.put("/pengguna", (req, res) => {
    const {nim, nama_lengkap, kelas, alamat} = req.body
    const sql = `UPDATE pengguna SET nama_lengkap = '${nama_lengkap}', kelas= '${kelas}', alamat= '${alamat}' WHERE nim= ${nim}`

    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "data added SUCCESSFULLY", res)
        }else{
            response(404, "nim not found", "eror", res)
        }
    })
});

app.delete("/pengguna", (req, res) => {
    const {nim} = req.body
    const sql = `DELETE FROM pengguna WHERE nim = ${nim}`
    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "eror", res)

        if(fields?.affectedRows){
        const data = {
            isDeleted: fields.affectedRows
        }
        response(200, data, "Deleted data SUCCESSFULLY", res)
        }else {
            response(404, "nim not found", "eror", res)
        }
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
