selectData = {};
globalCompanyType = {};
globalDepartment = {};
globalPosition = {};
globalTag = {};

//重置select元素

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

function addCompanyType() {
    var companyType = $("input[name='companyType']").val();
    var url = domain + "Companytype/";
    console.log("add company type =  " + companyType);
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify({"name": companyType}),
        success: function (result, status) {
            console.log("add company type result");
            console.log("result=" + result);
            console.log("status=" + status);
            if (status == "success") {
                alert("添加成功！");
                resetSelects();
                $("input[name='companyType']").val("");
            }
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function addDepartment() {
    //公司类型编号
    var companyTypeId = $("#companyType").val();
    var url = domain + "Companytype/" + companyTypeId;
    var companyType = {};
    $.get(url, function (data, status) {
        if (status == "success") {
            companyType = data;
            var department = $("input[name='department']").val();
            //创建department
            $.ajax({
                type: 'POST',
                url: domain + "department/",
                data: JSON.stringify({"name": department}),
                success: function (result, status) {
                    var departmentId = result["id"];
                    companyType["has"].push({"id": departmentId});
                    //更新companyType
                    $.ajax(
                        {
                            type: 'PUT',
                            url: url,
                            data: JSON.stringify(companyType),
                            dataType: "json",
                            contentType: "application/json",
                            success: function () {
                                alert("添加成功！");
                                resetSelects();
                                $("input[name='department']").val("");
                            }
                        }
                    );
                },
                dataType: "json",
                contentType: "application/json"
            });
        }
    }, dataType = "json");

}

function addPosition() {
    //获得所在部门
    var departmentId = $("#department").val();
    var url = domain + "Department/" + departmentId;
    $.get(url, function (data, status) {
        if (status == "success") {
            var department = data;
            var position = $("input[name='position']").val();
            //创建Position
            $.ajax({
                type: 'POST',
                url: domain + "position/",
                data: JSON.stringify({"name": position}),
                success: function (result, status) {
                    var positionId = result["id"];
                    department["has"].push({"id": positionId});
                    //更新department
                    $.ajax(
                        {
                            type: 'PUT',
                            url: url,
                            data: JSON.stringify(department),
                            dataType: "json",
                            contentType: "application/json",
                            success: function () {
                                alert("添加成功！");
                                resetSelects();
                                $("input[name='position']").val("");
                            }
                        }
                    );
                },
                dataType: "json",
                contentType: "application/json"
            });
        }
    }, dataType = "json");
}

function addTag() {
    //获得所在岗位
    var positionId = $("#position").val();
    var url = domain + "position/" + positionId;
    $.get(url, function (data, status) {
        if (status == "success") {
            console.log("查询position成功");
            var position = data;
            var tag = $("input[name='tag']").val();
            //创建tag
            $.ajax({
                type: 'POST',
                url: domain + "tag/",
                data: JSON.stringify({"name": tag}),
                success: function (result, status) {
                    var tagId = result["id"];
                    position["has"].push({"id": tagId});
                    //更新department
                    $.ajax(
                        {
                            type: 'PUT',
                            url: url,
                            data: JSON.stringify(position),
                            dataType: "json",
                            contentType: "application/json",
                            success: function () {
                                alert("添加成功！");
                                resetSelects();
                                $("input[name='tag']").val("");
                            }
                        }
                    );
                },
                dataType: "json",
                contentType: "application/json"
            });
        }
        else {
            console.log("查询position失败");
        }
    });
}


function getById(tableName, id) {
    var entity = {};
    var url = domain + tableName + "/" + id;
    $.ajax(
        {
            url: url,
            type: "GET",
            async: false,
            success: function (data, status) {
                entity = data;
            }
        }
    );
    return entity;
}

//提交表单
$("#submit").click(function () {
    $(this).text("请稍等...");
    $("#resetButton").remove();
    var description = $("#description").val();  //描述
    var itemA = {"item_no": 0, "content": $("#ItemA").val()};
    var itemB = {"item_no": 1, "content": $("#ItemB").val()};
    var itemC = {"item_no": 2, "content": $("#ItemC").val()};
    var itemD = {"item_no": 3, "content": $("#ItemD").val()};
    var items = [itemA, itemB, itemC, itemD];
    var itemsAddResult = [];
    for (var i in items) {
        var item = items[i];
        //添加item
        $.ajax({
            type: 'POST',
            url: domain + "Item/",
            data: JSON.stringify(item),
            success: function (result, status) {
                if (status == "success") {
                    itemsAddResult.push(result);
                }
            },
            dataType: "json",
            contentType: "application/json",
            async: false
        });
    }
    //构建problem
    var answerNo = $("input[type='radio']:checked").val();
    var answer = itemsAddResult[answerNo];
    var problem = {};
    problem["description"] = description;
    problem["item"] = itemsAddResult;
    problem["answer"] = answer;
    var companyTypeId = $("#companyType").val();
    problem["companytype"] = getById("Companytype", companyTypeId);
    var departmentId = $("#department").val();
    problem["department"] = getById("department", departmentId);
    var positionId = $("#position").val();
    problem["position"] = getById("position", positionId);
    var tagIds = $("#tags").val();
    var hastag = [];
    for (var i in tagIds) {
        var tagId = tagIds[i];
        hastag.push({"id": tagId});
    }
    problem["hastag"] = hastag;
    problem["exist"] = 1;
    $.ajax({
        type: 'POST',
        url: domain + "Problem/",
        data: JSON.stringify(problem),
        success: function (result, status) {
            if (status == "success") {
                alert("添加成功");
                reload();
            }
        },
        dataType: "json",
        contentType: "application/json"
    });

});
