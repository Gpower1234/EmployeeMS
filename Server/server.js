import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { verify } from 'crypto';
import { decode } from 'querystring';

const app = express();
app.use(cors(
    {
        origin: "http://127.0.0.1:5173",
        methods: ["POST", "GET", "PUT"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'localhost'
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

con.connect(function(err) {
    if(err) {
        console.log('Error in connection', err)
    } else {
        console.log('Connected')
    }
});

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee"
    con.query(sql, (err, result) => {
        if (err) return res.json({Error: "Get employee error in sql"})
        return res.json({status: "success", Result: result})
    })
});

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: "Update employee error in sql"})
        return res.json({status: "success", Result: result})
    })
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id
    const sql = "UPDATE employee set name = ?, salary = ?, address = ? WHERE id = ?";
    con.query(sql, [req.body.salary, req.body.address, id], (err, result) => {
        if (err) return res.json({Error: "Get employee error in sql"})
        else {
            return res.json({status: "success"})
        }
    })
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: "Delete employee error in sql"})
        else {
            return res.json({status: "success"})
        }
    })
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({Error: "You are not Authenticated"})
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Wrong Token"})
            req.role = decoded.role;
            req.id = decoded.id
            next();
        })
    }
}

app.get('/dashboard', verifyUser, (req, res) => {
    return res.json({status: 'success', role: req.role, id: req.id})
});

app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if (err) return res.json({Error: "Error in running query"});
        return res.json(result);
    })
});

app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({Error: "Error in running query"});
        return res.json(result);
    })
});

app.get('/salary', (req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({Error: "Error in running query"});
        return res.json(result);
    })
});

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users where email = ? AND password = ?';
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({status: 'Error', Error: 'Error in running query'});
        if(result.length > 0 ){
            const id = result[0].id;
            const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'})
            res.cookie('token', token)
            console.log('Logged In')
            return res.json({ status: 'success'})
        } else {
            return res.json({status: 'Error', Error: 'wrong Email or Password'})
        }
    })
});


app.post('/employeeLogin', (req, res) => {
    const sql = 'SELECT * FROM employee where email = ?';
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({status: 'Error', Error: 'Error in running query'});
        if(result.length > 0 ){
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response) => {
                if(err) return res.json({status: "Error", Error: "password error"})
                
                const token = jwt.sign({role: "employee"}, "jwt-secret-key", {expiresIn: '1d'})
                res.cookie('token', token)
                console.log('Logged In')
                return res.json({ status: 'success', id: result[0].id})
            })
           
        } else {
            return res.json({status: 'Error', Error: 'wrong Email or Password'})
        }
    })
});

app.get

app.post('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ status: 'success'})
})

app.post('/create', upload.single('image'), (req, res) => {
    //console.log(req.file)
    const sql = "INSERT INTO employee (`name`, `email`, `password`, `salary`, `address`,  `image`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({Error: "Error in hashing password"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.salary,
            req.body.address,
            req.file.filename
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "inside query"})
            return res.json({status: "Success"})
        })
    })
})

app.listen(5000, () => {
    console.log('Running')
})