$(function () {
    showProcessBar();
    $.get(domain + "Problem/?Problem.exist=1", function (result) {
        var problems = result["Problem"];
        var data = {}
        for (var problemIndex in problems) {
            var problem = problems[problemIndex];
            var tags = problem["hastag"]
            for (var tagIndex in tags) {
                var tag = tags[tagIndex];
                var tagName = tag["name"];
                if (data[tagName] === undefined) {
                    data[tagName] = 0
                }
                data[tagName]++;
            }
        }
        //修改题目总数
        $("#problemCount").text($("#problemCount").text() + " 总数 = " + problems.length);
        //遍历data的key value属性
        var barData = []
        for (var key in data) {
            barData.push({y: key, a: data[key]});
        }
        console.log(data);
        Morris.Bar({
            element: 'morris-bar-chart-problem',
            data: barData,
            xkey: 'y',
            ykeys: ['a'],
            labels: ['数量'],
            hideHover: 'auto',
            resize: true
        });
        var donutData = [];
        for (var key in data) {
            donutData.push({label: key, value: data[key]});
        }
        Morris.Donut({
            element: 'morris-donut-chart-problem',
            data: donutData,
            resize: true
        });
        endProcessBar();
    }, dataType = "json")

    $.get(domain + "Exam/?Exam.exist=1", function (result) {
        var exams = result["Exam"];
        var data = {}
        for (var examIndex in exams) {
            var exam = exams[examIndex];
            var companyName = exam["companyname"]
            if (data[companyName] === undefined){
                data[companyName]=0;
            }
            data[companyName]++;
        }
        //修改题目总数
        $("#examCount").text($("#examCount").text() + " 总数 = " + exams.length);
        //遍历data的key value属性
        var barData = []
        for (var key in data) {
            barData.push({y: key, a: data[key]});
        }
        console.log(data);
        Morris.Bar({
            element: 'morris-bar-chart-exam',
            data: barData,
            xkey: 'y',
            ykeys: ['a'],
            labels: ['数量'],
            hideHover: 'auto',
            resize: true
        });
        var donutData = [];
        for (var key in data) {
            donutData.push({label: key, value: data[key]});
        }
        Morris.Donut({
            element: 'morris-donut-chart-exam',
            data: donutData,
            resize: true
        });
        endProcessBar();
    }, dataType = "json");

})
;