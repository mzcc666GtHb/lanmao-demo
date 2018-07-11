//表单校验
var BHAFrom = {
    form: null,
    data: {cache: {}},//用来存放临时数据,各种状态
    config: {
        tiptype: function (msg, o, cssctl) {

            //msg：提示信息;
            //o:{obj:*,type:*,curform:*},
            //obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
            //type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态,
            //curform为当前form对象;
            //cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
            if (o.type == 2) {
                o.obj.parent().next('.inpPrompt').children('.erroTips').hide();
                if (o.obj.parent().next('.inpPrompt').find('.tips').length > 0
                    || o.obj.parent().next('.inpPrompt').find('.showPassword').length > 0
                    || o.obj.parent().next('.inpPrompt').find('.forgetPass ').length > 0
                ) {
                    return true;
                }
                o.obj.parent().next('.inpPrompt').css('padding', '0');
            }
            if (o.type == 3) {
                o.obj.parent().next('.inpPrompt').css('padding', '.3rem 0');
                o.obj.parent().next('.inpPrompt').children('.erroTips').show();
                o.obj.parent().next('.inpPrompt').children('.erroTips').html('<i class="icon icon-error"></i>' + msg);
            }
        },
        btnSubmit: "#nextButton",
        showAllError: true
    },
    ready: function (form) { // 初始化表单后的动作
    },
    init: function () {

        BHAFrom.form = $("#form").Validform(BHAFrom.config);
        BHAFrom.ready(BHAFrom.form);
    }
};

var timer = {
    btn: '',
    v: null,
    c: 60,
    enable: true,
    init: function (btn) {  //验证码计时初始化
        timer.btn = btn;
        return this;
    },
    start: function () {    //验证码计时开始
        if (timer.enable) {
            timer.enable = false;
            timer.v = setInterval(function () {
                timer.c--;
                if (timer.c < 0) {
                    timer.reset();
                    return;
                }
                $(timer.btn).removeClass("codeBtn").addClass('codeAgainBtn');
                $(timer.btn).val('重新发送 ' + timer.c + 's');
            }, 1000);
        }
    },
    reset: function () {    //验证码计时重置
        timer.c = 60;
        $(timer.btn).val('点击获取');
        $(timer.btn).removeClass("codeAgainBtn").addClass('codeBtn');
        clearInterval(timer.v);
        timer.enable = true;
    }
};


/**
 * 发送短信验证码
 * @param btn   绑定的按钮
 * @param authType  鉴权结果 三要素|四要素
 * @param authBizType   业务类型 注册|绑卡
 * @param isFirstTime   是否第一次进入页面 yes 是的
 */
var sms = {
    url: '',
    data: {},
    config: {
        authType: '',
        authBizType: '',
        isFirstTime: '',
        phone: ''
    },
    init: function (btn, config) {    //短信模块初始化
        sms.url = $('#contextPath').val() + '/gateway/sms/sms';
        sms.data.requestKey = config.requestKey;
        sms.data.bizType = config.bizType;
        if (config && config.smsChannel) {
            timer.init(btn).start();
            // 若四要素 ,发起申请接口已发短信 这里只给提示
            if (config.smsChannel == 'AUTH_CHANNEL') {
                sms.url = $('#contextPath').val() + '/gateway/sms/sendAuthValidateCode';
                sms.data.authId = config.authId;
                // 第一次进入页面上isFirstTime=yes ,不重发短信
                if (config.isFirstTime || config.isFirstTime == 'yes') {
                    resizeContainer();
                    if ($('.phone').length > 0) {
                        alert($('.phone').length);
                        window.alert('验证码已发送到' + $('.phone').text() + '手机，请您查收。');
                    } else if (config.phone) {
                        alert(config.phone);
                        window.alert('验证码已发送到' + config.phone + '手机，请您查收。');
                    }
                }
            } else {
                if (config.isFirstTime || config.isFirstTime == 'yes') {
                        timer.init(btn).start();
                        sendSmsCode(sms.url, sms.data);
                }
            }
        }
        $(btn).click(function () {
            if (!timer.enable) {
                return;
            }
            timer.init(btn).start();
            sendSmsCode(sms.url, sms.data);
        });

    }
};
/**
 * 对填写的手机号发送短信验证码
 * @param btn   绑定的按钮
 * @param smsChannel  发送短信通道
 * @param authBizType   业务类型 注册|绑卡
 * @param isFirstTime   是否第一次进入页面 yes 是的
 */
var smsForNewPhone = {
    url: '../../sms/smsForEnterprise',
    data: {},
    config: {
        phoneDom: '',
        smsCount: '',
    },
    init: function (btn, config) {    //短信模块初始化
        smsForNewPhone.data.requestKey = config.requestKey;
        smsForNewPhone.data.bizType = config.bizType;
        if (config.smsCount != '' && config.smsCount > 0) {
            timer.init(btn).start();
        }
        $(btn).click(function () {
            if (!timer.enable) {
                return;
            }
            if (timer.c <= 0) {
                timer.reset();
            }
            timer.init(btn).start();
            smsForNewPhone.data.mobile = $(config.phoneDom).val();
            sendSmsCode(smsForNewPhone.url, smsForNewPhone.data);
        });

    }
};

