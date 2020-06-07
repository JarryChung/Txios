import txios from '../src/index'

txios('/say').then(res => {
  console.log(res)
})
