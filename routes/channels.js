const express = require('express')
const router = express.Router()
const conn = require('../db')
router.use(express.json())

router .route('/')
    .get((req, res) => {
        let {userId} = req.body
        let channels = []
        const query = `SELECT * FROM channels where user_id = ?`
        if(userId){
            conn.query(query, userId, (err, rows) => {
                if (rows.length)
                    res.status(200).json(rows)
                else
                    res.status(404).json({
                        message : "채널 정보를 찾을 수 없습니다."
                    })
                
            
            })
        } else {
          res.status(400).json({
                message: "정보를 다시 입력해주세요"
            })
        }

    })
    .post((req, res)=>{
        
        let {channelTitle, userId} = req.body
        const query = `INSERT INTO channels (name, user_id) VALUES(? ,?)`
        if (channelTitle == undefined || userId == undefined){
            res.status(400).json({
                message : "입력 정보를 다시 확인해주세요"
            })
        } else {
            conn.query(query, [channelTitle, userId], (err, rows)=>{
                res.status(201).json({
                    message : `${channelTitle} 님의 유튜버 생활을 응원합니다.`
                })
            })
        }  
    })

router.route('/:id')    
   .get((req, res)=>{
        
        const {id} = req.params
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
    .delete((req, res) => {
        let {email} = req.body
        
    })
    .put((req, res) => {
        let {email} = req.body
        
    })

module.exports = router 