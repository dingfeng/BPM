domain = "http://106.14.222.99:8080/Entity/U1c601c1d10384f/test3/";
uid = 1513576754080;

function createEntity(tableName, data) {
    var returnResult = {};
    var url = domain + tableName + "/";
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        success: function (result, status) {
            console.log("创建成功 result=" + JSON.stringify(result));
            returnResult = result;
        },
        dataType: "json",
        contentType: "application/json",
        async: false
    });
    return returnResult;
}

function updateEntity(tableName, data) {
    var returnResult = {};
    var url = domain + tableName + "/" + data["id"];
    $.ajax({
        type: 'PUT',
        url: url,
        data: JSON.stringify(data),
        success: function (result, status) {
            console.log("修改成功 result=" + JSON.stringify(result));
            returnResult = result;
        },
        dataType: "json",
        contentType: "application/json",
        async: false
    });
    return returnResult;
}

function getEntity(tableName) {
    var url = domain + tableName + "/";
    $.ajax({
        type: 'GET',
        url: url,
        success: function (result, status) {
            console.log("获得成功 result=" + JSON.stringify(result));
            returnResult = result;
        },
        dataType: "json",
        async: false
    });
    return returnResult[tableName];
}

function getEntityById(tableName, entityId) {
    var url = domain + tableName + "/" + entityId;
    $.ajax({
        type: 'GET',
        url: url,
        success: function (result, status) {
            console.log("获得成功 result=" + JSON.stringify(result));
            returnResult = result;
        },
        dataType: "json",
        async: false
    });
    return returnResult;
}


Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
};

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function deleteById(tableName, id) {
    var data = getEntityById(tableName, id);
    data["exist"] = 0;
    updateEntity(tableName, data);
}

function filterDeleted(array) {
    var newArray = [];
    for (var i in array) {
        var element = array[i];
        if (element["exist"] == 1 || element["exist"] == undefined) {
            newArray.push(element);
        }
    }
    return newArray;
}

window.alert = function (message) {
    $().toastmessage('showSuccessToast', message);
}

function reload() {
    setTimeout("window.location.reload()", 2000)
}

function showProcessBar() {
    var value=2;
    if(arguments[0]){
        value = arguments[0];
    }
    $(".progress").show();
    var st = setInterval(function(){
        value+=value;
        console.log("value"+value);
        //执行的函数
        $(".progress-bar-primary").attr("style","width: "+value+"%");
        //实行了3次
        if (value > 40) {
            clearInterval(st);

        }
    },500);
}

function hideProcessBar()
{
    $(".progress").hide();
    $(".progress-bar-primary").attr("style","width: "+"0");
}

function endProcessBar() {
    $(".progress-bar-primary").attr("style","width: "+"100%");
    setTimeout('hideProcessBar()',1000);
}
