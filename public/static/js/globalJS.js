
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
let closeMiniMenuTimeout = undefined

function regMenu() {
    if ($("#logMenus").attr("class").split(" ").indexOf("hidden") != -1) {
        toggleHidden($("#logMenus"))
        $("#logMenus").click(function (e) { if ($(e.target).closest("#logCurrentMenu").length) { return } toggleHidden($("#logMenus")); $("#logMenus").off("click")})
    }
    if ($(this).attr("id") == "dishCard"){
        $("div#dishCardMenu").css("display", "")
        $("div#logCurrentMenu").css("display", "none")
        $("div#logCurrentMenu .enterButton").css("display", "none")
    }else {
        $("div#logCurrentMenu").css("display", "")
        $("div#dishCardMenu").css("display", "none")
        $("div#logCurrentMenu>div").css("display", "none")
        $(`div#logCurrentMenu>#${$(this).attr("id")}`).css("display", "")
        $(".enterButton").attr("shownUser", "hidden")
        $(`div#${$(this).attr("id")} .enterButton`).attr("shownUser", $(this).attr("id"))
    }
}

function toggleHidden(Obj) {
    Obj.toggleClass("hidden shown")
}

$("button#signInE, button#passwordResetEC, button#signInP").click(regMenu)

$("#searchForm").click( function () {
    if ($(this).children("button").attr("class") != "btn btn-outline-success"){
        $(this).children("button").remove()
        $(this).append($("<input>").attr("class", "form-control me-2").attr("type", "search").attr("placeholder", "Search").attr("aria-label", "Search").attr("name", "q").focus())
        $(this).append($("<button>").attr("class", "btn btn-outline-success").attr("type", "submit").text("Search"))
    }
})
$("#profile, .profileMiniMenu").hover( function () {
    if ($(".profileMiniMenu").attr("class").split(" ").indexOf("hidden") != -1) {
        toggleHidden($(".profileMiniMenu"))
    }
    if (closeMiniMenuTimeout != undefined) {
        clearTimeout(closeMiniMenuTimeout);
    }
}, function () {closeMiniMenuTimeout = setTimeout(function () { if ($(".profileMiniMenu").attr("class").split(" ").indexOf("hidden") == -1) { toggleHidden($($(".profileMiniMenu"))); $(document).off("click") } }, 5000); 
                $(document).off("click").click(function (e) { if ($(e.target).closest("#profile").length) { return } toggleHidden($(".profileMiniMenu")); $(document).off("click"); })
            })
$(".topDishImgDiv button").click( function () {
    console.log($(this).children("img").attr("src"));
    $(this).children("img").attr("src", $(this).children("img").attr("src") == "/images/likedHeart.svg" ? "/images/unlikedHeart.svg" : "/images/likedHeart.svg")
})