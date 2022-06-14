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
//ユーザ情報の取得


module.exports = router