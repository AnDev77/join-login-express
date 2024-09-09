const express = require('express')
const app = express()
port = 3001
app.listen(port, ()=>{
    console.log(`join-out app is listening at ${port}`)
})
app.use(express.json())
let db = new Map()

//로그인
let id = 1
db.clear()
app.post('/login', (req, res) => {
    const {userId, pwd} = req.body
    let tempUser = {}
    tempUser = getUser(userId)

    if (isExist(tempUser)){
       if (tempUser.pwd !== pwd){
            res.status(404).json({
                message : '입력하신 비밀번호가 옳지 않습니다.'
            })
        } else{
            res.status(201).json({
                message : `${tempUser.userId} 님 환영합니다.`
            })
        }
        
    } else {
        res.status(404).json({
        message: "id를 조회할 수 없습니다."
        })
        //res.sendFile()
    }
    
})

// 회원가입
app.post('/join', (req, res) => {
    const {userId, pwd, name} = req.body

    if (userId === undefined || pwd === undefined || name === undefined){
        res.status(400).json({
            message : '올바른 정보를 입력해 주세요'
        })
    } else {
        let tempUser = req.body
        db.set(id++ , tempUser)
        res.status(201).json({
            message : `${db.get(id-1).userId} 님, 가입을 환영합니다!`
        })
        console.log(db)
    }

})
app .route('/users/:id')
    .get((req, res) => { 
        id = req.params.id
        id = parseInt(id)
        let tempUser = db.get(id)
        if (tempUser != undefined){
        
            res.json({
                userId : tempUser.userId,
                name : tempUser.name
            })
        } else {
            res.status(404).json({
                message : "회원 정보가 올바르지 않습니다."
            })
        }
    })
    .delete((req, res) => {
        id = req.params.id
        id = parseInt(id)
        tempUser = db.get(id)

        if ( tempUser != undefined){
            let xId = tempUser.userId
            db.delete(id)
            res.json({
                message : `${xId} 님 다음에 다시 뵐게요` 
            })
            console.log(db)

        } else {
            res.status(404).json({
                message: "입력하신 정보의 회원을 찾을 수 없습니다."
            })
        }
    })


function getUser(userId){
    for (let v of db.values()){
        if (v.userId == userId){
            return v
            }
        }
    return {}
}

function isExist(user){
    if (Object.keys(user).length === 0){
        return false
    } else{
        return true
    }
}