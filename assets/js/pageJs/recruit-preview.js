rowTemplate =
    '                                <div class="row">\n' +
    '                                    <div class="col-md-11 col-sm-11" id="description"></div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-md-11 col-sm-11" id="ItemA"></div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-md-11 col-sm-11" id="ItemB"></div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-md-11 col-sm-11" id="ItemC"></div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-md-11 col-sm-11" id="ItemD"></div>\n' +
    '                                </div>\n' +
    '                                <br />\n';
exam = {};

function addRow(content) {
    var h4 = document.createElement("h5");
    $("#preview").append(h4);
    $(h4).html(content);
}

function newLine() {
    var br = document.createElement("br");
    $("#preview").append(br);
}

function addOneProblem(order, problem) {
    /*var divElement = document.createElement("div");
    var previewDiv = $("#preview");
    previewDiv.append(divElement);
    $(divElement).addClass("row");
    $(divElement).html(rowTemplate);
    var description = "" + order + ".   " + problem["description"];
    $("#description").html("<h4>" + description + "</h4>");
    $("#description").removeAttr("id");
    var itemElementIds = ["#ItemA", "#ItemB", "#ItemC", "#ItemD"];
    var orderArray = ["&nbsp;&nbsp;A.&nbsp;", "&nbsp;&nbsp;B.&nbsp;", "&nbsp;&nbsp;C.&nbsp;", "&nbsp;&nbsp;D.&nbsp;"];
    var items = problem["item"];
    for (var i = 0; i < 4; ++i) {
        var order = 1;
        var itemElementId = itemElementIds[i];
        var item = items[i];
        var itemNo = item["item_no"];
        var itemElementId = itemElementIds[itemNo];
        var itemText = orderArray[itemNo] + item["content"];
        $(itemElementId).html("<h4>" + itemText + "</h4>");
        $(itemElementId).removeAttr("id");
    }*/
    var description = order + ".&nbsp;&nbsp;" + problem["description"];
    addRow(description);
    var items = problem["item"];
    var itemTitles = ["&nbsp;&nbsp;&nbsp;&nbsp;A.&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;B.&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;C.&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;D.&nbsp;&nbsp;"];
    for (var i = 0; i < 4; ++i) {
        var item = items[i];
        var itemNo = item["item_no"];
        var itemTitle = itemTitles[itemNo];
        var itemContent = itemTitle + item["content"];
        addRow(itemContent);
    }
   // newLine();
}

$(function () {
    var examId = getUrlParam("examId");
    exam = getEntityById("Exam", examId);
    var problems = exam["problems"];
    $("#title").text(exam["title"]);
    var companyName = "公司： " + exam["companyname"];
    $("#companyName").text(companyName);
    var begintime = exam["begintime"];
    var endtime = exam["endtime"];
    var time = "时间： " + begintime + " ~ " + endtime;
    $("#time").text(time);
    var order = 1;
    for (var i in problems) {
        addOneProblem(order++, problems[i]);
    }
});