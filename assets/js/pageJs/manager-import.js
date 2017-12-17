$("button").click(function () {
    var input = $("input[name='filename']")[0];
    var file = input.files[0];
    filename = file.name.split(".")[0];
    var reader = new FileReader();
    reader.onload = function () {
        var resultJson = JSON.parse(this.result)[0].description;
        console.log("desciption=" + resultJson)
    }
    reader.readAsText(file);
});