function sendSmsCode(url, _data) {
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: _data,
        success: function (returnedData) {
            if (returnedData.status == "FAILED") {
                if ($("#passwordType").val() != "Number") {
                    alert(returnedData.message);
                    timer.reset();
                }
                return;
            } else {
                /*console.log($("#passwordType").val());*/
                if ($("#passwordType").val() != "Number") {
                    alert(returnedData.message);
                }
                return;
            }
        },
        error: function (returnedData) {
            alert("抱歉，验证码发送失败，请重试。");
            timer.reset();
            return;
        }
    });
}

function initBankInfo(platformId, serviceType) {
    var contextPath = $('#contextPath').val();
    var url = contextPath + '/gateway/bankcard/bankInfo';
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {platformId: platformId, serviceType: serviceType, requestKey: $('#requestKey').val()},
        success: function (result) {
            if (result.success) {
                var bankInfo = result.bankInfo;
                var bankInfoHtml = '';
                for (var i = 0; i < bankInfo.length; i++) {
                    if (bankInfo[i].swiftPay) {
                        supportPay = '支持快捷、网银充值';
                    }
                    bankInfoHtml += '<li><span class="bankLogo"><img src="' + contextPath + '/resource/images/bank-sm/' + bankInfo[i].bankCode + '.png"> ' + bankInfo[i].bankName + '</span>' + supportPay + '</li>';
                }
                $('.bankList ul').html(bankInfoHtml);
            } else {
                $('.bankList ul').html(result.message);
            }
        },
        error: function (result) {
            $('.bankList ul').html('获取支持银行列表信息失败');
        }
    });
}

//中间container部分自适应屏幕
function resizeContainer() {
    var height_container = $(window).height() - 100;
    $(".container").css('min-height', height_container);
}

//弹窗
function xy() {
    var x = ($(window).width() - $("#alertLayer").width()) / 2;
    var y = ($(window).height() - $("#alertLayer").height()) / 2;
    $("#mask").height($(window).height());
    $("#alertLayer").animate({"left": "13%", "top": y}, 0);
}

function cd() {
    var c = ($(window).width() - $("#alertLayer_2").width()) / 2;
    var d = ($(window).height() - $("#alertLayer_2").height()) / 2;
    $("#mask").height($(window).height());
    $("#alertLayer_2 .layerRule div").css('height', $("#alertLayer_2").height() - 117);
    $("#alertLayer_2").animate({"left": "5%", "top": d}, 0);
}

var showDialogBottom = function () {
    $("#mask").css("height", $(document).height());
    $("#mask").css("width", $(document).width());
    $("#mask").show();
};
//覆写系统alert方法
window.alert = function (msg) {
    showDialogBottom();
    $("#alertLayer .layerTips").html(msg);
    $("#alertLayer").show();
    $("body").css("position", "fixed");
};

