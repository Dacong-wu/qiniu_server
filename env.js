const envInfo = {
  APP_NAME: 'AppServer Online 七牛图库&文件🌵',
  NODE_ENV: 'production', // 环境名称
  BASE_API: process.env.BASE_API, // CDN访问域名
  BASE_PORT: process.env.BASE_PORT, // 监听端口
  QINIU_ACCESS_KEY: process.env.QINIU_ACCESS_KEY, // 七牛云AC
  QINIU_SECRET_KEY: process.env.QINIU_SECRET_KEY, // 七牛云SK
  QINIU_BUCKET_NAME: process.env.QINIU_BUCKET_NAME // 七牛云空间名称
}
const envData = envInfo
module.exports = { envData }
