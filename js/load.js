  $(document).ready(function(){
            var range = 50;             //距下边界长度/单位px
            var elemt = 500;           //插入元素高度/单位px
            var maxnum = 5;            //设置加载最多次数
            var num = 1,mums= 1,numx=1;
            var totalheight = 0;
            var main = $("#signed");                     //主体元素
            $(this).scroll(function(){
                var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if(($(document).height()-range) <= totalheight  && num != maxnum) {
                    num++;
                   
                }
            });
        });
