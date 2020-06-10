const Koa = require('koa')
const path = require('path')
const atob = require('atob')
const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const serve = require('koa-static')
const route = require('koa-route')
const bodyParser = require('koa-bodyparser')
const webpackConfig = require('./webpack.config')

const app = new Koa()
const compiler = webpack(webpackConfig)

app.use(bodyParser())
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(webpackHotMiddleware(compiler))

const home = serve(path.join(__dirname))
app.use(home)

app.use(route.get('/simple_params_get', simpleParamsGet))
app.use(route.get('/simple_path_get', simplePathGet))
app.use(route.post('/simple_data_post', simpleDataPost))
app.use(route.post('/simple_response_type_post', simpleResponseTypePost))

app.use(route.get('/error_get_with_timeout', errorGetWithTimeout))
app.use(route.get('/error_get_with_500', errorGetWith500))

app.use(route.post('/interceptor_post', interceptorPost))

app.use(route.post('/config_post', configPost))

app.use(route.get('/cancel_get', cancelGet))

app.use(route.post('/progress_upload_post', progressUploadPost))

app.use(route.post('/auth_post', authPost))

const port = process.env.PORT || 8899
app.listen(port)

// 路由相关
function simpleParamsGet (ctx) {
  const query = ctx.request
  const params = query.url.split('?')[1] || null
  ctx.response.body = { params }
}

function simplePathGet (ctx) {
  ctx.response.body = { noHash: true }
}

function simpleDataPost (ctx) {
  ctx.response.body = { data: ctx.request.body }
}

function simpleResponseTypePost (ctx) {
  ctx.response.body = { data: ctx.request.body }
}

async function errorGetWithTimeout (ctx) {
  await new Promise((resolve) => {
    setTimeout(() => {
      ctx.response.body = { good: 'good news' }
      resolve()
    }, 3000)
  })
}

function errorGetWith500 (ctx) {
  if (Math.random() > 0.5) {
    ctx.response.body = { good: 'good news' }
  } else {
    ctx.status = 500
  }
}

function interceptorPost (ctx) {
  ctx.response.body = { data: ctx.request.body }
}

function configPost (ctx) {
  ctx.response.body = { data: ctx.request.body }
}

async function cancelGet (ctx) {
  await new Promise((resolve) => {
    setTimeout(() => {
      ctx.response.body = { good: 'good news' }
      resolve()
    }, 1000)
  })
}

function progressUploadPost (ctx) {
  // 补充后台处理上传文件逻辑
  ctx.response.body = { result: 'upload sucess!' }
}

function authPost (ctx) {
  const auth = ctx.request.headers.authorization
  const [type, credentials] = auth.split(' ')
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'JarryChung' && password === '1234567890') {
    ctx.response.body = ctx.request.body
  } else {
    ctx.status = 401
    ctx.response.body = 'UnAuthorization'
  }
}
