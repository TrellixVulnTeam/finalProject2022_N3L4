

$(document).ready( function (){
    $(".dishImgDiv").css("height", $(".dishImgDiv").css("height"))
    $(".dishImgDiv>img").toggleClass("w-100")
    $(".dishImgDiv>img").css("transform", `translateY(${($(".dishImgDiv").css("height").split("px")[0] - $(".dishImgDiv>img").css("height").split("px")[0]) / 2}px)`)
})


$(window).resize( function () {
    $(".dishImgDiv>img").toggleClass("w-100")
    $(".dishImgDiv").css("height", $(".dishImgDiv").css("height"))
    $(".dishImgDiv>img").toggleClass("w-100")
    $(".dishImgDiv>img").css("transform", `translateY(${($(".dishImgDiv").css("height").split("px")[0] - $(".dishImgDiv>img").css("height").split("px")[0]) / 2}px)`)
})