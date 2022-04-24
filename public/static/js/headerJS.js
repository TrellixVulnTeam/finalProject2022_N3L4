console.log(1);
$("#searchForm").click( function () {
    if ($(this).children("button").attr("class") != "btn btn-outline-success"){
        console.log(1);
        $(this).children("button").remove()
        $(this).append($("<input>").attr("class", "form-control me-2").attr("type", "search").attr("placeholder", "Search").attr("aria-label", "Search").focus())
        $(this).append($("<button>").attr("class", "btn btn-outline-success").attr("type", "submit").attr("name", "search").text("Search"))
    }
})