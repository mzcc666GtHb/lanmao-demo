$("#passwordNumber").focus(function(){
    document.activeElement.blur();
});

$("#passwordNumber1").focus(function(){
    document.activeElement.blur();
});
$("#passwordNumber2").focus(function(){
    document.activeElement.blur();
});


;(function($,exports){

    var KeyBoard = function(par,par2,input,options){
        var body = document.getElementsByTagName('body')[0];
        var payPassword = $(par),
            _this = payPassword.find('i'),
            k=0,j=0,
            password = '' ,
            _cardwrap = $(par2);
        input.onkeydown = function (){
            return false;
        };

        //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
        if(payPassword.attr('data-busy') === '0'){
            //在第一个密码框中添加光标样式
            _this.eq(k).addClass("active");
            _cardwrap.css('visibility','visible');
            payPassword.attr('data-busy','1');
        }
        //使用keyup事件，绑定键盘上的数字按键和backspace按键
        payPassword.on('keyup',".sixDigitPassword",function(e){
            var _val = this.value;
            this.value = _val.replace(/\D/g,'');

        });
        var DIV_ID = options && options.divId || '__w_l_h_v_c_z_e_r_o_divid';
        if(document.getElementById(DIV_ID)){
            body.removeChild(document.getElementById(DIV_ID));
        }
        this.input = input;

        this.el = document.createElement('div');

        var self = this;
        var zIndex = options && options.zIndex || 1000;
        var width = options && options.width || '100%';
        var height = options && options.height || '193px';
        var fontSize = options && options.fontSize || '15px';
        var backgroundColor = options && options.backgroundColor || '#fff';
        var TABLE_ID = options && options.table_id || 'table_0909099';
        var mobile = typeof orientation !== 'undefined';

        this.el.id = DIV_ID;
        this.el.style.position = 'fixed';
        this.el.style.left = 0;
        this.el.style.right = 0;
        this.el.style.bottom = 0;
        this.el.style.zIndex = zIndex;
        this.el.style.width = width;
        this.el.style.height = height;
        this.el.style.backgroundColor = backgroundColor;

        //样式
        var cssStr = '<style type="text/css">';
        cssStr += '#' + TABLE_ID + '{text-align:center;width:100%;height:160px;border-top:1px solid #CECDCE;background-color:#FFF;}';
        cssStr += '#' + TABLE_ID + ' td{width:33%;border:1px solid #ddd;border-right:0;border-top:0;}';
        if(!mobile){
            cssStr += '#' + TABLE_ID + ' td:hover{background-color:#1FB9FF;color:#FFF;}';
        }
        cssStr += '</style>';

        //Button
        var btnStr = '<div style="width:60px;height:28px;background-color:#1FB9FF;';
        btnStr += 'float:right;margin-right:5px;text-align:center;color:#fff;';
        btnStr += 'line-height:28px;border-radius:3px;margin-bottom:5px;cursor:pointer;">完成</div>';

        //table
        var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
        tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
        tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
        tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
        tableStr += '<tr><td style="background-color:#D3D9DF;"></td><td>0</td>';
        tableStr += '<td style="background-color:#D3D9DF;">删除</td></tr>';
        tableStr += '</table>';
        this.el.innerHTML = cssStr + btnStr + tableStr;

        function addEvent(e){
            var ev = e || window.event;
            var clickEl = ev.element || ev.target;

            e.stopPropagation();
            e.cancelBubble=true;
            var value = clickEl.textContent || clickEl.innerText;
            if(clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "删除"){

                if(self.input&& self.input.value.length<=5){
                    self.input.value += value;
                    k = self.input.value.length;//输入框里面的密码长度
                    l = _this.size();//6


                    for(;l--;){

                        //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                        if(l === k){
                            _this.eq(l).addClass("active");
                            _this.eq(l).find('b').css('visibility','hidden');

                        }else{
                            _this.eq(l).removeClass("active");
                            _this.eq(l).find('b').css('visibility', l < k ? 'visible' : 'hidden');

                        }

                        if(k === 6){
                            j = 5;
                            $(par2).hide();
                        }else{
                            j = k;
                        }
                        var wid=$(body).width()/6;
                        $(par2).css('left',j*wid+'px');

                    }

                    if (/^\d{6}$/.test($(".sixDigitPassword").val().trim())) {
                        payPassword.find("input").blur();
                    }
                    if(!document.getElementById("passwordNumber1")&&!document.getElementById("passwordNumber2")&&(/^\d{6}$/.test($(".sixDigitPassword").val().trim())))
                    {
                        body.removeChild(document.getElementById(DIV_ID));
                    }
                }


            }else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "完成"){
                body.removeChild(self.el);
                $('.cardwrap').hide();
                $(document).off('click');
            }else if(clickEl.tagName.toLocaleLowerCase() === 'td' && value === "删除"){
                var num = self.input.value;
                if(num){
                    var newNum = num.substr(0, num.length - 1);
                    self.input.value = newNum;
                    k = self.input.value.length;//输入框里面的密码长度
                    l = _this.size();//6

                    for(;l--;){

                        //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                        if(l === k){
                            _this.eq(l).addClass("active");
                            _this.eq(l).find('b').css('visibility','hidden');

                        }else{
                            _this.eq(l).removeClass("active");
                            _this.eq(l).find('b').css('visibility', l < k ? 'visible' : 'hidden');

                        }

                        if(k === 6){
                            j = 5;
                            $(par2).hide();
                        }else{
                            j = k;
                        }
                        var wid=$(body).width()/6;
                        $(par2).css('left',j*wid+'px');

                    }
                }
            }
        }
        if(mobile){
            this.el.ontouchstart = addEvent;
        }else{
            this.el.onclick = addEvent;
        }
        body.appendChild(this.el);


         $(document.getElementById('smsCode')).click(function (){
             $(par2).hide();
             body.removeChild(document.getElementById(DIV_ID));
         });
        $(document.getElementById('realName')).click(function (){
            $(par2).hide();
            body.removeChild(document.getElementById(DIV_ID));
        });
        $(document.getElementById('idCardNo')).click(function (){
            $(par2).hide();
            body.removeChild(document.getElementById(DIV_ID));
        });
        $(document.getElementById('bankcardNo')).click(function (){
            $(par2).hide();
            body.removeChild(document.getElementById(DIV_ID));
        });
        $(document.getElementById('mobile')).click(function (){
            $(par2).hide();
            body.removeChild(document.getElementById(DIV_ID));
        });




        payPassword.click(function (ev){
            $('.cardwrap').hide();
            $(par2).show();
            ev.stopPropagation();
        });


    }

    exports.KeyBoard = KeyBoard;

})(jQuery,window);

