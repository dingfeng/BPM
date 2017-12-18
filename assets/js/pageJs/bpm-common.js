domain = "http://106.14.222.99:8080/Entity/U1c601c1d10384f/test3/";
uid=1513576754080;
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

function  updateEntity(tableName,data)
{
    var returnResult = {};
    var url = domain + tableName + "/"+data["id"];
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

function getEntityById(tableName,entityId)
{
    var url = domain + tableName + "/"+entityId;
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