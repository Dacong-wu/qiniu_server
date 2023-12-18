const router = require('koa-router')()
const upload = require('@/middlewares/upload')

router.post(
  '/avatar',
  upload({
    path:'wxapp',
    size: 10,
    filenumber: 1
  }),
  async ctx => {
    ctx.body = {
      code: 1,
      message: ctx.qiniu
    }
  }
)

router.post(
  '/static',
  upload({
    size: 12,
    filenumber: 1
  }),
  async ctx => {
    ctx.body = {
      code: 1,
      message: ctx.qiniu
    }
  }
)


module.exports = router.routes()
