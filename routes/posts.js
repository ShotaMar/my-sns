const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//投稿する
router.post('/', async(req, res) => {
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        return res.status(200).json(savedPost)

    }catch(err){
        return res.status(500).json(err)
    }
})

//投稿の編集
router.put('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body
            })
            return res.status(200).json('投稿を更新しました')

        }else{
            return res.status(403).json('他の人の投稿は変種できません')
        }

    }catch(err) {
        return res.status(500).json(err)
    }
})

//投稿の削除
router.delete('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            return res.status(200).json('投稿を削除しました')

        }else{
            return res.status(403).json('あなたの投稿以外は削除できません')
        }

    }catch(err) {
        return res.status(500).json(err)
    }
})

//投稿の取得
router.get('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post)

    }catch(err){
        return res.status(500).json(err)
    }
})

//投稿にいいねorいいねの解除をする
router.put('/:id/like', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)

        //投稿にいいねしていなければ
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push: { likes: req.body.userId }
            })
            return res.status(200).json('いいねしました')

        }else {
            //いいねしているユーザIDを取り除く
            await post.updateOne({
                $pull: { likes: req.body.userId }
            })
            return res.status(200).json('いいねをやめました')
        }
    }catch(err) {
        return res.status(500).json(err)
    }
})

//タイムラインの投稿を取得
router.get('/timeline/all', async(req, res) => {  //エンドポイント/timeline/allは上記記載の;idのgetとぶつかるので差別化するように記載する
    try{
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({ userId: currentUser._id }) //_id objectID
        //フォロー中の友達の投稿内容を全て取得する
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        return res.status(200).json([...userPosts, ...friendPosts])
    }catch(err){
        return res.status(500).json(err)
    }
})

module.exports = router