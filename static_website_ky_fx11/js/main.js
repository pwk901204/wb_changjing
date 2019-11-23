$(function() {
    var ids = location.hash.split('/').slice(-2);
    var txt = 'https://m.kaikaibao.com.cn/m2/?#/changjing-m/' + ids.join('/');
    $('#qrcode').qrcode({ width: 250, height: 250, text: txt });

    $('#buy').click(function () {
        location.href = './form.html' + '#/changjing/' + ids.join('/');
    })

    if (!ids[0] || !ids[1]) {
        return $.modal("<div class='tipMsg'>渠道号或设备号缺失</div>", {
            close: false,
            onShow: function (dialog) {
                setTimeout(function() {
                    $.modal.close();
                }, 2000);
            }
        });
    }
});