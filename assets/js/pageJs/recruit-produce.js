problem = {};
selectData = {};
globalCompanyType = {};
globalDepartment = {};
globalPosition = {};
globalTag = {};

function resetSelects() {
    //初始化设置页面
    $("#companyType").html("");
    $("#department").html("");
    $("#position").html("");
    $("#tags").html("");
    var companyTypeUrl = domain + "Companytype"
    $.get(companyTypeUrl, function (data, status) {
        console.log("get company type data=" + JSON.stringify(data) + " ,status=" + status);
        if (status === "success") {
            //成功接收数据
            selectData = data;
            for (var i in data["Companytype"]) {
                var companyType = data["Companytype"][i];
                //创建option
                var option = document.createElement("option");
                $("#companyType").append(option);
                $(option).attr("value", companyType["id"]);
                $(option).text(companyType["name"]);
                if (i == 0) {
                    globalCompanyType = companyType;
                    //第一个设置后面的部门和岗位下拉框 遍历has
                    for (var j in companyType["has"]) {
                        var department = companyType["has"][j];
                        var departmentOption = document.createElement("option");
                        $("#department").append(departmentOption);
                        $(departmentOption).attr("value", department["id"]);
                        $(departmentOption).text(department["name"]);
                        if (j == 0) {
                            globalDepartment = department;
                            for (var k in department["has"]) {
                                var position = department["has"][k];
                                var positionOption = document.createElement("option");
                                $("#position").append(positionOption);
                                $(positionOption).attr("value", position["id"]);
                                $(positionOption).text(position["name"]);
                                if (k == 0) {
                                    globalPosition = position;
                                    for (var m in position["has"]) {
                                        var tag = position["has"][m];
                                        var tagOption = document.createElement("option");
                                        $("#tags").append(tagOption);
                                        $(tagOption).val(tag["id"]);
                                        $(tagOption).text(tag["name"]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        else {
            alert("获取公司类型数据失败");
        }
    }, dataType = "json");
}

resetSelects();

function companyTypeChanged() {
    console.log("company type select change  " + $("#companyType").val());
    var id = $("#companyType").val();
    $("#department").text("");
    $("#tags").text("");
    $("#position").text("");
    for (var i in selectData["Companytype"]) {
        var companyType = selectData["Companytype"][i];
        if (companyType["id"] == id) {
            globalCompanyType = companyType;
            for (var j in companyType["has"]) {
                var department = companyType["has"][j];
                var departmentOption = document.createElement("option");
                $("#department").append(departmentOption);
                $(departmentOption).attr("value", department["id"]);
                $(departmentOption).text(department["name"]);
                if (j == 0) {
                    console.log("j=" + j)
                    $("#department").val(department["id"]);
                }
            }
            break;
        }

    }
    departmentChanged();
}

function departmentChanged() {
    console.log("department select change " + $("#department").val());
    var id = $("#department").val();
    $("#position").text("");
    $("#tags").text("");
    for (var i in globalCompanyType["has"]) {
        var department = globalCompanyType["has"][i];
        if (department["id"] == id) {
            globalDepartment = department;
            for (var j in department["has"]) {
                var position = department["has"][j];
                var positionOption = document.createElement("option");
                $("#position").append(positionOption);
                $(positionOption).attr("value", position["id"]);
                $(positionOption).text(position["name"]);
                if (j == 0) {
                    $("#position").val(position["id"]);
                }
            }
            break;
        }
    }
    positionChanged();
}

function positionChanged() {
    console.log("position select change " + $("#position").val());
    var id = $("#position").val();
    $("#tags").text("");
    for (var i in globalDepartment["has"]) {
        var position = globalDepartment["has"][i];
        if (position["id"] == id) {
            globalPosition = position;
            for (var j in position["has"]) {
                var tag = position["has"][j];
                var tagOption = document.createElement("option");
                $("#tags").append(tagOption);
                $(tagOption).attr("value", tag["id"]);
                $(tagOption).text(tag["name"]);
                if (j == 0) {
                    $("#tags").val(tag["id"]);
                }
            }
            break;
        }
    }
}

$("#companyType").change(function () {
    companyTypeChanged();
});

$("#department").change(function () {
    departmentChanged();
});

$("#position").change(function () {
    positionChanged();
});


$("#submitButton").click(function () {
    var newPaper = {};
    //题目 公司类型 部门 岗位 标签  关系
    var allProblems = getEntity("Problem");
    allProblems = filterDeleted(allProblems);
    var problemCount = 10;
    var problemLen = Math.min(problemCount, allProblems.length);
    var usedProblems = [];
    for (var i = 0; i < problemLen; ++i) {
        var num = Math.floor(Math.random() * allProblems.length);
        usedProblems.push(allProblems[num]);
        allProblems.splice(num, 1);
    }
    console.log("usedProblems=" + JSON.stringify(usedProblems));
    newPaper["problems"] = usedProblems;//[allProblems[0]];
    var companyTypeId = $("#companyType").val();
    console.log("companyTypeId=" + companyTypeId);
    newPaper["companytype"] = {"id": companyTypeId};
    var departmentId = $("#department").val();
    console.log("departmentId=" + departmentId);
    newPaper["department"] = {"id": departmentId};
    var positionId = $("#position").val();
    console.log("positionId=" + positionId);
    newPaper["position"] = {"id": positionId};
    var tagIds = $("#tags").val();
    console.log("tagIds=" + tagIds);
    var tags = [];
    for (var i in tagIds) {
        var tagId = tagIds[i];
        tags.push({"id": tagId});
    }
    newPaper["hastag"] = tags;

    //获取公司名称 属性
    var companyName = $("input[name='companyName']").val();
    console.log("companyname=" + companyName);
    newPaper["companyname"] = companyName;
    //获取试卷题目
    var title = $("input[name='title']").val();
    console.log("title=" + title);
    newPaper["title"] = title;
    //获取日期  属性
    var inputValue = $("input[name='reservation']").val();
    var inputValueArray = inputValue.split(" ");
    var beginDate = inputValueArray[0];
    var beginDateArray = beginDate.split("/");
    beginDate = beginDateArray[2] + "-" + beginDateArray[0] + "-" + beginDateArray[1];
    var beginTime = beginDate + " " + inputValueArray[1] + ":00";
    var endDate = inputValueArray[4];
    var endDateArray = endDate.split("/");
    endDate = endDateArray[2] + "-" + endDateArray[0] + "-" + endDateArray[1];
    var endTime = endDate + " " + inputValueArray[5] + ":00";
    console.log("begintime=" + beginTime + " endtime=" + endTime);
    newPaper["begintime"] = beginTime;
    newPaper["endtime"] = endTime;
    //设置考试人数
    newPaper["personcount"] = 0;
    newPaper["status"] = 0;
    newPaper["exist"] = 1;
    var exam = createEntity("Exam", newPaper);
    var user = getEntityById("User", uid);
    var exams = user["publishedexam"];
    exams.push(exam);
    updateEntity("User", user);
    alert("生成成功！")
});


