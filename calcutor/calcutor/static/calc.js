$(function(){
    var input = "";
    $("#buttons button").click(function(event){
        input = input.concat( $(this).attr( "id" ) );
        $("#screen .input:last").text(input);
    });

    $("#ENTER").click(function(event){
        $.ajax({
            type: "GET",
            url: "",
            data: {input: input}
        }).done(function(response){
            $("#screen .output:last").text(response.output);
            $("#screen").append("<p class='input'></p>");
            $("#screen").append("<p class='output'></p>");
            input = "";
            $("#screen").scrollTop($("#screen")[0].scrollHeight);
        }).fail(function(){
            $("#screen .output:last").text("Something Went Wrong");
            $("#screen").append("<p class='input'></p>");
            $("#screen").append("<p class='output'></p>");
            input = "";
            $("#screen").scrollTop($("#screen")[0].scrollHeight);
        });
    });

});