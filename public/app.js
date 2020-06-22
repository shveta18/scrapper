//ROUTE 1: To scrape the news website and save it to the database when scrape button clicked
$(".scrape-btn").on("click", function (event) {
    event.preventDefault();
    console.log("button clicked");

    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        console.log(data);
    });
});

