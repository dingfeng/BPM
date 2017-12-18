function getA(content) {
    var a = document.createElement("a");
    a.setAttribute("class", "btn btn-info btn-sm");
    a.innerText = content;
    return a;
}

function createTd(content) {
    var td = document.createElement("td");
    td.innerText = content;
    return td;
}


function addTableRow(order, exam) {
    var status = ["未发布", "已经发布", "结束"];
    var tbody = $("#tableBody");
    //创建行
    var tr = document.createElement("tr");
    tbody.append(tr);
    $(tr).append(createTd(order));  //1
    var examView = getA("试题");
    examView.setAttribute("href", "recuit-view.html?examId=" + exam["id"]);
    var viewTd = createTd("");
    $(tr).append(viewTd);
    $(viewTd).append(examView);
    var companyNameTd = createTd(exam["companyName"]);
    $(tr).append(companyNameTd);
    var companyTypeTd = createTd(exam["companyType"]["name"]);
    $(tr).append(companyNameTd);
    var departmentTd = createTd(exam["department"]["name"]);
    $(tr).append(departmentTd);
    var positionTd = createTd(exam["position"]["name"]);
    $(tr).append(positionTd);
    var tagNameArray = [];
    var tags = exam["hastag"];
    for (var i in tags) {
        var tag = tags[i];
        tagNameArray.push(tag["name"]);
    }
    var tagContent = tagNameArray.join("，");
    var tagTd = createTd(tagContent);
    $(tr).append(tagId);
    var beginTime = exam["begintime"];
    var beginTimeTd = createTd(beginTime);
    $(tr).append(beginTimeTd);
    var endTime = exam["endtime"];
    var endTimeTd = createTd(endTime);
    $(tr).append(endTimeTd);
    var status = exam["status"];
    var statusStrArray = ["未发布", "已发布"];
    var statusStr = statusStrArray[status];
    //判断是否在考试中
    var currrentDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (currrentDate > beginTime) {
        if (currrentDate < endTime) {
            statusStr = "考试中";
        }
        else {
            statusStr = "已结束";
        }
    }
    var statusTd = createTd(statusStr);
    $(tr).append(statusTd);
    var statusTd = createTd("");
    $(tr).append(statusTd);
    var operationA = null;
    if (statusStr == "未发布") {
        //发布动作
        operationA = getA("发布");
        $(statusTd).append(operationA);
        operationA.click(function () {
            //发布
            updateEntity("Exam", {"id": exam["id"], "status": 1});
            window.location.reload();
        });

    } else if (statusStr == "已发布") {
        //取消发布的动作
        operationA = getA("取消发布");
        $(statusTd).append(operationA);
        operationA.click(function () {
            //取消发布
            updateEntity("Exam", {"id": exam["id"], "status": 0});
            window.location.reload();
        });
    } else {
        //无操作
        $(statusTd).innerText = "无操作";
    }
    var resultTd = createTd("");
    $(tr).append(resultTd);
    if (statusStr == "已结束") {
        var resultA = getA("统计");
        $(resultTd).append(resultA);
        $(resultA).attr("href","recruit-result.html?examId="+exam["id"]);
    } else {
        $(resultTd).innerText = "无结果";
    }
}


$(function () {
    //获取该用户下的发布的试卷
    var user = getEntityById("User", uid);
    var exams = user["publishedexam"];
    var examsLen = exams.length;
    for (var i = examsLen - 1; i >= 0; --i) {
        var exam = exams[i];
        addTableRow(examsLen - i, exam);
    }
});