const express = require('express')
const router = express.Router()
const {body, param, validationResult} = require('express-validator')
const conn = require('../db')
router.use(express.json())

let validate = (req, res, next) => {
    let result = validationResult(req)
    if (result.isEmpty()){
        return next()
    }
    return res.status(400).json(result.array())
}



router .route('/')
    .get(body('userId').notEmpty().isInt().withMessage('숫자 입력'), validate,
    (req, res, next) => {
        let {userId} = req.body
        let channels = []
        
        const query = `SELECT * FROM channels where user_id = ?`
        conn.query(query, userId, (err, rows) => {
            if (rows.length)
                res.status(200).json(rows)
            else
                res.status(404).json(err)
        })

    })
    .post(
        body('userId').notEmpty().isInt().withMessage('숫자를 입력해!'), 
        body('channelTitle').notEmpty().isString().withMessage('문자를 입력해!'), validate,
        (req, res, next) => {
            
            let {channelTitle, userId} = req.body
            const query = `INSERT INTO channels (name, user_id) VALUES(?, ?)`
            conn.query(query, [channelTitle, userId], (err, rows)=>{
                if(err)
                    return res.status(400).end();

                res.status(201).json(rows)

                })
        })                

router.route('/:id')    
   .get(
    param('id').notEmpty().withMessage('아이디 입력 요망'), validate
   ,(req, res, next)=>{
        
        
        const {id} = req.params
        id = parseInt(id)
        const query = `SELECT FROM channels WHERE id = ?`
        

        conn.query(query, email, (err, rows) =>{
            if (rows.length){
                res.status(200).json(rows)
            } else{
                res.status(404).json({
                    message : "해당 채널을 찾을 수 없습니다." 
                })
            }
        })
        
    })
    
    .delete( param('id').notEmpty().withMessage('id 필요'), validate, 
     (req, res, next) => {
        let {id} = req.params
        id = parseInt(id)
        
        const delQuery= `DELETE FROM channels WHERE id = ?`
        conn.query(delQuery, id, (err, rows)=>{
            
            if (err)
                return res.status(400).end()
            if (!rows.affectedRows)
                return res.status(400).end()
            
            res.status(200).json(rows)
        })    
        
    })

    .put(param('id').notEmpty().withMessage('채널 id 필요'), validate,
    (req, res, next) => {

        const {id} = req.params
        const {name} = req.body

        const query = `UPDATE channels SET name = ? WHERE id = ?`
        conn.query(query, [name, id], (err, rows)=>{
            if (err)
                return res.status(400).json(err.array())
            if (rows.affectedRows == 0)
                return res.status(400).json({message : 'cannot found channel id'})
            
            res.status(200).json(rows).end()
        })
        
    })

module.exports = router 