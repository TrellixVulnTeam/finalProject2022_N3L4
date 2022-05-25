$("#anotherWay").click( function () {
    $("main form>input").each( function (index)  {
        switch (index) {
            case 0:
                $(this).attr("placeholder", $(this).attr("placeholder") == "Почта" ? "Телефон" : "Почта")
                break;
            case 1:
                $(this).attr("placeholder", $(this).attr("placeholder") == "Пароль" ? "Код" : "Пароль")
                $("#sendCodeAgain").toggleClass("d-none")
                break
        }
    })
    $(this).html($(this).html() == "Создать по почте" ? "Создать по номеру телефона" : "Создать по почте")
})