examId = getUrlParam("examId");
console.log("examId=" + examId);
exam = {};
answers = [];

function createTd(content) {
    var tdElement = document.createElement("td");
    tdElement.innerHTML = content;
    return tdElement;
}

function addOneTableRow(row) {
    var trElement = document.createElement("tr");
    $("#oneTableBody").append(trElement);
    for (var i = 0; i < row.length; ++i) {
        var tdElement = createTd(row[i]);
        $(trElement).append(tdElement);
    }
}


function addRow(tableRow) {
    var tbody = $("#tableBody");
    var keys = ["order", "name", "contact", "score"];
    var trElement = document.createElement("tr");
    tbody.append(trElement);
    $(trElement).addClass("odd");
    $(trElement).addClass("gradeX");
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var tdElement = createTd(tableRow[key]);
        $(trElement).append(tdElement);
    }
    //创建查看按钮
    var aElement = document.createElement("a");
    var aTdElement = createTd("");
    $(trElement).append(aTdElement);
    $(aTdElement).append(aElement);
    $(aElement).addClass("btn");
    $(aElement).addClass("btn-primary");
    $(aElement).addClass("btn-sm");
    $(aElement).text("查看");
    $(aElement).click(function () {
        var oneTableRows = [];
        //显示单个应试者的情况
        var itemStringArray = ["A", "B", "C", "D"];
        $("#jobSeekerName").text(tableRow["name"]);
        var recordId = tableRow["recordId"];
        var oneAnswerRecords = exam["jobseekeranswerrecord"][recordId]["hasitem"];
        $("#oneTableBody").html("");
        for (var i = 0; i < answers.length; ++i) {
            var oneAnswerRecord = oneAnswerRecords[i];
            var correctAnswer = answers[i];
            var judgeStr = oneAnswerRecord["id"] == correctAnswer["id"] ? "是" : "否";
            var answerItemNoStr = itemStringArray[oneAnswerRecord["item_no"]];
            var correctItemNoStr = itemStringArray[correctAnswer["item_no"]];
            addOneTableRow([i + 1, answerItemNoStr, correctItemNoStr, judgeStr]);
        }
    });
}


$(function () {


    exam = getEntityById("Exam", examId);
    var problems = exam["problems"];
    var correctCounts = [];
    for (var i = 0; i < problems.length; ++i) {
        correctCounts.push(0);
    }
    var correctAnswerIds = [];
    for (var i in problems) {
        var problem = problems[i];
        var correctAnswerId = problem["answer"]["id"];
        answers.push(problem["answer"]);
        correctAnswerIds.push(correctAnswerId);
    }
    var jobseekeranswerrecords = exam["jobseekeranswerrecord"];
    var total = jobseekeranswerrecords.length;
    for (var i = 0; i < total; ++i) {
        var answerRecord = jobseekeranswerrecords[i];
        var hasItem = answerRecord["hasitem"];
        for (var j = 0; i < hasItem.length; ++i) {
            var itemId = hasItem[j]["id"];
            if (itemId == correctAnswerIds[j]) {
                correctCounts[j]++;
            }
        }
    }
    var data = [];
    for (var i = 0; i < correctCounts.length; ++i) {
        var correctCount = correctCounts[i];
        var wrongCount = total - correctCount;
        var y = '第' + (i + 1) + '题';
        data.push({y: y, a: correctCount, b: wrongCount});
    }
    Morris.Bar({
        element: 'morris-bar-chart',
        data: data,
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['对', '错'],
        hideHover: 'auto',
        resize: true
    });
    //修改排行榜
    var scores = [];
    for (var i = 0; i < total; ++i) {
        var tableRow = {order: 0, name: "", contact: "", score: 0, recordId: 0};
        var answerRecord = jobseekeranswerrecords[i];
        var jobSeeker = answerRecord["jobseeker"];
        tableRow.name = jobSeeker["name"];
        tableRow.contact = jobSeeker["phone"];
        tableRow.recordId = i;
        //计算答题正确数
        var answerItems = answerRecord["hasitem"];
        var jobSeekerCorrectCount = 0;
        for (var j = 0; j < correctAnswerIds.length; ++j) {
            if (correctAnswerIds[j] == answerItems[j]["id"]) {
                jobSeekerCorrectCount++;
            }
        }
        var score = parseInt(100 * jobSeekerCorrectCount / problems.length);
        tableRow.score = score;
        scores.push(tableRow);
    }
    scores.sort(function (a, b) {
        return b.score - a.score;
    });
    for (var i = 0; i < scores.length; ++i) {
        scores[i].order = i + 1;
        addRow(scores[i]);
    }


});