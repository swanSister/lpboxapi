const express = require('express')
const app = express()
const global = require('./global')
var router = express.Router()
const Q = require('q')
const multer = require('multer')
const sql = require('../query.js')
const fs = require('fs');

var upload = function (req, res) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const dir = `./uploads/${req.folderName}`
        fs.exists(dir, exist => {
        if (!exist) {
          return fs.mkdir(dir, error => cb(error, dir))
        }
        return cb(null, dir)
        })
      },
  
      filename: function (req, file, cb) {
        file.uploadedFile = {
          name: req.params.filename,
          ext: file.mimetype.split('/')[1]
        };
        cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
      }
    });
    var upload = multer({ storage: storage }).single('image');
    upload(req, res, function (err) {
      if (err) {
        console.log(req, res, err)
        deferred.reject()
      }
      else deferred.resolve(req.file.uploadedFile);
    });
    return deferred.promise;
  };
  router.post('/:filename', async function(req, res, next) {
    req.folderName = 'lp'
    upload(req, res).then(async function (file) {
      let lpId = file.name.split('_')[0]
      let url = `${global.API_URL}/uploads/${req.folderName}/${file.name}.${file.ext}`
      
      let q_res = await sql(`SELECT imgList FROM lp_list WHERE lpId='${lpId}'`)
      console.log('lp image insert ',q_res.data)
      if(q_res.success){
        let imgList = JSON.parse(q_res.data[0].imgList)
        imgList.push(url)
        let q_res2 = await sql(`UPDATE lp_list SET imgList='${JSON.stringify(imgList)}' WHERE lpId='${lpId}'`)
        if(q_res2.success){
          res.status(200).json({data:url})
        }else{
          res.status(403).send({message:q_res2.errorMessage})
        }
      }
      else 
        res.status(403).send({message:q_res.errorMessage})
    }, function (err) {
      console.log(err)
      res.status(500).send({message:'upload error'});
    })
  })
  module.exports = router;