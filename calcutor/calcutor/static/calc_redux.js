$(function(){
    var last_input = "";
    var input = "";
    var output = "";

    setInterval(function(){
        if ($(".cursor").text() == ""){
            $(".cursor").text(" ")
        }
        if ($(".cursor").css("background-color") == "transparent"){
            $(".cursor").css("background-color", "rgba(0, 0, 0, 0.6)");
        } else {
            $(".cursor").css("background-color", "rgba(0, 0, 0, 0)");
        };

    }, 500);

    var update_scroller = function() {
        $("#screen").scrollTop($("#screen")[0].scrollHeight);
    };
    var write_it = function(token){
        var curr = $(".home .input:last .cursor");
        curr.text(token);
        curr.removeClass('cursor');
        if (curr.next().length == 0){
            curr.after("<ins></ins>")
        }
        curr.next().addClass('cursor');
        input += token;
    };
    var send_it = function(string){
        $.ajax({
            type: "POST",
            url: "/",
            data: {input: input}
        }).done(function(response){
            output = response.output;
            $(".home .output:last").text(output);
        }).fail(function(){
            $(".home .output:last").text("Something Went Wrong");
        }).always(function(){
            $(".cursor").removeClass("cursor");
            $(".home").append("<p class='input'><ins class='cursor'></ins></p>");
            $(".home").append("<p class='output'></p>");
        });
    };

    $("#buttons button").click(function(event) {
        $(".home .input ins:not(.input:last .cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        switch ($(this).attr('id')) {
            case '+':
            case '-':
            case '/':
            case '*':
            case '^':
            case '\u00B2':
                {
                    if (input == ""){
                        write_it('Ans');
                    };
                }
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case '0':
            case '?':
            case ':':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case "\u03C0":
            case "\u02C9":
            case "\u2148":
            case "\u0022":
            case "\u2423":
            case "\u221A(":
            case 'ln(':
            case 'e^(':
            case 'e':
            case '10^(':
            case 'log(':
            case 'sin(':
            case 'tan(':
            case 'cos(':
            case 'sin^-1(':
            case 'tan^-1(':
            case 'cos^-1(':
            case '(':
            case '(':
            case ')':
            case '{':
            case '}':
            case '[':
            case ']':
            case ',':
            case 'Ans':
                {
                    write_it(this.id);
                }
                break;
            case 'right':
                {
                    if ($(".cursor").next().length == 0){
                        break;
                    }
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    cur.next().addClass("cursor");
                }
                break;
            case 'left':
                {
                    if ($(".cursor").prev().length == 0){
                        break;
                    }
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    cur.prev().addClass("cursor");
                }
                break;
            case 'up':
                {
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    if($(cur.prevAll()[35]).length == 0){
                        $(".input:last ins:first").addClass("cursor");
                        break;
                    };
                    $(cur.prevAll()[35]).addClass("cursor");
                }
                break;
            case 'down':
                {
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    if($(cur.nextAll()[35]).length == 0){
                        $(".input:last ins:last").addClass("cursor");
                        break;
                    };
                    $(cur.nextAll()[35]).addClass("cursor");
                }
                break;
            case 'delete':
                {
                    var cur = $(".cursor");
                    if (cur.next().length != 0){
                        cur.next().addClass('cursor');
                        cur.remove()
                    };
                }
                break;
            case 'clear':
                {
                    $(".graph").hide();
                    $(".home").show();
                    $(".home").empty();
                    $(".home").append("<p class='input'><ins class='cursor'></ins></p>");
                    $(".home").append("<p class='output'></p>");
                    input = "";
                }
                break;
            case 'second_mode':
                {
                    $(".default").toggle();
                    $(".second").toggle();
                }
                break;
            case 'alpha_mode':
                {
                    $(".default").toggle();
                    $(".alpha").toggle();
                }
                break;
            case 'ENTER':
                {
                    if (input == ""){
                        input = last_input;
                    };
                    last_input = input;
                    input = input.split("Ans").join(output);
                    send_it(input);
                    input = "";
                }
                break;
            case 'graph':
                {
                    $.ajax({
                        type: "POST",
                        url: "/graph/",
                        data: {input: "2X + 1"}
                    }).done(function(response){
                        output = response.output;
                        $(".graph").html('<img src="data:image/png;base64,' + output + '" id="graphimg" />');
                        $(".home").hide();
                        $(".graph").show();
                        input = "";
                        idx = 0;
                        update_cursor();
                    }).fail(function(){
                        $(".home .output:last").text("Something Went Wrong");
                    });
                }
                break;
            case 'TABLE':
                {
                    $(".home").hide();
                    $(".table").show();
                }
                break;
            default: break;
        };
        update_scroller();
    });
});