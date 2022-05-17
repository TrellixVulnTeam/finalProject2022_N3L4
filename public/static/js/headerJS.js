
// let xhr = new XMLHttpRequest();
// xhr.open("get", "/")
// xhr.send()
// xhr.timeout = 10000
// xhr.onload = ( function () {
//     console.log(xhr);
// })

// Написать пример того, что возвращается в шаблон {"items": [] } 
// or
// добавить закомментированные возвраты данных через res.send(result) вместо res.render(__dirname ..., result)

function regMenu() {
    console.log($("#logMenus").attr("class"));
    if ($("#logMenus").attr("class").split(" ").indexOf("hidden") != -1) {
        toggleHidden($("#logMenus"))
        $("#logMenus").click(function (e) { if ($(e.target).closest("#logCurrentMenu").length) { return } toggleHidden($("#logMenus")); $("#logMenus").off("click")})
    }
    $("#logCurrentMenu>div").css("display", "none")
    $(`#logCurrentMenu>#${$(this).attr("id")}`).css("display", "")
}

function toggleHidden(Obj) {
    Obj.toggleClass("hidden shown")
}

$("button#signInE, button#signUpE, button#signUpP, p#passwordResetEC, p#signInP").click(regMenu)
$("#searchForm").click( function () {
    if ($(this).children("button").attr("class") != "btn btn-outline-success"){
        $(this).children("button").remove()
        $(this).append($("<input>").attr("class", "form-control me-2").attr("type", "search").attr("placeholder", "Search").attr("aria-label", "Search").attr("name", "q").focus())
        $(this).append($("<button>").attr("class", "btn btn-outline-success").attr("type", "submit").text("Search"))
    }
})
$("#profile :not(#logMenus)").hover( function () {
    if ($(this).parent().children("div").attr("class") == "hidden") {
        toggleHidden($(this).parent().children("#profileMiniMenu"))
    }
}, function () { $(document).off("click").click(function (e) { if ($(e.target).closest("#profile").length) { return } toggleHidden($("#profileMiniMenu")); $(document).off("click"); })})