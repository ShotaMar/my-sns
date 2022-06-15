const router = require('express').Router()
const Post = require('../models/Post')

//投稿する
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post)

    }catch(err){
        return res.status(500).json(err)
    }
})

//投稿にいいねorいいねの解除をする
router.put('/:id/like', async (req, res) => {
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

module.exports = router