var searchTemplate = '<div class="col-md-3 col-sm-3"></div>\n' +
    '                <div class="col-md-6 col-sm-6">\n' +
    '                    <div class="panel panel-default">\n' +
    '                        <div class="panel-body">\n' +
    '                            <ul class="nav nav-pills">\n' +
    '                                <li class="active"><a id="a-description" href="#description-pills" data-toggle="tab">描述</a>\n' +
    '                                </li>\n' +
    '                                <li class=""><a id="a-options" href="#options-pills" data-toggle="tab">选项</a>\n' +
    '                                </li>\n' +
    '                                <li class=""><a id="a-answer" href="#answer-pills" data-toggle="tab">答案</a>\n' +
    '                                </li>\n' +
    '                                <li class=""><a id="a-settings" href="#settings-pills" data-toggle="tab">设置</a>\n' +
    '                                </li>\n' +
    '                            </ul>\n' +
    '\n' +
    '                            <div class="tab-content">\n' +
    '                                <div class="tab-pane fade active in" id="description-pills">\n' +
    '                                    <p id="emptyDescription"></p>\n' +
    '                                </div>\n' +
    '                                <div class="tab-pane fade" id="options-pills">\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-1"><p>A.</p></div>\n' +
    '                                        <div class="col-md-11" ><p id="emptyItemA"></p></div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-1"><p>B.</p></div>\n' +
    '                                        <div class="col-md-11"><p id="emptyItemB"></p></div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-1"><p>C.</p></div>\n' +
    '                                        <div class="col-md-11"><p id="emptyItemC"></p></div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-1"><p>D.</p></div>\n' +
    '                                        <div class="col-md-11"><p id="emptyItemD"></p></div>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div class="tab-pane fade" id="answer-pills">\n' +
    '                                    <p>C</p>\n' +
    '                                </div>\n' +
    '                                <div class="tab-pane fade " id="settings-pills">\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-2"><p>公司类型</p></div>\n' +
    '                                        <div class="col-md-10">  <p id="emptyCompanyType"></p> </div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-2"><p>部门</p></div>\n' +
    '                                        <div class="col-md-10"> <p id="emptyDepartment"></p> </div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-2"><p>岗位</p></div>\n' +
    '                                        <div class="col-md-10"> <p id="emptyPosition"></p> </div>\n' +
    '                                    </div>\n' +
    '                                    <div class="row">\n' +
    '                                        <div class="col-md-2"><p>标签</p></div>\n' +
    '                                        <div class="col-md-10"> <p id="emptyTags"></p> </div>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="col-md-3 col-sm-3"><button type="submit" class="btn btn-default" id="empty">修改</button> <button  class="btn btn-default" id="emptyDelete">删除</button></div>';
allProblems = [];

//请求所有的problem
var problemUrl = domain + "Problem/"
$.get(problemUrl, function (data, status) {
    if (status == "success") {
        console.log("data=" + JSON.stringify(data));
        allProblems = data["Problem"];
        allProblems=filterDeleted(allProblems);
    }
}, dataType = "json");

tabPageCount = 0;

function createSearchResult(searchedProblem) {
    var element = document.createElement("div");
    $("#page-inner").append(element);
    $(element).addClass("row");
    $(element).addClass("searchrow");
    $(element).html(searchTemplate);
    //设置标签页切换

    var pageIds = ["description-pills", "options-pills", "answer-pills", "settings-pills"];
    var aIds = ["a-description", "a-options", "a-answer", "a-settings"];
    for (var i in pageIds) {
        var pageId = pageIds[i];
        var aId = aIds[i];
        var aElement = $("#" + aId);
        aElement.attr("href", "#" + pageId + "-" + tabPageCount);
        aElement.removeAttr("id");
        $("#" + pageId).attr("id", pageId + "-" + tabPageCount);
    }
    tabPageCount++;

    var descriptionElement = $("#emptyDescription");
    descriptionElement.text(searchedProblem["description"]);
    descriptionElement.removeAttr("id");
    var itemAElement = $("#emptyItemA");
    itemAElement.text(searchedProblem["item"][0]["content"]);
    itemAElement.removeAttr("id");
    var itemBElement = $("#emptyItemB");
    itemBElement.text(searchedProblem["item"][1]["content"]);
    itemBElement.removeAttr("id");
    var itemCElement = $("#emptyItemC");
    itemCElement.text(searchedProblem["item"][2]["content"]);
    itemCElement.removeAttr("id");
    var itemDElement = $("#emptyItemD");
    itemDElement.text(searchedProblem["item"][3]["content"]);
    itemDElement.removeAttr("id");
    var companyType = searchedProblem["companytype"]["name"];
    var companyTypeElement = $("#emptyCompanyType");
    companyTypeElement.text(companyType);
    companyTypeElement.removeAttr("id");
    var department = searchedProblem["department"]["name"];
    var departmentElement = $("#emptyDepartment");
    departmentElement.text(department);
    departmentElement.removeAttr("id");
    var position = searchedProblem["position"]["name"];
    var positionElement = $("#emptyPosition");
    positionElement.text(position);
    positionElement.removeAttr("id");
    //获得tags数组的字符串表示
    var tags = searchedProblem["hastag"];
    var tagStrArray = [];
    for (var i in tags) {
        var tag = tags[i]["name"];
        tagStrArray.push(tag);
    }
    var tagStr = tagStrArray.join("，");
    var tagElement = $("#emptyTags");
    tagElement.text(tagStr);
    tagElement.removeAttr("id");
    var modifyButton = $("#empty");
    modifyButton.attr("id", searchedProblem["id"]);
    modifyButton.click(
        function () {
            window.location.href = "manager-modify.html?id=" + searchedProblem["id"];
        }
    );
    var deleteButton = $("#emptyDelete");
    deleteButton.removeAttr("id");
    deleteButton.click(function () {
        //删除
        deleteById("Problem", searchedProblem["id"]);
        alert("删除成功！");
        window.location.reload();
    });
}


$("#searchButton").click(function () {
    console.log("搜索");
    var searchText = $("input[name='searchInput']").val();
    var searchedProblems = [];
    $(".searchrow").remove();
    for (var i in allProblems) {
        var problem = allProblems[i];
        //不存在 string.contains 使用indexOf代替
        if (searchText.length == 0 || problem["description"].indexOf(searchText) > -1) {
            createSearchResult(problem);
        }
    }

});




