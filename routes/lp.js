var express = require('express')
var router = express.Router()
const sql = require('../query.js')
router.use(express.json())
const SITE_URL = "http://52.79.215.83"

console.log("get lp!!!")
router.get('/test/get', async function(req, res){
	let q = `SELECT * FROM lp_list`
	let rest = await sql(q)
	res.status(200).json({data:rest.data})
})

router.post('/create', async function(req, res){
	//test insert user
	let	imgList=[]
	let body = req.body
	console.log("body",req.body)
	//Insert to user
	let q = `INSERT INTO lp_list VALUES ('${body.lpId}', '${body.name}', '${body.singer}', 
	'${body.releaseDate}','${body.description}','${body.price}','${body.genre}', 
	 '${JSON.stringify(imgList)}', UTC_TIMESTAMP(), UTC_TIMESTAMP())`

	 console.log(q)
	var q_res = await sql(q)
	if(q_res.success){
		console.log("success!")
		res.status(200).json({data:body})
	}else{
		console.log("fail!")
		res.status(403).send({message:q_res.errorMessage})
	}
})

router.post('/getAllLpList', async function(req, res){
	let body = req.body

	let q_res = await sql(`SELECT * FROM lp_list`)

	for(var i in q_res.data){
		let imgList = JSON.parse(q_res.data[i].imgList)
		if(imgList.length){
			for(var j in imgList){
				console.log("imgList[j]",imgList[j])
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
	if(body.imgList.length){
		for(var i in body.imgList){
			let filePath = body.imgList[i].url.replace(SITE_URL,'.')
			try {
				fs.unlinkSync(filePath)
			  } catch (err) {
				console.error(err)
			  }
		}
	}
	let q_res = await sql(`DELETE FROM lp_list WHERE lpId='${body.lpId}'`)
	if(q_res.success){
		res.status(200).json({data:q_res.data})
	}else{
		res.status(403).send({message:q_res.errorMessage})
	}
})

module.exports = router;