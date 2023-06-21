const _url = window.location.origin

const productId = thisProductMsg.variants[0].id
const productName = thisProductMsg.handle
console.log(thisProductMsg)

const urlParams = new URLSearchParams(window.location.search)

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
    setTimeout(() => {
      $('#top-box').css({ display: 'none' })
    }, 1000)
    window.location = `${_url}/discount/${code1}?${window.location.search.replace(
      '?',
      ''
    )}&redirect=/products/${productName}`
    setUserJourney('first')
  })

  // 写上第一次的参数
  if (template == 'discount') {
    $('.tl_discount_percent').text('SAVE $' + discount1)
    $('.tl_discount_percent2').text('Enjoy $' + discount1 + ' in Savings!')
  } else if (template == 'discount2') {
    $('.tl_discount_percent').text(discount1 + '% OFF!')
    $('.tl_discount_percent2').text('Enjoy ' + discount1 + '% OFF!')
  }

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

  // 第一次进来
  if (userJourney.length === 0 && urlParams.get('show')) {
    // 禁止滑动
    overflowHidden(true)
    // 展示首次折扣
    $('#top-box').css({ display: 'block' })
  }
  // 领取成功
  else if (userJourney[0] === 'first') {
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
  }
  // 第三次
  else if (
    userJourney.includes('two') ||
    userJourney.includes('two2') ||
    userJourney.includes('two3')
  ) {
    // 先清空click
    $('#top-box').unbind()

    $('#top-box').css({ display: 'block' })
    $('#log-box').css({
      backgroundImage: 'linear-gradient(to right top, #eb3349, #f45c43)'
    })
    if (template == 'discount') {
      $('.tl_final_discount_percent').text('SAVE $' + discount3)
    } else if (template == 'discount2') {
      $('.tl_final_discount_percent').text(discount3 + '% OFF!')
    }
    $('#tl_title').html('WAIT!')
    $('#tl_msg').css({
      marginTop: '-10px',
      padding: '20px',
      lineHeight: '25px'
    })
    $('#tl_msg').html(
      `Seize the Opportunity!
      <br/>
      <span style="font-size:18px">Limited Time Offer, Maximum Savings!</span>`
    )
    $('#tl_btn').css({
      backgroundColor: '#95376f',
      marginTop: '100px',
      fontSize: '16px'
    })
    $('#tl_btn').html(`Act Now and Save!`)
    $('#log').css({ height: '365px' })
    $('#tl_final_discount').css({ display: 'block' })

    if (tlPopupLevel == '0') {
      function skip() {
        $('#top-box').fadeOut('fast')
        // 展示领取成功
        window.location = `${_url}/discount/${code3}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('two3')
      }
      $('#tl_log_close').click(skip)
      $('#tl_btn').click(skip)
    } else if (tlPopupLevel == '1') {
      $('#top-box').click((e) => {
        setUserJourney('two')
        window.location = `${_url}/cart/${productId}:1?discount=${code3}`
      })
    }
  }
  // 第二次
  else if (userJourney[0] === 'loaded') {
    // 先清空click
    $('#top-box').unbind()

    $('#top-box').css({ display: 'block' })
    $('#log-box').css({
      backgroundImage: 'linear-gradient(to right top, #fdc830, #f37735)'
    })
    $('#tl_btn').css({
      backgroundColor: '#7aa83b'
    })
    if (template == 'discount') {
      $('.tl_discount_percent').text('SAVE $' + discount2)
      $('.tl_discount_percent2').text('Enjoy $' + discount2 + ' in Savings!')
    } else if (template == 'discount2') {
      $('.tl_discount_percent').text(discount2 + '% OFF!')
      $('.tl_discount_percent2').text('Enjoy ' + discount2 + '% OFF!')
    }

    if (tlPopupLevel == '0') {
      function skip() {
        $('#top-box').fadeOut('fast')
        // 展示领取成功
        window.location = `${_url}/discount/${code2}?${window.location.search.replace(
          '?',
          ''
        )}&redirect=/products/${productName}`
        setUserJourney('two2')
      }
      $('#tl_log_close').click(skip)
      $('#tl_btn').click(skip)
    } else if (tlPopupLevel == '1') {
      $('#top-box').click((e) => {
        setUserJourney('two')
        window.location = `${_url}/cart/${productId}:1?discount=${code2}`
      })
    }
  }

  setUserJourney('loaded')
}
