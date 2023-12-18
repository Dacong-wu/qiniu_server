const log4j = require('@/utils/log4j')

module.exports = async (ctx, next) => {
  try {
    var begin = Date.now()
    await next()
    var end = `${Date.now() - begin}ms`
    logInfo(ctx, end)
  } catch (err) {
    var end = `${Date.now() - begin}ms`
    logError(ctx, end, err)
    ctx.body = {
      code: 0,
      errcode: err.message ? err.message : ctx.url,
      message: '服务异常，请联系管理员'
    }
  }
}

//记录日志信息
function logInfo(ctx, time) {
  let method = ctx.method
  let data = {
    url: ctx.url
  }
  let info = formatInfo({ method, time, data })
  log4j.info(info)
}

//记录错误日志信息
function logError(ctx, time, err) {
  let method = ctx.method
  let data = {
    url: ctx.url,
    err_message: err.message,
    err_stack: err.stack
  }
  let info = formatInfo({ method, time, data })
  log4j.error(info)
}

function formatInfo(info) {
  const { method, time, data } = info
  let logs = `\nMethod:${method}\n`
  logs += `Time:${time}\n`
  const { url, err_stack } = data
  logs += `Url:${url}\n`
  if (err_stack) {
    logs += `Err_stack:${err_stack}\n`
  }
  return logs
}
