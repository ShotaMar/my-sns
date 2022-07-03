const router = require('express').Router()
const multer = require('multer')

//画像の保存先とファイル名を設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

//画像アップロード用のAPI
router.post('/', upload.single('file'), (req, res) => {
    try {

        return res.status(200).json('画像アップロードに成功しました')
    } catch (err) {
        console.log(err)
    }
})
module.exports = router