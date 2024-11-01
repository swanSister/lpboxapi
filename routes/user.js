var express = require('express')
var router = express.Router()
const sql = require('../query.js')
router.use(express.json())
const SITE_URL = "http://52.79.215.83:3002"

router.post('/create', async function(req, res){
	//test insert user
	let	imgList=[]
	let body = req.body
	//Insert to user
	let q = `INSERT INTO user_list VALUES ('${body.userId}', '${body.id}', '${body.pw}'
	, UTC_TIMESTAMP(), UTC_TIMESTAMP())`

	var q_res = await sql(q)
	if(q_res.success){
		console.log("success!")
		res.status(200).json({data:body})
	}else{
		console.log("fail!")
		res.status(403).send({message:q_res.errorMessage})
	}
})

router.post('/getAllUsert', async function(req, res){
	let body = req.body

	let q_res = await sql(`SELECT * FROM user_list`)

	for(var i in q_res.data){
		let imgList = JSON.parse(q_res.data[i].imgList)
		if(imgList && imgList.length){
			for(var j in imgList){
				let filePath = imgList[j].replace(SITE_URL,'.')
			}
		}
	}
	if(q_res.success){
		if(q_res.data.length){
			res.status(200).json({data:q_res.data})
		}else{
			res.status(200).json({data:null})
		}
	}else{
		res.status(403).send({message:q_res.errorMessage})
	}
})

router.post('/deleteById', async function(req, res){
	let body = req.body
	let q_res = await sql(`DELETE FROM user_list WHERE userId='${body.userId}'`)
	if(q_res.success){
		res.status(200).json({data:q_res.data})
	}else{
		res.status(403).send({message:q_res.errorMessage})
	}
})


module.exports = router;