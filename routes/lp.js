var express = require('express')
var router = express.Router()
const sql = require('../query.js')
router.use(express.json())

router.get('/test/get', async function(req, res){
	let q = `SELECT * FROM lp_list`
	let rest = await sql(q)
	res.status(200).json({data:rest.data})
})

router.post('/create', async function(req, res){
	//test insert user
	let	imgList=[]
	let body = req.body
	
	//Insert to user
	let q = `INSERT INTO lp_list VALUES ('${body.lpId}', ${body.name}, '${body.singer}', 
	'${body.releaseDate}','${body.description}','${body.price}','${body.genre}', 
	 '${JSON.stringify(imgList)}', UTC_TIMESTAMP(), UTC_TIMESTAMP())`
	var q_res = await sql(q)
	if(q_res.success){
		res.status(200).json({data:body})
	}else{
		res.status(403).send({message:q_res.errorMessage})
	}
})

router.post('/getLpList', async function(req, res){
	let body = req.body

	let q_res = await sql(`SELECT lp_list.* 
	WHERE lp_list.lpId='${body.lpId}'`)

	if(q_res.success){
		if(q_res.data.length){
			res.status(200).json({data:q_res.data[0]})
		}else{
			res.status(200).json({data:null})
		}
	}else{
		res.status(403).send({message:q_res.errorMessage})
	}
})



module.exports = router;