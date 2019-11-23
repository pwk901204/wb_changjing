$(function() {
    var product = 1;
    var flag = true;

    var default_settings =  {
        close: false,
        onShow: function (dialog) {
            setTimeout(function () {
                $.modal.close();
            }, 1000);
        }
    };

    var ids = location.hash.split('/').slice(-2);

    function refresh() {
        if (flag) {
            $('button.buy').removeAttr('disabled').removeClass('disabled');
        } else {
            $('button.buy').attr('disabled', 'disabled').addClass('disabled');
        }
    }
    $('.price > div').click(function () {
        product = $(this).data('product-id');
        $(this).siblings().each(function (idx, el) {
            $(el).removeClass('active')
        });
        $(this).addClass('active');
    })
    $.formUtils.addValidator({
        name : 'licenseno',
        validatorFunction : function(value, $el, config, language, $form) {
            return /^.{1}[a-zA-Z]{1}[-]?[a-zA-Z_0-9]{5,6}$/.test(value);
        },
    });
    $.formUtils.addValidator({
        name : 'idcard',
        validatorFunction : function(value, $el, config, language, $form) {
            return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[xX0-9]{1}$/.test(value);
        },
    });
    $.formUtils.addValidator({
        name : 'mobile',
        validatorFunction : function(value, $el, config, language, $form) {
            return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(value);
        },
    });
    $('.term_and_condition').click(function () {
        if (flag) {
            $(this).find('i').removeClass('checked');
            $(this).find('i').addClass('unchecked');
        } else {
            $(this).find('i').removeClass('unchecked');
            $(this).find('i').addClass('checked');
        }
        flag = !flag;
        refresh();
    })
    $('#licenseno').change(function () {
        $('#licenseno').val($('#licenseno').val().toUpperCase());
    });
    $('#terms').click(function () {
        $.modal('<iframe src="./terms.html" height="350" width="830" style="border:0">', {
            dataId: 'termsbox',
            overlayClose: true
        });
        return false;
    })
    $('#conditions').click(function () {
        $.modal('<iframe src="./conditions.html" height="350" width="830" style="border:0">', {
            dataId: 'termsbox',
            overlayClose: true
        });
        return false;
    })
    $('.buy').click(function () {
        if ($("#form").isValid({
            errorElementClass: 'error',
            errorMessagePosition: 'top'
        }, false)) {
            $.ajax('http://m.kaikaibao.com.cn/api/event/weather', {
                method: 'POST',
                dataType: 'json',
                headers: {
                    'x-from': 'rvm',
                    'x-brand': ids[0],
                    'x-imei': ids[1]
                },
                data: {
                    'license_no': $('#licenseno').val(),
                    'name': $('#name').val(),
                    'mobile': $('#mobile').val(),
                    'id_card': $('#idcard').val(),
                    'product': product,
                    'channel': 1
                }
            }).done(function (res, textStatus, jqXHR) {
                if (!res.success) {
                    $.modal("<div><h1>提交失败</h1></div>", default_settings);
                } else {
                    location.href = './pay.html#/weather/' + location.hash.split('/').slice(-2).join('/');
                }
            }).fail(function (res, textStatus, errorThrown) {
                if (res.status == 422) {
                    $.modal("<div><h1>请检查所有的输入项，身份证号码错误</h1></div>", default_settings);
                } else {

                }
            }).catch(function () {
                console.log(arguments);
            })
        } else {
            $.modal("<div><h1>请检查所有的输入项</h1></div>", default_settings);
        }
    })
});