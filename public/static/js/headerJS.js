
// let xhr = new XMLHttpRequest();
// xhr.open("get", "/")
// xhr.send()
// xhr.timeout = 10000
// xhr.onload = ( function () {
//     console.log(xhr);
// })

function regMenu() {
    $(document).off("click");
    toggleHidden($("#profile").children("div"))
    toggleHidden($(`#logMenus>#${$(this).attr("id")}`))
    $("#logCurrentMenu>div").css("display", "none")
    $(`#logCurrentMenu>#${$(this).attr("id")}`).css("display", "")
    $("#logMenus").click(function (e) { if ($(e.target).closest("#logCurrentMenu").length) { return } toggleHidden($("#logMenus")); $("#logMenus").off("click")})
}
function toggleHidden(Obj) {
    Obj.toggleClass("hidden shown")
}

$("#profileMiniMenu>#signIn, #profileMiniMenu>#signUp").click(regMenu)
$("#searchForm").click( function () {
    if ($(this).children("button").attr("class") != "btn btn-outline-success"){
        $(this).children("button").remove()
        $(this).append($("<input>").attr("class", "form-control me-2").attr("type", "search").attr("placeholder", "Search").attr("aria-label", "Search").attr("name", "q").focus())
        $(this).append($("<button>").attr("class", "btn btn-outline-success").attr("type", "submit").text("Search"))
    }
})
$("#profile").hover( function () {
    if ($(this).children("div").attr("class") == "hidden") {
        toggleHidden($(this).children("#profileMiniMenu"))
    }
}, function () { $(document).click(function (e) { if ($(e.target).closest("#profile").length) { return } toggleHidden($("#profile").children("#profileMiniMenu")); $(document).off("click"); })})