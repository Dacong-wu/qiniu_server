const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const { customAlphabet } = require('nanoid')
const nanoid12 = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)
const qiniu = require('@/middlewares/qiniu')
module.exports = function upload(options) {
  /*
	options:{
    path:'⭐️',string 上传文件保存到七牛云中的路径
		type:['png', 'jpeg'],array 上传文件的类型
		size:10,number 上传文件单个文件的大小限制（M单位）
		fileNumber:1,number 上传文件的总体数量限制
	}
	*/
  return async (ctx, next) => {
    var opt = {
      uploadPath: typeof options.path === 'string' ? options.path : '⭐️', //上传后保存的文件夹
      uploadType: options.type instanceof Array ? options.type : ['png', 'jpeg'], //上传文件的类型
      uploadSize: typeof options.size === 'number' ? options.size : 10, //上传文件单个文件的大小限制（M单位）
      uploadFileNumber: typeof options.fileNumber === 'number' ? options.fileNumber : 1 //上传文件的总体数量限制
    }
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        var dPath = path.resolve(`static`)
        if (!fs.existsSync(dPath)) {
          fs.mkdirSync(dPath, { recursive: true })
        }
        cb(null, dPath)
      },
      filename: function (req, file, cb) {
        file.originalname = decodeURI(file.originalname)
        var newName = nanoid12() + '.' + mime.extension(file.mimetype)
        file.localpath = `${opt.uploadPath}/${newName}`
        cb(null, newName)
      }
    })
    var fileFilter = function (req, file, cb) {
      if (opt.uploadType.indexOf(mime.extension(file.mimetype)) != -1) {
        cb(null, true)
      } else {
        cb(new Error('文件格式错误'))
      }
    }
    var limits = {
      fileSize: opt.uploadSize * 1024 * 1024
    }
    var uploads = multer({
      storage,
      limits,
      fileFilter
    }).fields([
      {
        name: 'file',
        maxCount: opt.uploadFileNumber
      }
    ])
    return new Promise((resolve, reject) => {
      uploads(ctx.req, ctx.res, err => {
        err ? reject(err) : resolve(ctx)
      })
    })
      .then(async () => {
        await qiniu(ctx, next)
      })
      .catch(err => {
        throw err
      })
  }
}
