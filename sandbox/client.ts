import txios from '../src/index'

const map = {
  test
}

Object.keys(map).forEach(el => {
  document.querySelector(`#${el}`).addEventListener('click', map[el])
})

function test () {
  txios('/say').then(res => {
    console.log(res)
  })
}

