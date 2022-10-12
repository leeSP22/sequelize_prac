const express = require('express');
const router = express.Router();
const { Post } = require("../models");
const { Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");



//좋아요 게시글 조회 API
router.get("/posts/like",authMiddleware,async(req,res)=>{
    try{
    const user = res.locals.user;
    const List = await Like.findAll({where:{userId:user.userId}});
    const find_p_id = List.map(row=>row.postId);
    let data = [];
    for (const item of find_p_id){
        const post = await Post.findOne({where:{postId:item}});
        result = {
            "postId":post.postId,
            "userId":post.userId,
            "nickname":post.username,
            "title":post.title,
            "content":post.content,
            "createdAt":post.createdAt,
            "updatedAt":post.updatedAt,
            "likes":post.likes
        }
        data.push(result);
    };
    data.sort((a,b)=>b.likes-a.likes);
    res.status(200).json({data})
    }catch{res.status(400).json("400Error")}
});


//종아요 수정API
router.put("/posts/:postId/like",authMiddleware,async(req,res)=>{
    try{
    const user = res.locals.user;
    const { postId } = req.params;
    const likeCheck = await Like.findOne({where:{userId:user.userId, postId:postId}})
    const findpost = await Post.findOne({where:{postId: postId}});
    if(findpost == null){
        return res.status(401).json({"message":"존재하지 않는 게시글 입니다."});
      };

    if(likeCheck == null){
        await Like.create({
            postId: postId,
            userId: user.userId,
            username: user.username
        });
        await Post.increment({likes: 1}, {where:{postId:postId}});
        res.status(200).json({"message":"게시글의 좋아요를 등록하였습니다!"});
    } else {
        await Post.increment({likes: -1}, {where:{postId:postId}});
        await Like.destroy({where:{userId:user.userId, postId:postId}});
        res.status(200).json({"message":"게시글의 좋아요를 삭제했습니다!"})
    };
} catch{res.status(400).json("400Error")}
});

module.exports = router;