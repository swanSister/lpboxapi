const express = require('express')
const app = express()
const port = 3002
var cors = require('cors');

const lp = require('./routes/lp')
const user = require('./routes/user')
const images = require('./routes/images')

console.log("@@@###@")
app.use(cors())
app.use('/lp', lp);
app.use('/user', user);
app.use('/images', images);

app.get('/uploads/*', function(req, res, path){
    var imagePath =  __dirname+req.url
    console.log(decodeURI(imagePath))
    res.sendFile(`${decodeURI(imagePath)}`);
  })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))