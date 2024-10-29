var express = require('express')
var router = express.Router()
const sql = require('../query.js')
router.use(express.json())

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
				let filePath = imgList[j].replace('http://52.79.215.83','.')
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

console.log("get lp2!!!")


module.exports = router;