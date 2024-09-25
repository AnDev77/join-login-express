const express = require("express")
const router = express.Router() //user
const {body, validationResult} = require('express-validator')
router.use(express.json());
const conn = require("../db");
const jwt = require('jsonwebtoken'); //jwt 모듈
const dotenv = require('dotenv'); // dotenv 모듈

dotenv.config(); 

let validate = (req, res, next) => {
  let result = validationResult(req)
  if (result.isEmpty()){
      return next()
  }
  return res.status(400).json(result.array())
}

//로그인
router.post("/login",
  body('email').notEmpty().isEmail(), body('password').notEmpty(),validate,  
  (req, res, next) => {
  const {email, password} = req.body;
  let loginUser  = {}
  const query = `SELECT * FROM users WHERE email  = ?`
  
  conn.query(query, email, (err, rows)=>{
    let loginUser = rows[0]
    if (loginUser && loginUser.password == password){
            const token = jwt.sign({
              email : loginUser.email,
              name : loginUser.name

            }, process.env.PRIVATE_KEY, {
              expiresIn : '5m', // 만료시간 설정
              issuer : 'an'
            })
            res.cookie('token', token, {
              httpOnly : true
            });    
            console.log(token);
            res.status(200).json({
                message : `${loginUser.name} 님 반갑습니다.`
            })
    } else{
        res.status(403).json({
            message : " 아이디 혹은 비밀번호가 틀렸습니다."
        })
    }
  })
});

// 회원가입
router.post("/join", body('email').notEmpty().isEmail(), 
body('password').notEmpty(), body('name').notEmpty(),
 body('contact').notEmpty(),validate, 
  (req, res, next) => {
  const { email, password, name, contact } = req.body
  if (email == undefined || password == undefined || name == undefined || contact == undefined){
    res.status(400).json({
        message : "입력 정보를 다시 확인해 주세요"
    })
  }else{
    const query = `INSERT INTO users (email, password, name, contact) 
    VALUES(?, ?, ?, ?)`
    conn.query(query, [email, password, name, contact])
    res.status(201).json({
        message :  `${email} 님 가입을 환영합니다.`
    })
  }
  

 
});
router
  .route("/users")
  .get(body('email').notEmpty().isEmail(), validate,
    (req, res,next) => {
    let { email } = req.body;
    const query = `SELECT * FROM users WHERE users.email = ?` 
    conn.query(query, email,(err, rows) => {
        if(rows.length){
            res.status(200).json(rows) // rows는 json 형태로 반환
        } else{
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        } 
      }
    
    );
  })
  .delete(body('email').notEmpty(), validate
    ,(req, res, next) => {
    let { email } = req.body;
    const delQuery= `DELETE FROM users WHERE email = ?`

    conn.query(delQuery, email, (err, rows)=>{
        
      if (err)
        return res.status(400).json(err.array())
      if (rows.affectedRows  == 0)
        return res.status(400).json({message : 'cannot found user email'})
    
    res.status(200).json(rows).end()
    })    
})


module.exports = router; // 모듈화
