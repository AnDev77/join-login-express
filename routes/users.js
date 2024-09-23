const express = require("express")
const router = express.Router() //user
router.use(express.json())
const conn = require("../db")


//로그인
router.post("/login", (req, res) => {
  const {email, password} = req.body;
  let loginUser  = {}
  const query = `SELECT * FROM users WHERE email  = ?`
  
  conn.query(query, email, (err, rows)=>{
    let loginUser = rows[0]
    if (loginUser && loginUser.password == password){
            res.status(200).json({
                message : `${email} 님 반갑습니다.`
            })
    } else{
        res.status(404).json({
            message : " 아이디 혹은 비밀번호가 틀렸습니다."
        })
    }
  })
});

// 회원가입
router.post("/join", (req, res) => {
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
  .get((req, res) => {
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
  .delete((req, res) => {
    let { email } = req.body;
    const delQuery= `DELETE FROM users WHERE email = ?`

    conn.query(delQuery, email, (err, rows)=>{
        res.status(200).json({
            message :  `${email} 님 다음에 뵐게요`
        })
    })    
})


module.exports = router; // 모듈화
