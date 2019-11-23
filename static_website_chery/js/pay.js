function closeWin(){
 // 退出应用的能力
 hostApp.dismissWindow()
}
$(function() {
    var flag = true;
    var btn_disabled = false;
    var paymethod = 'wx_pub_qr';
    var ids = location.hash.substring(location.hash.indexOf('?'), -1).split('/').slice(-2);

    $('#qrcode').qrcode({width: 300, height: 300, text: 'https://m.kaikaibao.com.cn'});

    apply_payment(paymethod);

    function apply_payment(paymethod) {
        btn_disabled = true;
        $.ajax('//m.kaikaibao.com.cn/api/event/zijia/payment', {
            method: 'POST',
            dataType: 'json',
            headers: {
                'x-from': 'rvm',
                'x-brand': ids[0],
                'x-imei': ids[1]
            },
            data: {
                'method': paymethod
            }
        }).done(function (res, textStatus, jqXHR) {
            if (res.success) {
                $('#price').html(res.data.price + '<span>元</span>');
                $('#qrcode').html('');
                $('#qrcode').qrcode({width: 300, height: 300, text: res.data.link});
                btn_disabled = false;
                setInterval(function () {
                    $.ajax('//m.kaikaibao.com.cn/api/event/zijia/checkpaid', {
                        method: 'POST',
                        dataType: 'json',
                        headers: {
                            'x-from': 'rvm',
                            'x-brand': ids[0],
                            'x-imei': ids[1]
                        },
                        data: {
                            'trade_no': res.data.trade_no
                        }
                    }).done(function (res, textStatus, jqXHR) {
                        if (res.data.done) {
                            location.href = './done.html#/changjing/' + ids[0] + '/' + ids[1];
                        }
                    })
                }, 5000);
            }
        }).fail(function (res, textStatus, errorThrown) {
            console.log(arguments);
        }).catch(function () {
            console.log(arguments);
        })
    }

    $('.paymethods > div').click(function () {
        if (!btn_disabled) {
            paymethod = $(this).data('paymethod');
            apply_payment(paymethod);
            $(this).siblings().each(function (idx, el) {
                $(el).removeClass('active')
            });
            $(this).addClass('active');
        }
    })
});
