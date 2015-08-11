$(function(){
    var output = "";
    var last_input = "";
    var input = "";
    var operators = ["/", "*", "+", "-", "\u00B2"];
    var idx = 0;
    var idy = 0;
    var $cursor = $("<p>", {
        id: "cursor",
        text: "|",
        css:{
            margin: '1px',
            position: "absolute",
            float: 'left',
            width: '100%',
            font: '1em Droid Sans Mono',
            'white-space': 'pre'
        }
    });
    $(".home").append($cursor);
    var menu = "home";

    /* ---- BASIC MATH ----
       0-9, + - * / ( ) and negative character
    */
    $("#buttons .num, #buttons .operator").click(function(event){
        if (menu == "home"){
            if (operators.indexOf($(this).attr( "id" )) > -1 && input == ""){
                input = "Ans";
                idx += 3;
            };
            input = input.slice(0, idx) +  $(this).attr( "id" ) + input.slice(idx);
            $(".home .input:last").text(input);
            idx += 1;
        } else if (menu == "yeq"){

        };
    });

    /* ---- SUBMENUS ----
       yeq
       navigation
    */
    $("#y_equals").click(function(event){
        $(".home").hide();
        $(".yeq").show();
        menu = "yeq";
    });
    $("#buttons #up").click(function(event){
        if (menu != "home") {
            idy -= 1;
        };
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
        $(".home .input:last").text(input);
    });

    $("#buttons #clear").click(function(event){
        $(".home").empty();
        $(".home").append("<p class='input'></p>");
        $(".home").append("<p class='output'></p>");
        input = "";
        idx = 0;
        $(".home").append($cursor);
        update_cursor();
        $("." + menu).hide();
        $(".home").show();
        menu = 'home';
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
            $(".home .output:last").text(output);
            $(".home").append("<p class='input'></p>");
            $(".home").append("<p class='output'></p>");
            input = "";
            idx = 0;
            update_cursor();
        }).fail(function(){
            $(".home .output:last").text("Something Went Wrong");
            $(".home").append("<p class='input'></p>");
            $(".home").append("<p class='output'></p>");
            input = "";
            idx = 0;
            update_cursor();
        });
    });

    /* ---- BASIC FUNCTIONALITY ----
       Things that happen for every button push
           -update cursor
           -update scroll
    */
    var update_cursor = function(){
        if (menu == "home") {
            $cursor.text(new Array(idx+1).join(' ') + "|");
            $cursor.css("top", $(".home .input:last").position().top);
            $cursor.css("left", $(".home .input:last").position().left);
        } else if (menu == "yeq") {
            $cursor.text(new Array(idx+1).join(' ') + "|");
            $cursor.css("top", $(".yeq .y_func")[idy].top);
            $cursor.css("left", $(".yeq .y_func")[idy].left);
        };
    };

    var update_scroller = function(){
        if (menu == "home") {
            $("#screen").scrollTop($("#screen")[0].scrollHeight);
        } else if (menu == "yeq") {
            $("#screen").scrollTop($("#screen .y_func")[idy].scrollHeight);
        };
    };

    $("#buttons").click(function(event){
        update_scroller();
        update_cursor();
    });

});