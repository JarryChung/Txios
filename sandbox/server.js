const Koa = require('koa')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const serve = require('koa-static')
const route = require('koa-route')
const webpackConfig = require('./webpack.config')

const app = new Koa()
const compiler = webpack(webpackConfig)

const home = serve(path.join(__dirname))
const hello = ctx => {
  ctx.response.body = {a: 1};
}

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(webpackHotMiddleware(compiler))

app.use(home)
app.use(route.get('/say', hello))

const port = process.env.PORT || 8899
app.listen(port)