$(function () {
    BHAFrom.init();
    $('#forget').click(function () {
        var url = $('#contextPath').val() + '/gateway/mobile/resetPassword/reset';
        BHAFrom.form.ignore("input");
        $('#form').attr('action', url).submit();
    });
    //显示密码
    $('.showPassword').click(function () {
        var obj = $('.showPassword').children('i');
        if (obj.hasClass('icon-select')) {
            obj.removeClass('icon-select').addClass('icon-selected');
            $('#password').replaceWith('<input type="text" class="input-text" id="password" name="' + $('#password').attr('name') + '" value="' + $('#password').val() + '" datatype="*" placeholder="输入交易密码"/>');
        } else {
            obj.removeClass('icon-selected').addClass('icon-select');
            $('#password').replaceWith('<input type="password" class="input-text" id="password" name="' + $('#password').attr('name') + '" value="' + $('#password').val() + '" datatype="*" placeholder="输入交易密码"/>');
        }
    });
    $('.showNumberPassword').click(function () {
        var obj = $('.showNumberPassword').children('i');
        if (obj.hasClass('icon-select')) {
            obj.removeClass('icon-select').addClass('icon-selected');
            $('#password').replaceWith('<input type="number" class="input-text-password1" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="return (/[\\d]/.test(String.fromCharCode(event.keyCode)))" id="password" name="' + $('#password').attr('name') + '" value="' + $('#password').val() + '" datatype="*,numberpassword" placeholder="输入交易密码"/>');
        } else {
            obj.removeClass('icon-selected').addClass('icon-select');
            $('#password').replaceWith('<input type="number" class="input-text-password" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="return (/[\\d]/.test(String.fromCharCode(event.keyCode)))" id="password" name="' + $('#password').attr('name') + '" value="' + $('#password').val() + '" datatype="*,numberpassword" placeholder="输入交易密码"/>');
        }
    });
    // 输入框后的清除按钮
    $('.icon.icon-error.pa').click(function () {
        $(this).siblings('input').val('');
    });
    //点击展开
    $(".icon-arrow-down").click(function () {
        $(this).siblings(".panel").slideToggle();
        $(this).hide();
        $(this).siblings(".icon-arrow-up").show();
        $(this).parent(".input-amountwrap").css('padding-bottom', '0');
    });
    $(".icon-arrow-up").click(function () {
        $(this).siblings(".panel").slideUp();
        $(this).siblings(".icon-arrow-down").show();
        $(this).hide();
        $(this).parent(".input-amountwrap").css('padding-bottom', '0.6rem');
    });

    $(".icon-arrow-downright").click(function () {
        $(this).siblings(".panel").slideToggle();
        $(this).parent(".input-amountwrap").css('padding-bottom', '0');
    });
    $(".icon-arrow-upright").click(function () {
        $(this).siblings(".panel").slideUp();
        $(this).parent(".input-amountwrap").css('padding-bottom', '0.6rem');
    });

    resizeContainer();
    $(window).resize(function () {
        resizeContainer();
    });

    xy();
    $(window).resize(function () {
        xy();
    });

    cd();
    $(window).resize(function () {
        cd();
    });

    //显示/隐藏弹出层
    $(".submit-btn").click(function () {
        $("#alertLayer,.alertLayer").hide();
        $("body").css("position", "initial");
        $("#mask").hide();
    });
    //显示/隐藏弹出层
    $(".btnClick-2").click(function () {
        showDialogBottom();
        $("#alertLayer_2").show();
        $("body").css("position", "fixed");
    });
    $(".submit-btn-2").click(function () {
        $("#alertLayer_2,.alertLayer").hide();
        $("body").css("position", "initial");
        $("#mask").hide();
    });
    $(".show-bank").click(function () {
        showDialogBottom();
        $("#bank-list").show();
        $("body").css("position", "fixed");
    });


//    $("#branchName").click(function () {
//        showDialogBottom();
//        $("#branch-list").show();
//    });
});

var provinceCitySelect = function (provinceEl, cityEl) {
    cityEl.after('<input name="provinceCityName" id="_provinceCityName" type="hidden"/>');
    var provinceCityInput = $("#_provinceCityName");
    provinceEl.append('<option value="">请选择省份</option>');
    for (var provinceKey in areaoptProvince) {
        var provinceName = areaoptProvince[provinceKey];
        $(provinceEl).append('<option value="' + provinceKey + '">' + provinceName + '</option>');
    }
    provinceEl.change(function () {
        cityEl.html("");
        var citys = areaoptCity[provinceEl.val()];
        for (var cityKey in citys) {
            $(cityEl).append('<option value="' + cityKey + '">' + citys[cityKey] + '</option>')
        }
        cityEl.trigger('change');
    })
    cityEl.change(function () {
        provinceCityInput.val(provinceEl.find("option:selected").text() + " " + cityEl.find("option:selected").text());
        $.ajax({
            url: "../../bankInfo/getBankBranchList",
            async: false,
            type: "POST",
            data: {
                'region': provinceEl.val() + cityEl.val(),
                'bankCode': $("#bankCode").val(),
                requestKey: $('#requestKey').val()
            },
            dataType: "json",
            success: function (data) {
                if (data != null && data != 'null') {
                    BHAFrom.data.branchInfo = data;
                    var branchInfoHtml = '';
                    for (var i = 0; i < BHAFrom.data.branchInfo.length; i++) {
                        branchInfoHtml += '<li id="' + BHAFrom.data.branchInfo[i].cnaps + '" class="branch" >' + BHAFrom.data.branchInfo[i].bankName + '</li>';
                    }
                    $('.bankinfoList ul').html(branchInfoHtml);
                    BHAFrom.form.unignore($('input[name="branchName"]'));
                    BHAFrom.form.unignore($('input[name="branchNo"]'));
                    $('.bankinfoList ul .branch').click(function () {
                        $("#branchName").val($(this).text().replace('股份有限公司', ''));
                        $("#branchNo").val($(this).attr("id"));
                        $("#branch-list").hide();
                        $("#mask").hide();
                        BHAFrom.form.check(false, $('input[name="branchName"]'));
                    })

                    $('#input-branch').bind('input propertychange', function () {
                        var value = $(this).val();
                        if (value != '') $('.branch').hide();
                        for (var i = 0; i < BHAFrom.data.branchInfo.length; i++) {
                            if (BHAFrom.data.branchInfo[i].bankName.indexOf(value) > -1) {
                                $('#' + BHAFrom.data.branchInfo[i].cnaps).show();
                            }
                        }
                    });
                }
            }
        });
    })

};

