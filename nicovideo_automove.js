console.log('---------nicovideo automove process start-----------');

var el = $('.commu_name');

if (el.length == 0) {
    throw 'no broadcast';
}

var commuUrl = el[0].href

var getStartTime = function() {
    var informationText = $('.information')[0].innerHTML;
    var startTimeText = informationText.match(/([0-9].*)開場/)[1].replace('：', ':');
    return Date.parse(startTimeText);
}

var isTimeshift = function() {
    var startTime = getStartTime();
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
            location.href = broadcastUrl + '#wall_canvas';
        }
    }).fail(function(data) {
        console.log('throw');
        throw data;
    });
}

var ping = function() {
    if (isTimeshift()) {
        return;
    }
    var timer = null;
    console.log('ping / 30 sec');
    try {
        automove();
        timer = setTimeout('ping()', 30000);
    } catch(e) {
        console.log('error occured. ping in 1 min.');
        timer = setTimeout('ping()', 60000);
    }
}

ping();
