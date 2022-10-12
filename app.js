const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const cookieParser = require('cookie-parser');

const app = express();
const router = express.Router();

const { Op } = require("sequelize");
const { User } = require("./models");

app.use(express.json());

app.use(cookieParser());

const likesRouter = require("./routes/like");
app.use([likesRouter]);

const postsRouter = require("./routes/posts");
app.use([postsRouter]);

const commentsRouter = require("./routes/comments");
app.use([commentsRouter]);



//회원가입 API
router.post("/signup", async (req, res) => {
    if(req.cookies.token){
      res.send({"message":"이미 로그인 되어 있습니다!"})
      return;
    }
    const {nickname, password, confirm} = req.body;
    console.log("test");
    if (password !== confirm) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
      });
      return;
    }
  
    // nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
      where: {username: nickname},
    });
    if (existsUsers.length) {
      res.status(400).send({
        errorMessage: "이미 사용중인 닉네임 입니다.",
      });
      return;
    }
    //닉네임은 3자이상,영문 또는 숫자를 포함.
    const pattern1 = /[0-9]/;				// 숫자
    const pattern2 = /[a-zA-Z]/;			// 문자
	  const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; //특수문자
    if(!pattern1.test(nickname) && !pattern2.test(nickname) || pattern3.test(nickname)|| nickname.length < 3) {
      res.status(400).send({"message":"닉네임은 3자이상, 영문 또는 숫자입니다."});
      return;
    }
    if(password < 4 || password.includes(nickname)) {
      res.status(400).send({"message":"비밀번호는 4자이상, 닉네임이 포함되어 있지 않아야 됩니다."})
      return;
    }
  
    await User.create({username:nickname, password:password });
    res.status(201).send({"message":"회원 가입에 성공하였습니다."});
  });


  //로그인  API
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    if(req.cookies.token){
      res.send({"message":"이미 로그인 되어 있습니다!"})
      return;
    }
    const user = await User.findOne({
      where: {
        username: nickname,
      },
    });
    console.log("1");
    console.log(user.userId);
    const token = jwt.sign({ key: user.userId }, "customized-secret-key")
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
      return;
    }
    res.cookie('token', token);
    res.send({
      token
    });
  });

  //로그인시 회원정보 가져오기
  router.get("/users/me",authMiddleware,async(req,res)=>{
    console.log({ User });
    console.log("3");
    console.log(req.cookies.token);
    const { user } = res.locals;
    console.log(res.locals);
    res.send({
        user,
    });
});

app.use(express.urlencoded({ extended: false }), router);

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});