const express = require('express');
const router = express.Router();
const { Post } = require("../models");
const { Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { where } = require('sequelize');

//게시글 포스팅API
router.post("/posts",authMiddleware, async (req, res) => {
   try{
 const user = res.locals.user;
 const { title, content } = req.body;
  await Post.create({
            userId: user.userId,
            username:user.username,
            title:title,
            content:content,
            likes:0
        });
  res.json({"message":"게시글을 생성하였습니다."});
  } catch {return res.status(400).json("400Error")}
});

//게시글목록 조회 API
router.get("/posts",async (req, res) =>{
    try{
 const post = await Post.findAll({
    order: [
        ["createdAt","DESC"],
    ]
 });
 const data = post.map((post)=>{return {
    postId: post.postId,
    userId: post.userId,
    nickname:post.username,
    title: post.title,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likes:post.likes
}
});
 res.json({data})
} catch{return res.status(400).json({message:"조회 실패"})}
});

//게시글 상세조회 API
router.get("/posts/:postid",async (req,res)=>{
    console.log("i'm posts")
    try{
    const {postid} = req.params;
    const post = await Post.findOne({where:{postId:postid}});
    const likes = await Post.findAll({where:{postId:postid}});
    console.log(likes.postId);
    const data = {
        "postId":post.postid,
        "userId":post.userId,
        "nickname":post.username,
        "title":post.title,
        "content":post.content,
        "createdAt":post.createdAt,
        "updatedAt":post.updatedAt,
        "likes":0
    };
    res.json({data});
    } catch{return res.status(400).json({"message":"존재하지 않는 게시글 입니다."})}
});

//게시글 수정 API
router.put("/posts/:postid",authMiddleware,async(req,res)=>{
    try{
    const {postid} = req.params
    const {title,content} = req.body;
    const post = await Post.findOne({where:{postId:postid}});
    if(post.userId !== res.locals.user.userId){
        return res.status(401).json({"message":"수정 권한이 없습니다."});
    }
    await Post.update({title:title, content:content,}, {where:{postId:postid}});
    res.json({"message":"게시글을 수정하였습니다."})
    } 
    catch{return res.status(400).json("400Error")}
});

//게시글 삭제 API
router.delete("/posts/:postid",authMiddleware,async(req,res)=>{
     try{
    const{postid} = req.params;
    const deletePost= await Post.findOne({where:{postId:postid}});
    if(deletePost.userId !== res.locals.user.userId){
        return res.status(401).json({"message":"삭제 권한이 없습니다."});
    }
    await Post.destroy({where:{postId:postid}});
    res.json({"message":"게시글을 삭제하였습니다."})
    }
    catch{return res.status(400).json("400Error")}
});

module.exports = router;
