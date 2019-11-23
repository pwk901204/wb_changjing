$(function() {
    var product = 1;
    var flag = true;

    var h = document.body.scrollHeight;

    window.onresize = function () {
        if (document.body.scrollHeight < h) {
            document.body.scrollHeight = h;
        }
    }

    var default_settings = {
        close: false,
        onShow: function (dialog) {
            setTimeout(function () {
                $.modal.close();
            }, 1000);
        }
    };

    var ids = location.hash.split('?')[0].split('/').slice(-2);

    function get_query_array(query) {
        var obj = {},
            qPos = query.indexOf("?"),
            tokens = query.substr(qPos + 1).split('&'),
            i = tokens.length - 1;
        if (qPos !== -1 || query.indexOf("=") !== -1) {
            for (; i >= 0; i--) {
                var s = tokens[i].split('=');
                obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
            };
        }
        return obj;
    }

    var queries = get_query_array(location.hash)
    for (k in queries) {
        $('#'+k).val(queries[k])
    }

    function refresh() {
        if (flag) {
            $('button.buy').removeAttr('disabled').removeClass('disabled');
        } else {
            $('button.buy').addClass('disabled');
        }
    }

    var errors = [];
    var lang = {};
    var conf = {
        errorElementClass: 'error',
        errorMessagePosition: false,
        onElementValidate : function(valid, $el, $form, errorMess) {
            if( !valid ) {
                errors.push({el: $el, error: errorMess});
            }
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
        $.modal('<iframe src="./terms.html" height="520" width="940" style="border:0">', {
            dataId: 'termsbox',
            minWidth: 940,
            minHeight: 520,
            overlayClose: true
        });
        return false;
    })
    $('#conditions').click(function () {
        $.modal('<iframe src="./conditions.html" height="520" width="940" style="border:0">', {
            dataId: 'termsbox',
            overlayClose: true,
            minWidth: 940,
            minHeight: 520,
        });
        return false;
    })
    $('.buy').click(function () {
        if (!flag) {
            $.modal("<div><h1>请勾选阅读《投保须知》和《保险条款》</h1></div>", default_settings);
            return false
        }

        if ($("#form").isValid(lang, conf, false)) {
            $.ajax('//m.kaikaibao.com.cn/api/event/zijia', {
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
                    location.href = './pay.html#/changjing/' + location.hash.split('/').slice(-2).join('/');
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
            var msg = '';
            if (errors.length >= 3) {
                msg = '请填写正确的投保信息'
            } else {
                switch( errors[0].el[0].id ) {
                    case 'mobile':
                        msg = '请填写正确的手机号码'
                        break;
                    case 'licenseno':
                        msg = '请填写正确的车牌号'
                        break;
                    case 'name':
                        msg = '请填写正确的投保人姓名'
                        break;
                    case 'idcard':
                        msg = '请填写正确的身份证号'
                        break;
                    default:
                        msg = ''
                }
            }
            errors = []
            $.modal("<div><h1>" + msg + "</h1></div>", default_settings);
        }
    })
});