const express = require("express");
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
const PORT = process.env.PORT || 3306;
const cors = require("cors");
const corsOptions = {
    origin:"http://localhost:3000"
};

app.set('port', process.env.PORT || 3305);
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const dotenv = require("dotenv")
dotenv.config();

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'brilliantchoi98!',
    database: 'diary'
});

db.connect();

const localStorage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, "uploads/");
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const localUpload = multer({storage: localStorage})

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

var mimetype;
const upload = multer({
    storage : multerS3({
        s3:s3,
        bucket:'316projectimage',
        key : function(req, file, cb) {
            mimetype = file.mimetype;
            console.log(mimetype);
            var ext = file.mimetype.split('/')[1];
            if(!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
                return cb(new Error('Only images are allowed'));
            }
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
            
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    acl : 'public-read-write',
    limits: { fileSize: 100 * 1024 * 1024 },
});

// 이미지 업로드 요청
app.post('/img', upload.single('file'), async (req, res) => {
    console.log("in upload method");
    //const files = req.files;
    const file = req.file;
    //console.log(files)
    console.log(file)
    // console.log(req.file.location)
    // res.status(200).json({ location: req.file.location })
    //res.send({"status":"api okay"})
    res.send(file);
});

app.get('/api/diary/users', (req, res) => {
    db.query("SELECT * FROM users;", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

//get a user id from db
app.get('/api/diary/users/user_id=:user_id', (req, res) => {
    db.query("SELECT * FROM users where user_id=\""+req.params.user_id+"\";", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

//post a user
app.post('/api/diary/users/', (req, res) => {
    db.query("INSERT INTO users(user_id, password, user_name, user_email,address_f, address_l, img) VALUES('"+req.body.user_id+"', '"+req.body.password+"' ,'"+req.body.name+"', '"+req.body.email+"', '"+req.body.address1+"', '"+req.body.address2+"', '"+req.body.img+"');", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

//update the specific profile by id of db
app.put('/api/diary/users', (req, res) => {
    db.query("UPDATE users SET password=\""+req.body.password+"\", img=\""+req.body.profile+"\", user_name=\""+req.body.name+"\", user_email=\""+req.body.email+"\", address_f=\""+req.body.address1+"\", address_l=\""+req.body.address2+"\" WHERE user_id=\""+req.body.user_id+"\";", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

//get questions by user_id
app.get('/api/diary/questions/id=:id', (req, res) => {
    db.query("SELECT * FROM questions WHERE user_id = \""+req.params.id+"\";", (err, result) => {
        if(!err){
            res.json(result);
        }else{
            console.log(err);
        } 
    })
});

app.post('/api/diary/questions', (req, res) => {
    if (req.body.question_type === "multiple choice") {
        db.query("INSERT into questions(user_id,question,question_selection, question_type, question_answers) values ('"+req.body.user_id+"', '"+req.body.question+"', '"+req.body.question_selection+"','"+req.body.question_type+"', '[]');", (err, result) => {
            if(!err) {
                res.json(result);
            } else {
                console.log(err);
            }
        });
    } else {
        db.query("INSERT into questions(user_id,question,question_selection, question_type, question_answers) values ('"+req.body.user_id+"', '"+req.body.question+"', '[]', '"+req.body.question_type+"', '[]');", (err,result) => {
            if(!err) {
                res.json(result);
            } else {
                console.log(err);
            }
        })
    }
})

//delete 
app.delete('/api/diary/questions/user_id=:user_id&id=:id', (req,res) => {
    db.query("Delete from questions where user_id =\"" + req.params.user_id + "\" and id=\"" + req.params.id +"\";", (err, result) => {
        if (!err) {
            console.log("Delete from questions where user_id =\"" + req.params.user_id + "\" and id=\"" + req.params.id +"\";")
            res.json(result);
        } else {
            console.log(err);
        }})});

app.put('/api/diary/questions/', (req,res) => {
    db.query("update questions set question_answers = '"+ req.body.question_answers + "' where  question = '"+ req.body.question+"' and user_id = '" + req.body.user_id+ "';", (err, result) => {
        if (!err) {
            console.log("update questions set question_answers = '"+ req.body.question_answers + "' where  question = '"+ req.body.question+"' and user_id = '" + req.body.user_id+ "';");
            res.json(result);
        } else {
            console.log(err);
        }
    });
})

app.listen(app.get('port'), () => {
    console.log('Server is on ' + app.get('port'));
})