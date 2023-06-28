const _url = window.location.origin

const productId = thisProductMsg.variants[0].id
const productName = thisProductMsg.handle
console.log(thisProductMsg)

const urlParams = new URLSearchParams(window.location.search)

// 展示loading
const showLoading = (show) => {
  if (show) {
    $('#tl-loading').css({ display: 'flex' })
  } else {
    $('#tl-loading').css({ display: 'none' })
  }
}
showLoading(false)

// 显示页面刷新
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    window.location.reload()
  }
})

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
  const template = urlParams.get('template') || 'code001'
  const code1 = urlParams.get('code1') || 'code001'
  const discount1 = urlParams.get('discount1') || 5
  const code2 = urlParams.get('code2') || 'code002'
  const discount2 = urlParams.get('discount2') || 15
  const code3 = urlParams.get('code3') || 'code003'
  const discount3 = urlParams.get('discount3') || 25
  // 弹窗等级
  // 默认 0 点击关闭，就关闭了，展示领取成功
  // 1 点击直接付款
  const tlPopupLevel = urlParams.get('tl') || '0'

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
    $('#top-box').css({ display: 'none' })
    window.location = `${_url}/discount/${code1}?${window.location.search.replace(
      '?',
      ''
    )}&redirect=/products/${productName}`
    if (template === 'discount') {
      setUserJourney('first')
    } else if (template === 'discount2') {
      setUserJourney('first2')
    }
  })

  // 设置逻辑
  function showApplied(str, color1, color2) {
    $('#tip').css({
      display: 'block'
    })
    $('#tip #msg').css({
      backgroundImage: `linear-gradient(to right top, ${color1}, ${color2}`
    })
    $('#msg').append(`<div style="font-size: 15px;">${str}</div>`)
    setTimeout(() => {
      $('#tip').css({ display: 'none' })
      overflowHidden(false)
    }, 1200)
  }

  // 判断数组中是否只有 loaded
  function checkArrLoaded() {
    const res = userJourney.filter((e) => e !== 'loaded')
    return res.length
  }

  // 第一次进来
  if (userJourney.length === 0 || checkArrLoaded() === 0) {
    // 写上第一次的参数
    if (template === 'discount') {
      $('#top-box').html('')
      $('#top-box').css({ display: 'block', background: 'rgba(0, 0, 0, 0)' })
      var scrollHandler = function () {
        window.location = `${_url}/discount/${code1}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('first')
        $(window).off('scroll', scrollHandler) //解除bind事件
      }
      $(window).scroll(scrollHandler) //bind事件
    } else if (template === 'discount2') {
      $('.tl-discount-percent').text(discount1 + '% OFF!')
      $('.tl-discount-percent2').text('Enjoy ' + discount1 + '% OFF!')
      // 禁止滑动
      overflowHidden(true)
      // 展示首次折扣
      $('#top-box').css({ display: 'block' })
    } else if (template === 'discount3') {
      $('#tl-off-box').css({ display: 'flex' })
      $('.tl-close').click(() => {
        $('#tl-off-box').css({ display: 'none' })
        showLoading(true)
        window.location = `${_url}/discount/0?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('first')
        showLoading(true)
      })
    }
  }
  // 领取成功
  else if (userJourney[0] === 'first2') {
    showApplied(
      'Automatically Applied at Checkout!',
      'rgb(243, 119, 53))',
      'rgb(253, 200, 48)'
    )
  }
  // 领取成功
  else if (userJourney[0] === 'two2') {
    showApplied(
      'Automatically Applied at Checkout!',
      'rgb(253, 200, 48)',
      'rgb(243, 119, 53)'
    )
  } else if (userJourney[0] === 'two3') {
    showApplied(
      'Automatically Applied at Checkout!',
      'rgb(235, 51, 73)',
      'rgb(244, 92, 67)'
    )
  } else if (userJourney[0] === 'void') {
  }
  // 第三次
  else if (
    userJourney.includes('two') ||
    userJourney.includes('two2') ||
    userJourney.includes('two3') ||
    (userJourney.includes('void') &&
      userJourney[0] === 'loaded' &&
      userJourney.join().includes('two'))
  ) {
    // 先清空click
    $('#top-box').unbind()

    // 样式
    if (template == 'discount' || template == 'discount3') {
      $('#log-box').css({
        backgroundImage: 'linear-gradient(to top, #240b36, #c31432)'
      })
      $('#tl-title').css({
        display: 'none'
      })
      $('.tl-discount-percent').text(`$${discount3} Treat`)
      $('#tl-msg').html(`
        <span style="white-space: pre-line;padding: 8px;">A Special Treat,\nJust For You, On Us! </span>     
      `)
      $('#tl-final-discount').css({
        display: 'block',
        borderRadius: '30px',
        marginTop: '26px'
      })
      $('.tl-final-discount-percent').text('$' + discount3)
      $('#log').css({ height: '317px' })
      $('#tl-msg').css({
        padding: 0,
        lineHeight: '35px',
        fontSize: '25px',
        paddingBottom: '15px',
        paddingTop: '40px'
      })
      $('#tl-btn').css({
        backgroundColor: 'red',
        marginTop: '56px'
      })
      $('.tl-discount-percent2').text('Claim Now')
    } else if (template == 'discount2') {
      $('#log-box').css({
        backgroundImage: 'linear-gradient(to right top, #eb3349, #f45c43)'
      })
      $('#tl-title').html('WAIT!')
      $('.tl-final-discount-percent').text(discount3 + '% OFF!')
      $('#tl-msg').css({
        marginTop: '-10px',
        padding: '20px',
        lineHeight: '25px'
      })
      $('#tl-msg').html(
        `Seize the Opportunity!
        <br/>
        <span style="font-size:18px">Limited Time Offer, Maximum Savings!</span>`
      )
      $('#tl-btn').css({
        backgroundColor: '#95376f',
        marginTop: '100px',
        fontSize: '16px'
      })
      $('#tl-btn').html(`Act Now and Save!`)
      $('#log').css({ height: '365px' })
      $('#tl-final-discount').css({ display: 'block' })
    }

    if (tlPopupLevel == '0') {
      const skip = () => {
        $('#top-box').fadeOut('fast')
        // 展示领取成功
        window.location = `${_url}/discount/${code3}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('two3')
        $('#top-box').css({ display: 'none' })
      }
      $('.tl-close').click(skip)
      $('#tl-btn').click(skip)
    } else if (tlPopupLevel == '1') {
      $('.tl-close').click(() => {
        // 展示领取成功
        window.location = `${_url}/discount/${code3}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('void')
        $('#top-box').css({ display: 'none' })
        showLoading(true)
      })
      $('#tl-btn').click((e) => {
        showLoading(true)
        $('#top-box').css({ display: 'none' })
        window.location = `${_url}/cart/${productId}:1?discount=${code3}`
      })
    }
    // 最后展示弹窗效果
    $('#top-box').css({ display: 'block' })
  }
  // 第二次
  else if (userJourney[0] === 'loaded' && userJourney.includes('first')) {
    // 先清空click
    $('#top-box').unbind()

    if (template == 'discount' || template == 'discount3') {
      $('#tl-title').css({
        paddingTop: '20px'
      })
      $('#log-box').css({
        backgroundImage: 'linear-gradient(to TOP, rgb(0,0,139), #373b44)'
      })
      $('.tl-discount-percent').text(`Your $${discount2} Gift`)
      $('#tl-msg').html(`
      <span style="white-space: pre-line;">Feeling Lucky Today?\nGrab This!</span>
      `)
      $('#tl-msg').css({
        padding: 0,
        fontSize: '25px',
        lineHeight: '35px',
        color: 'rgb(192, 192, 192)'
      })
      $('.tl-discount-percent2').text('Claim Now')
      $('#tl-btn').css({
        backgroundColor: 'red'
      })
    } else if (template == 'discount2') {
      $('#tl-btn').css({
        backgroundColor: '#7aa83b'
      })
      $('#tl-msg').css({
        fontSize: '27px'
      })
      $('#log-box').css({
        backgroundImage: 'linear-gradient(to right top, #fdc830, #f37735)'
      })
      $('.tl-discount-percent').text(discount2 + '% OFF!')
      $('.tl-discount-percent2').text('Enjoy ' + discount2 + '% OFF!')
    }

    if (tlPopupLevel == '0') {
      const skip = () => {
        $('#top-box').fadeOut('fast')
        // 展示领取成功
        window.location = `${_url}/discount/${code2}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('two2')
        $('#top-box').css({ display: 'none' })
      }
      $('.tl-close').click(skip)
      $('#tl-btn').click(skip)
    } else if (tlPopupLevel == '1') {
      $('.tl-close').click(() => {
        window.location = `${_url}/discount/0?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('void')
        $('#top-box').css({ display: 'none' })
      })
      $('#tl-btn').click((e) => {
        showLoading(true)
        setUserJourney('two')
        window.location = `${_url}/cart/${productId}:1?discount=${code2}`
        $('#top-box').css({ display: 'none' })
      })
    }
    // 最后展示弹窗效果
    $('#top-box').css({ display: 'block' })
  }

  setUserJourney('loaded')
}
