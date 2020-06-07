import txios from '../src/index'

const map = {
  simple_params_get: simpleParamsGet,
  simple_path_get: simpleHashGet,
  simple_data_post: simpleDataPost,
  simple_response_type_post: simpleResponseTypePost,
  error_get: ErrorGet
}

Object.keys(map).forEach(el => {
  document.querySelector(`#${el}`).addEventListener('click', map[el])
})

function simpleParamsGet () {
  const date = new Date()
  const params = { a: 1, b: 2, c: [1, 2], char: '@:$, ', no: null, date }
  txios.get('/simple_params_get', { params }).then(res => {
    console.log(res)
  })
}

function simpleHashGet () {
  txios.get('/simple_path_get#hash').then(res => {
    console.log(res)
  })
}

// TODO 以下两种类型的数据都会出现 headers['content-type'] = 'application/json; charset=utf-8' 的情况
function simpleDataPost () {
  const data1 = { a: 1, b: 2 }
  // const data = new Int32Array([21, 31]) // buffer 类型需要自行实现后台
  const paramsString = 'q=URLUtils.searchParams&topic=api'
  const data2 = new URLSearchParams(paramsString)
  txios.post('/simple_data_post', data1).then(res => {
    console.log('object', res)
  })
  txios.post('/simple_data_post', data2).then(res => {
    console.log('URLSearchParams', res)
  })
}

function simpleResponseTypePost () {
  const data = { a: 1 }
  txios.post('/simple_response_type_post', data).then(res => {
    console.log('no responsetype', res)
  })
  txios.post('/simple_response_type_post', data, { responsetype: 'json' }).then(res => {
    console.log('with responsetype', res)
  })
}

function ErrorGet () {
  txios.get('/error_get_no_this_path')
    .then(res => { console.log(res) })
    .catch(err => { console.log('url error', err) })
  txios.get('/error_get_with_timeout', { timeout: 2000 })
    .then(res => { console.log(res) })
    .catch(err => { console.log('timeout', err) })
  txios.get('/error_get_with_500')
    .then(res => { console.log(res) })
    .catch(err => { console.log('maybe 500', err) })
}
