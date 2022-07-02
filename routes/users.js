const router = require('express').Router()
const User = require('../models/User')

//CRUD
//ユーザ情報の更新
router.put('/:id', async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body, //$set は全てのプロパティを更新するという意味
            })
            res.status(200).json('ユーザー情報が更新されました')
        }catch(err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json('自分のアカウントの時だけ情報を更新できます')
    }
})

//ユーザ情報の削除
router.delete('/:id', async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('ユーザー情報が削除されました')
        }catch(err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json('自分のアカウントの時だけ情報を削除できます')
    }
})

//クエリでユーザ情報の取得
router.get('/', async(req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try{
        const user = userId 
            ? await User.findById(userId) 
            : await User.findOne({ username: username })

        const { password, updatedAt, ...others } = user._doc //_docは全てのプロパティ toJSON()と≒
        return res.status(200).json(others)
    }catch(err) {
        return res.status(500).json(err)
    }
})

//ユーザのフォロー
router.put('/:id/follow', async (req, res) => {
    if(req.body.userId != req.params.id){
        try{
            const targetUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            //フォローしたい相手のフォロワーに自身がいなければ
            if(!targetUser.followers.includes(req.body.userId)){
                await targetUser.updateOne({
                    $push: { followers: req.body.userId } //$push スキーマの配列に追加
                })
                await currentUser.updateOne({
                    $push: { followings: req.params.id }
                })
                return res.status(200).json('フォローしました')
            } else {
                return res.status(403).json('あなたはすでにこのユーザをフォローしています')
            }
        }catch(err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(500).json('自分自身はフォローできません')
    }
})

//ユーザのフォロー解除
router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId != req.params.id){
        try{
            const targetUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            //フォローしたい相手のフォロワーに自身が存在していれば
            if(targetUser.followers.includes(req.body.userId)){
                await targetUser.updateOne({
                    $pull: { followers: req.body.userId } //$pull スキーマの配列から取り除く
                })
                await currentUser.updateOne({
                    $pull: { followings: req.params.id }
                })
                return res.status(200).json('フォロー解除しました')
            } else {
                return res.status(403).json('あなたはこのユーザをフォローしていません')
            }
        }catch(err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(500).json('自分自身はフォロー解除できません')
    }
})

module.exports = router