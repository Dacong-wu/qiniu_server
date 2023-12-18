require('module-alias/register')
require('dotenv').config()
const Koa = require('koa')
const catchError = require('@/middlewares/catchError')
const router = require('@/router')
const { envData } = require('@/env')
const app = new Koa()

app.listen(envData.BASE_PORT, '0.0.0.0', function () {
  console.log(envData.APP_NAME)
})

app.use(catchError)
app.use(router.routes())
app.use(router.allowedMethods())
app.use(ctx => {
  ctx.redirect('https://ll1025.cn')
})
