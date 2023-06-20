const _url = window.location.origin

const productId = thisProductMsg.variants[0].id
const productName = thisProductMsg.handle
console.log(thisProductMsg)

const urlParams = new URLSearchParams(window.location.search)

// 显示页面刷新
window.addEventListener('pageshow', function () {
  if (sessionStorage.getItem('Refresh') == 'true' && urlParams.get('code1')) {
    window.location.reload()
  }
})
sessionStorage.setItem('Refresh', 'false')

// 监听表单提交事件
setTimeout(() => {
  var forms = document.querySelectorAll('form')
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var action = form.getAttribute('action')
      console.log('提交的 action:', action)
      if (action === '/cart/add') {
        setUserJourney('cartAdd')
      }
    })
  })
}, 1000)

const overflowHidden = (type) => {
  if (type) {
    $('body').css({ overflow: 'hidden' })
  } else {
    $('body').css({ overflow: 'auto' })
  }
}

if (urlParams.get('show')) {
  // 获取geturl参数
  // 初始化参数
  const code1 = urlParams.get('code1') || 'code001'
  const discount1 = urlParams.get('discount1') || 5
  const code2 = urlParams.get('code2') || 'code002'
  const discount2 = urlParams.get('discount2') || 15
  const code3 = urlParams.get('code3') || 'code003'
  const discount3 = urlParams.get('discount3') || 25

  // 添加路径
  const setUserJourney = (name) => {
    if (urlParams.get('show')) {
      const arr = JSON.parse(sessionStorage.getItem('userJourney')) || []
      arr.unshift(name)
      sessionStorage.setItem('userJourney', JSON.stringify(arr))
    }
  }

  // 获取路径
  const getUserJourney = () => {
    return JSON.parse(sessionStorage.getItem('userJourney')) || []
  }
  let userJourney = getUserJourney()
  console.log('userJourney', userJourney)

  $('#top-box').click((e) => {
    setTimeout(() => {
      $('#top-box').css({ display: 'none' })
    }, 1000)
    window.location = `${_url}/discount/${code1}?show=1&redirect=/products/${productName}`
    sessionStorage.setItem('Refresh', 'true')
    setUserJourney('first')
  })

  // 写上第一次的参数
  $('.tl_discount_percent').text(discount1)

  // 第一次进来
  if (userJourney.length === 0 && urlParams.get('show')) {
    // 禁止滑动
    overflowHidden(true)
    // 展示首次折扣
    $('#top-box').css({ display: 'block' })
  }

  // 设置逻辑
  // 第一次
  if (userJourney[0] === 'first') {
    $('#tip').css({ display: 'block' })
    $('#msg').append(
      '<div style="font-size: 25px;">Instantly claimed!</div><div style="font-size: 15px;"> Discount automatically applied at checkout.</div>'
    )
    sessionStorage.setItem('Refresh', 'true')
    setTimeout(() => {
      $('#tip').css({ display: 'none' })
      overflowHidden(false)
    }, 1200)
  }
  // 第三次
  else if (userJourney.includes('two')) {
    $('#top-box').css({ display: 'block' })
    $('#log-box').css({
      backgroundImage: 'linear-gradient(to right top, #eb3349, #f45c43)'
    })
    $('#tl_btn').css({
      backgroundImage: 'linear-gradient(to right top, #eb3349, #f45c43)',
      marginTop: '90px'
    })
    $('.tl_final_discount_percent').text(discount3)
    $('#tl_title').html('WAIT!')
    $('#tl_msg').css({ marginTop: '-10px' })
    $('#tl_msg').html(
      `This exclusive offer is available for today only, so don't miss out!`
    )
    $('#tl_btn').html(`GET FINAL DISCOUNT!`)
    $('#log').css({ height: '360px' })
    $('#tl_final_discount').css({ display: 'block' })
    $('#top-box').click((e) => {
      setUserJourney('two')
      window.location = `${_url}/cart/${productId}:1?discount=${code3}`
      sessionStorage.setItem('Refresh', 'true')
    })
  }
  // 第二次
  else if (userJourney[0] === 'loaded') {
    $('#top-box').css({ display: 'block' })
    $('#log-box').css({
      backgroundImage: 'linear-gradient(to right top, #fdc830, #f37735)'
    })
    $('#tl_btn').css({
      backgroundImage: 'linear-gradient(to right top, #fdc830, #f37735)'
    })
    $('.tl_discount_percent').text(discount2)
    $('#top-box').click((e) => {
      setUserJourney('two')
      window.location = `${_url}/cart/${productId}:1?discount=${code2}`
      sessionStorage.setItem('Refresh', 'true')
    })
  }

  setUserJourney('loaded')
}
