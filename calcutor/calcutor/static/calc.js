$(function(){
    var output = "";
    var last_input = "";
    var input = "";
    var operators = ["/", "*", "+", "-"];


    var parse_string = function(string){
        return string.split("Ans").join(output);
    };

    $("#buttons button:not(.special)").click(function(event){
        if (operators.indexOf($(this).attr( "id" )) > -1 && input == ""){
            input = "Ans";
        };
        input = input.concat( $(this).attr( "id" ) );
        $("#screen .input:last").text(input);
    });

    $("#ENTER").click(function(event){
        if (input == ""){
            input = last_input;
        } else {
            last_input = input;
        };
        input = parse_string(input);
        $.ajax({
            type: "POST",
            url: "/",
            data: {input: input}
        }).done(function(response){
            output = response.output;
            $("#screen .output:last").text(output);
            $("#screen").append("<p class='input'></p>");
            $("#screen").append("<p class='output'>{{ output }}</p>");
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