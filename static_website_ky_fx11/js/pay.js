$(function() {
    var flag = true;
    var btn_disabled = false;
    var paymethod = 'wx_pub_qr';
    var ids = location.hash.split('/').slice(-2);

    var default_settings = {
        close: false,
        onShow: function (dialog) {
            setTimeout(function () {
                $.modal.close();
            }, 1000);
        }
    };

    $('#qrcode').qrcode({width: 316, height: 316, text: 'https://m.kaikaibao.com.cn'});

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
                $('#price').html(res.data.price);
                $('#qrcode').html('');
                $('#qrcode').qrcode({ width: 316, height: 316,  text: res.data.link });
                $('#product').html(res.data.charge.subject)
                $('#tradeno').html(res.data.trade_no)
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
            // $.modal("<div class='tipMsg'>支付方式切换失败，请稍后再试。</div>", default_settings);
        }).catch(function () {
            console.log(arguments);
        })
    }

    $('.action-btn').click(function () {
      if (true || !btn_disabled && !$(this).hasClass('action-active')) {
        paymethod = $(this).data('paymethod');
        apply_payment(paymethod);
        $(this).siblings().removeClass('action-active');
        $(this).addClass('action-active');
      }
    })
});
