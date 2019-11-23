// initViewport()

function initViewport() {
    var dpr = window.devicePixelRatio
    var scale = 1 / dpr

    if (scale !== 1) {
        var viewport = document.querySelector('meta[name="viewport"]')
        viewport.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale='+ scale +',maximum-scale='+ scale +',minimum-scale='+ scale +',viewport-fit=cover')
    }
}

function closeWin() {
  var native = window.hostApp

  if (native && native.dismissWindow) {
      native.dismissWindow()
      native.clickSound && native.clickSound()
  } else {
      $.modal('<div class="tipMsg">无法关闭应用</div>', {
          close: false,
          onShow: function() {
              setTimeout(function () {
                  $.modal.close()
              }, 2000)
          }
      })
  }
}
