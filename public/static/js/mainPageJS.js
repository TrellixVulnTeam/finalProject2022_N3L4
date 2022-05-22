function toggleHidden(Obj) {
    Obj.toggleClass("hidden shown")
}

$(".topDishesCards>div").each( function (index) {
    if (index > 3) {
        $(this).toggleClass("d-none")
    }
})

$(".topDishesText>button, .topDishesCards>div:last-child").click( function () {
    $(".topDishesCards").toggleClass("topDishesCardsOpened")
    $(".topDishesCards>div").each( function (index) {
        if (index > 3) {
            $(this).toggleClass("d-none notHiddenCard")
        }
    })
})