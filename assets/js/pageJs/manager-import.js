domain = "http://106.14.222.99:8080/Entity/U1c601c1d10384f/test3/";
$("button").click(function () {
    var input = $("input[name='filename']")[0];
    var file = input.files[0];
    filename = file.name.split(".")[0];
    var reader = new FileReader();
    reader.onload = function () {
        console.log("data=" + this.result);
        var resultJson = JSON.parse(this.result);
        for (var i in resultJson) {
            var problem = resultJson[i];
            addProblem(problem);
        }
        alert("导入成功！");
    }
    reader.readAsText(file);
});

//为了简化操作当没有时不在创建
function addProblem(problem) {
    var createProblem = {};
    var description = problem["description"];
    createProblem["description"] = description;
    //创建item
    var items = problem["item"];
    var itemsIds = [];
    for (var i in items) {
        var item = items[i];
        var result = createEntity("Item", {"item_no": parseInt(i), "content": item});
        itemsIds.push({"id": result["id"]});
    }
    createProblem["item"] = itemsIds;
    //设置答案
    var answerNo = problem["answer"];
    var answerItem = itemsIds[answerNo];
    createProblem["answer"] = answerItem;
    var companytype = problem["companytype"];
    var companyTypeId = getIdByName("Companytype", companytype);
    createProblem["companytype"] = {"id": companyTypeId};
    var department = problem["department"];
    var departmentId = getIdByName("Department", department);
    createProblem["department"] = {"id": departmentId};
    var position = problem["position"];
    var positionId = getIdByName("Position", position);
    createProblem["position"] = {"id": positionId};
    var tags = problem["tags"];
    var tagIds = [];
    for (var i in tags) {
        var tag = tags[i];
        var tagId = getIdByName("Tag", tag);
        tagIds.push({"id": tagId});
    }
    createProblem["hastag"] = tagIds;
    createEntity("Problem", createProblem);
}

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

function getIdByName(tableName, name) {
    var returnResult = {};
    var url = domain + tableName + "/" + "?" + tableName + ".name=" + name;
    $.ajax({
        type: 'GET',
        url: url,
        success: function (result, status) {
            console.log("getIdByName result=" + JSON.stringify(result));
            returnResult = result;
        },
        dataType: "json",
        async: false
    });
    return returnResult[tableName][0]["id"];
}


