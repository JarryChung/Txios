import txios, { TxiosTransformer, Canceler } from '../src/index'
import qs from 'qs'

const map = {
  simple_params_get: simpleParamsGet,
  simple_path_get: simpleHashGet,
  simple_data_post: simpleDataPost,
  simple_response_type_post: simpleResponseTypePost,
  error_get: errorGet,
  interceptor_post: interceptorPost,
  config_post: configPost,
  cancel_get: cancelGet
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

function errorGet () {
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

function interceptorPost () {
  txios.interceptors.request.use(config => {
    config.headers.test += '/111'
    return config
  })
  txios.interceptors.request.use(config => {
    config.headers.test += '/222'
    return config
  })
  txios.interceptors.request.use(config => {
    config.headers.test += '/333'
    return config
  })
  txios.interceptors.response.use(res => {
    res.data.data.good += '/111'
    return res
  })
  const id = txios.interceptors.response.use(res => {
    res.data.data.good += '/222'
    return res
  })
  txios.interceptors.response.use(res => {
    res.data.data.good += '/333'
    return res
  })
  txios.interceptors.response.eject(id)
  txios({
    url: '/interceptor_post',
    method: 'post',
    headers: { test: 'headers000' },
    data: { good: 'data000' }
  }).then(res => {
    console.log(res)
  })
}

function configPost () {
  const transformRequestList = [(function(data) {
    return qs.stringify(data)
  }), ...(txios.defaults.transformRequest as TxiosTransformer[])]
  const transformResponseList = [...(txios.defaults.transformResponse as TxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
  txios.defaults.headers.common['test2'] = 'test222222'
  txios({
    transformRequest: transformRequestList,
    transformResponse: transformResponseList,
    url: '/config_post',
    method: 'post',
    data: { by: 'txios.create' },
    headers: { test1: 'test111111' }
  }).then((res) => {
    console.log('txios.create', res)
  })

  const instance = txios.create({
    transformRequest: transformRequestList,
    transformResponse: transformResponseList
  })
  instance({
    url: '/config_post',
    method: 'post',
    data: { by: 'txios' }
  }).then((res) => {
    console.log('txios', res)
  })
}

function cancelGet () {
  const CancelToken = txios.CancelToken
  const source = CancelToken.source()

  txios.get('/cancel_get', {
    cancelToken: source.token
  }).catch(function(e) {
    if (txios.isCancel(e)) {
      console.log('Request canceled', e.message)
    }
  })

  setTimeout(() => {
    source.cancel('Operation canceled by the user.')

    txios.get('/cancel_get', { cancelToken: source.token }).catch(function(e) {
      if (txios.isCancel(e)) {
        console.log(e.message)
      }
    })
  }, 100)

  let cancel: Canceler

  txios.get('/cancel_get', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  }).catch(function(e) {
    if (txios.isCancel(e)) {
      console.log('Request canceled')
    }
  })

  setTimeout(() => {
    cancel()
  }, 1500)
}

// 上传与下载
const progressInstance = txios.create()
const update = (e: ProgressEvent) => { console.log(`progress: ${e.loaded}/${e.total}`) }
progressInstance.defaults.onDownloadProgress = update
progressInstance.defaults.onUploadProgress = update

const uploadFile = () => {
  const data = new FormData()
  const fileEl = document.getElementById('progress_upload_file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    progressInstance.post('/progress_upload_post', data)
  }
}
const uploadEl = document.getElementById('progress_upload_post')
uploadEl!.addEventListener('click', uploadFile)

const getImg = () => {
  progressInstance.get('http://5b0988e595225.cdn.sohucs.com/images/20181006/126c54653b60423298fb30cba80e9165.jpeg')
}
const downloadEl = document.getElementById('progress_download_get')
downloadEl!.addEventListener('click', getImg)
