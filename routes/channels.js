const express = require('express')
const router = express.Router()

router.use(express.json())

db = new Map()
let id = 0

router .route('/')

    .post((req, res)=>{
        
        let {channelTitle, userId} = req.body
        if (channelTitle == undefined){
            res.status(404).json({
                message:'정보를 제대로 입력해 주세요'
        })
        } else{
            db.set(userId, {
                channelTitle : channelTitle,
            })
            res.status(201).json({
                message: `${channelTitle} 님의 유튜버 생활을 응원합니다.`
            })
            }
    })
    
   .get((req, res)=>{
        channelView = []
        const {userId} = req.body
        if (db.size && userId != undefined) {
            db.forEach((v, key) => {
                if (v.userId === userId){
                    channelView.push(v)
                }
            })

            if (channelView.length) {
                res.status(200).json(channelView)
            } else{
                res.status(404).json({
                    message : "조회할 채널이 없습니다."
                    })
                }
        } else if (userId == undefined){
            res.status(404).json({
            message : "로그인이 필요한 서비스입니다."
            })

        } else{
            res.status(404).json({
                message : ""
            })
        }

}) //전체조회



router.route('/channels/')
    .get((req, res)=>{ //채널 개별조회
        let {userId} = req.body
        tempChannel = db.get(userId)
        if (tempChannel == undefined){
            res.status(404).json({
                message : "해당 채널을 찾을 수 없습니다."
            })
        } else{
            res.status(200).json(tempChannel)
        }
    })
    .delete((req, res) => {
        let {userId} = req.body
        tempChannel = db.get(userId)

        if (tempChannel){
            db.delete(userId)
            res.status(200).json({
                message : `${tempChannel.channelTitle} 채널이 성공적으로 삭제 됐습니다.`
            })
        } else {
            res.status(404).json({
                message : "요청하신 채널을 찾을 수 없습니다."
            })
        }

    })
    .put((req, res) => {
        let {userId} = req.body
        tempChannel = db.get(userId)
        
        if (tempChannel){
            let old = tempChannel.channelTitle
            let newTitle = req.body.channelTitle
            db.set(userId, 
                {channelTitle : newTitle,
            })
            res.status(200).json({
                message : `채널명이 ${old}에서 ${newTitle}로 성공적으로 변경 됐습니다.`
            })

        } else{
            res.status(404).json({
                message : "해당 채널을 찾을 수 없습니다."
            })
        }
    })

module.exports = router 