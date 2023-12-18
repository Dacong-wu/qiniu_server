const router = require('koa-router')()
const upload = require('@/api/upload/index')

router.use('/upload', upload)
module.exports = router
