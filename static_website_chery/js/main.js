function closeWin(){
    window.hostApp.dismissWindow()
    window.hostApp.clickSound()
}
$(function() {
    var txt = 'https://m.kaikaibao.com.cn/m2/?#/changjing-m/' + location.hash.split('/').slice(-2).join('/');
    // if (window.devicePixelRatio == 1.5) {
        // $('#qrcode').css('width', '160px');
        $('#qrcode').qrcode({width: 265, height: 265, text: txt});
    // } else {
    //     $('#qrcode').qrcode({width: 200, height: 200, text: txt});
    // }

    $('#buy').click(function () {
        location.href = './form.html' + '#/changjing/' + location.hash.split('/').slice(-2).join('/');
    })
});