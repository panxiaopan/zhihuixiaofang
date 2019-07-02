console.log('test')

async function test() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('in setTimeout')
      resolve('setTimeout test.js')
    }, 3000);
  })
}

test().then((res) => {
  console.log('then res', res)
})
