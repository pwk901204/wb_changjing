$(function() {
    var flag = true;
    var paymethod = 'wx_pub_qr';
    var ids = location.hash.split('/').slice(-2);

    $('#qrcode').qrcode({width: 150, height: 150, text: 'https://m.kaikaibao.com.cn'});

    apply_payment(paymethod);

    function apply_payment(paymethod) {
        $.ajax('http://m.kaikaibao.com.cn/api/event/weather/payment', {
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
                $('#qrcode').qrcode({width: 150, height: 150, text: res.data.link});
                setInterval(function () {
                    $.ajax('http://m.kaikaibao.com.cn/api/event/weather/checkpaid', {
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
                            location.href = './done.html';
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
        paymethod = $(this).data('paymethod');
        apply_payment(paymethod);
        $(this).siblings().each(function (idx, el) {
            $(el).removeClass('active')
        });
        $(this).addClass('active');
    })
});