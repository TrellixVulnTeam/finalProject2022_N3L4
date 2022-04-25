function regMenu() {
    $("body").prepend($("<div>").toggleClass("row align-items-center").css("height", "100%").css("width", "100%").css("background-color", "rgba(0, 0, 0, 0.4)").css("position", "fixed").css("z-index", "99"))
    switch ($(this).attr("id")) {
        case "signIn":
            $("body>div").append($("<div>").addClass("col-lg-6 offset-lg-3").css("padding", "122px 89px 173px 89px").css("background-color", "white"))
            break;
    
        case "signUp":
            $("body>div").append($("<div>").addClass("col-lg-6 offset-lg-3").css("padding", "122px 44px 104px 89px").css("background-color", "white"))
            break;
    }
}
$("#searchForm").click( function () {
    if ($(this).children("button").attr("class") != "btn btn-outline-success"){
        console.log(1);
        $(this).children("button").remove()
        $(this).append($("<input>").attr("class", "form-control me-2").attr("type", "search").attr("placeholder", "Search").attr("aria-label", "Search").focus())
        $(this).append($("<button>").attr("class", "btn btn-outline-success").attr("type", "submit").attr("name", "search").text("Search"))
    }
})
$("#profile").hover(function () {
    if (!$(this).children("div").length) {
        $(this).append($("<div>").attr("id", "profileMiniMenu").css("background-color", "white").css("padding", "20px 10px").css("position", "absolute").css("position", "absolute").css("top", "100px").css("left", "-57px").append($("<img>").attr("src", `#`).attr("alt",
         "profileMiniMenuImg")).append($("<button>").addClass("btn").attr("id", "signIn").html("Войти<br>в аккаунт").click(regMenu)).append($("<button>").addClass("btn").attr("id", "signUp").html("Зарегистрировать<br>аккаунт").click(regMenu)))
    }
}, function () { $(document).off("click").click(function (e) { if ($(e.target).closest("#profile").length) { return } $("#profile>div").remove() })})