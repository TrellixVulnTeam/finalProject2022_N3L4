function toggleHidden(Obj) {
    Obj.toggleClass("hidden shown")
}

$(".topDishesCards>div").each(function (index) {
    if (index > 3) {
        $(this).toggleClass("d-none")
    }
})

$(".topDishesText>button, .topDishesCards>div:last-child").click(function () {
    $(".topDishesCards").toggleClass("topDishesCardsOpened")
    $(".topDishesCards>div").each(function (index) {
        if (index > 3) {
            $(this).toggleClass("d-none notHiddenCard")
        }
    })
})

$(".typesOfIngridients>button").click(function () {
    $(this).children("input").prop("checked", $(this).children("input").prop("checked") == false ? true : false);
})

$(document).ready( function (){
    let minHeight = 0
    $(".mostPopularDishesCards .topDishImgDiv").each(function (index) { if ( $(this).css("height") < minHeight || index == 0) { minHeight = $(this).css("height") } })
    $(".mostPopularDishesCards .topDishImgDiv").each( function () { $(this).css("height", minHeight) })
})


$(window).resize( function () {
    $(".mostPopularDishesCards .topDishImgDiv").each(function (index) { $(this).css("height", "") })
    let minHeight = 0
    $(".mostPopularDishesCards .topDishImgDiv").each(function (index) { if ( $(this).css("height") < minHeight || index == 0) { minHeight = $(this).css("height") } })
    $(".mostPopularDishesCards .topDishImgDiv").each( function () { $(this).css("height", minHeight) })
})