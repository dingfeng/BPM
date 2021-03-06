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
    var status = ["未发布", "已经发布", "已结束"];
    var trClasses = ["success", "info"];
    var tbody = $("#tableBody");
    //创建行
    var tr = document.createElement("tr");
    tbody.append(tr);
    $(tr).addClass(trClasses[order % 2]);
    $(tr).append(createTd(order));  //1
    var titleTd = createTd(exam["title"]);
    $(tr).append(titleTd);
    var examView = getA("试题");
    examView.setAttribute("href", "recruit-preview.html?examId=" + exam["id"]);
    var viewTd = createTd("");
    $(tr).append(viewTd);
    $(viewTd).append(examView);
    var companyNameTd = createTd(exam["companyname"]);
    $(tr).append(companyNameTd);
    if (exam["companytype"] == undefined) {
        exam["companytype"] = {"name": ""}
    }
    var companyTypeTd = createTd(exam["companytype"]["name"]);
    $(tr).append(companyTypeTd);
    if (exam["department"] == undefined) {
        exam["department"] = {"name": ""};
    }
    var departmentTd = createTd(exam["department"]["name"]);
    $(tr).append(departmentTd);
    if (exam["position"] == undefined) {
        exam["position"] = {"name": ""};
    }
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
    $(tr).append(tagTd);
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
    //设置参考人数
    var personCountTd = createTd(exam["personcount"]);
    $(tr).append(personCountTd);
    var operationTd = createTd("");
    $(tr).append(operationTd);
    var operationA = null;
    if (statusStr == "未发布" || status==0) {
        //发布动作
        operationA = getA("发布");
        $(operationTd).append(operationA);
        $(operationA).click(function () {
            console.log("发布考试");
            //发布
            exam["status"] = 1;
            updateEntity("Exam", exam);
            alert("发布成功");
            reloadData();
        });

    } else if (statusStr == "已发布") {
        //取消发布的动作
        operationA = getA("撤回");
        $(operationTd).append(operationA);
        $(operationA).click(function () {
            console.log("取消发布考试");
            //取消发布
            exam["status"] = 0;
            updateEntity("Exam", exam);
            alert("取消成功");
            reloadData();
            //window.location.reload();
        });
    } else {
        //无操作
        $(operationTd).text("无操作");
    }
    var resultTd = createTd("");
    $(tr).append(resultTd);
    if (statusStr == "已结束") {
        var resultA = getA("统计");
        $(resultTd).append(resultA);
        $(resultA).attr("href", "recruit-result.html?examId=" + exam["id"]);
    } else {
        $(resultTd).text("无结果");
    }
    var deleteTd = createTd("");
    $(tr).append(deleteTd);
    var deleteA = getA("删除");
    $(deleteTd).append(deleteA);
    $(deleteA).click(function () {
        //删除试卷
        deleteById("Exam", exam["id"]);
        $(this).parent().parent().remove();
        localRemoveExam(exam["id"]);
        alert("删除成功");
    });
}

exams=undefined

function reloadData()
{
    $("#tableBody").html("");
    var examsLen = exams.length;
    for (var i = examsLen - 1; i >= 0; --i) {
        var exam = exams[i];
        addTableRow(examsLen - i, exam);
    }
}


function localRemoveExam(id)
{
    for (var i in exams){
        var exam=exams[i];
        if(exam["id"] == id)
        {
            exams.splice(i,1);
            break;
        }
    }
}

$(function () {
    //获取该用户下的发布的试卷
        showProcessBar();
        var url = domain + "User" + "/" + uid;
        $.ajax({
            type: 'GET',
            url: url,
            success: function (result, status) {
                var user = result;
                exams = user["publishedexam"];
                exams = filterDeleted(exams);
                reloadData();
                endProcessBar();
            },
            dataType: "json",
            async: true
        });
});