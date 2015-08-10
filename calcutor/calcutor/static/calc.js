$(function(){
    var output = "";
    var last_input = "";
    var input = "";
    var operators = ["/", "*", "+", "-"];
    var idx = 0;
    var $cursor = $("<p>", {
        id: "cursor",
        text: "\u2588",
        css:{
            margin: '1px',
            position: "absolute",
            float: 'left',
            width: '100%',
            font: '12px',
            'white-space': 'pre'
        }
    });
    $("#screen").append($cursor);

    /* ---- BASIC MATH ----
       0-9, + - * / ( ) and negative character
    */
    $("#buttons .num, #buttons .operator").click(function(event){
        if (operators.indexOf($(this).attr( "id" )) > -1 && input == ""){
            input = "Ans";
            idx += 3;
        };
        input = input.slice(0, idx) +  $(this).attr( "id" ) + input.slice(idx);
        $("#screen .input:last").text(input);
        idx += 1;
    });

    /* ---- INPUT MODIFICATION ----
       left/right indexing, clear/del
    */
    $("#buttons #left").click(function(event){
        if (idx > 0){
            idx -= 1;
        };
    });

    $("#buttons #right").click(function(event){
        if (idx < input.length){
            idx += 1;
        };
    });

    $("#buttons #delete").click(function(event){
        input = input.slice(0, idx) + input.slice(idx + 1);
        $("#screen .input:last").text(input);
    });

    $("#buttons #clear").click(function(event){
        input = "";
        idx = 0;
        $("#screen .input:last").text(input);
    });


    /* ---- SUBMISSION ----
       enter key and needed parsing
    */
    var parse_string = function(string){
        return string.split("Ans").join(output);
    };

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
            $("#screen").append("<p class='output'></p>");
            input = "";
            idx = 0;
        }).fail(function(){
            $("#screen .output:last").text("Something Went Wrong");
            $("#screen").append("<p class='input'></p>");
            $("#screen").append("<p class='output'></p>");
            input = "";
            idx = 0;
        });
    });

    /* ---- BASIC FUNCTIONALITY ----
       Things that happen for every button push
           -update cursor
           -update scroll
    */
    $("#buttons").click(function(event){
        $cursor.text(new Array(idx+1).join(' ') + "\u2588");
        $cursor.css("top", $("#screen .input:last").position().top);
        $cursor.css("left", $("#screen .input:last").position().left);
        $("#screen").scrollTop($("#screen")[0].scrollHeight);
    });
    setInterval(function(){
        $cursor.toggle();
    }, 500);
});