const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const template = require("./lib/template.js");
const qs = require("querystring");
const bodyParser = require("body-parser");
const compression = require("compression");
const topicRouter =require("./routes/topic");
const indexRouter =require("./routes/index");
const helmet = require("helmet");

// 보안패키지
app.use(helmet());

// 미들웨어
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*',(req,res,next)=>{
  fs.readdir("./data", function (error, filelist) {
    req.list = filelist;
    next(); 
  });
})
app.use('/topic', topicRouter);
app.use('/', indexRouter);






// 에러처리
app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
