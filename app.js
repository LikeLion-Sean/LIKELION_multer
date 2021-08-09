// Template view Engine
const express = require('express');
const path = require('path');
const multer = require('multer');
const ejs = require('ejs');

// Init app
const app = express();
const port = 5000;

// EJS
app.set('view engine', 'ejs');

// Pulic Directory
app.use(express.static('./public'))

// Storage Engine -> Multer
const multerStorage = multer.diskStorage({ // 저장소 diskStorage({경로, 파일이름설정})
    destination: './public/upload', // 경로
    filename: function(req, file, cb){ // 파일 이름 설정
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

// Check File Type
function checkFileType(file, cb){ //함수선언식, 함수 할당식 
    const filetypes = /jpeg|jpg|png|gif/; // 정규표현식
    // STRING = string
    // SEANKIM84@hotmail.com
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error image only')
    }
}


// Init multer 
const upload = multer({ // 실제 업로드=
    storage: multerStorage,
    limits: {fileSize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }    
}).single('myImage'); // Fiedname



// img, video, pdf, pptx, exc 

// Router
app.get('', (req, res) => {
    res.render('index')
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => { // callback
        if(err){
            res.render('index', {msg: err})
        } else {
            console.log(req.file);
            res.render('index', {
                msg: "File Upload Success",
                file: `upload/${req.file.filename}`
            })
        }
    })
})

// Server 
app.listen(port, () => {
    `Server is learning on ${port}`
});