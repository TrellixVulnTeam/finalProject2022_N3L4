$("#anotherWay").click( function () {
    $("main form>input:nth-child(2)").attr("placeholder", $("main form>input:nth-child(2)").attr("placeholder") == "Телефон" ? "Почта" : "Телефон")
    $("form>input:nth-last-child(2)").prop("required", $("form>input:nth-last-child(2)").prop("required") == true ? false :  true)
    $("form>input:nth-last-child(2)").toggleClass("d-none")
    $("form>input:nth-last-child(3)").prop("required", $("form>input:nth-last-child(2)").prop("required") == true ? false :  true)
    $("form>input:nth-last-child(3)").toggleClass("d-none")
    $("#sendCodeAgain").css("top", $("#sendCodeAgain").css("top") == "-175px" ? "-373px" : "-175px")
    $("main>div>div>div:last-child").css("height", $("main>div>div>div:last-child").css("height") == "704px" ? "auto" : "704px")
    $(this).html($(this).html() == "Создать по почте" ? "Создать по номеру телефона" : "Создать по почте")
})