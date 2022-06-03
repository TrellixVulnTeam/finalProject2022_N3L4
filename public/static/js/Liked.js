$(document).ready( function (){
    if ($("main .row").children().length <= 1) {
        $("main .row .d-none").toggleClass("d-none")
    }
})