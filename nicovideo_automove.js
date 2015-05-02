console.log('---------nicovideo automove process start-----------');

var el = $('.commu_name');

if (el.length == 0) {
    throw 'no broadcast';
}

var commuUrl = el[0].href

var isTimeshift = function() {
    var informationText = $('.information')[0].innerHTML;
    var startTimeText = informationText.match(/([0-9].*)開場/)[1].replace('：', ':');
    var startTime = Date.parse(startTimeText);
    var nowTime = (new Date).getTime();

    if ((nowTime - startTime) / 1000 / 60 > 60) {
        console.log('is timeshift');
        return true;
    } else {
        console.log('is not timeshift');
        return false;
    }
}

var automove = function() {
    $.ajax({
        type: 'GET',
        url:  commuUrl,
        dataType: 'html',
        async: false,
    }).done(function(xml) {
        var broadcastUrl = $(xml).find('.community')[0].href
        if (broadcastUrl.match(location.pathname) == null) {
            location.href = broadcastUrl;
        }
    }).fail(function(data) {
        console.log('throw');
        throw data;
    });
}

if (!isTimeshift()) {
    var ping = function() {
        var timer = null;
        console.log('ping / 10 sec');
        try {
            automove();
            timer = setTimeout('ping()', 10000);
        } catch(e) {
            console.log('error occured. ping in 1 min.');
            timer = setTimeout('ping()', 60000);
        }
    }
    ping();
}
