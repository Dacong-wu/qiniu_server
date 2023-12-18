const fs = require('fs')
const qiniu = require('qiniu')
const { envData } = require('@/env')
const schedule = require('node-schedule')

var mac = new qiniu.auth.digest.Mac(envData.QINIU_ACCESS_KEY, envData.QINIU_SECRET_KEY)
var options = {
  scope: envData.QINIU_BUCKET_NAME, // 设置空间名称
  expires: 7200 // 设置凭证有效期
}
var putPolicy = new qiniu.rs.PutPolicy(options)
var uploadToken = putPolicy.uploadToken(mac) // 获取凭证
schedule.scheduleJob('0 0 * * * *', async () => {
  uploadToken = putPolicy.uploadToken(mac) // 定时刷新凭证
})
var config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_cn_east_2 // 设置存储区域，这个为华东-浙江2
var formUploader = new qiniu.form_up.FormUploader(config)
var putExtra = new qiniu.form_up.PutExtra()

module.exports = async (ctx, next) => {
  let files = ctx.req.files.file
  if (!files) {
    ctx.body = {
      code: 0,
      message: '没上传文件'
    }
    return
  }
  let urls = []
  for (let i = 0, len = files.length; i < len; i++) {
    let file = files[i]
    const key = file.localpath
    const readableStream = fs.createReadStream(file.path)
    let res = await uploadFile(key, readableStream)
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }
    urls.push(`${envData.BASE_API}/${res.key}`)
  }
  if (urls.length === 1) {
    ctx.qiniu = { type: 'str', url: urls[0] }
  } else {
    ctx.qiniu = { type: 'arr', url: urls }
  }
  await next()
}

function uploadFile(key, readableStream) {
  return new Promise((resolve, reject) => {
    formUploader.putStream(uploadToken, key, readableStream, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        resolve(respBody)
      } else {
        reject(new Error(respInfo.statusMessage))
      }
    })
  })
}
