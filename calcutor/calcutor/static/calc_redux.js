$(function(){
    var last_input = "";
    var input = "";
    var output = "";
    var menu = ".home";

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
        var cur = $(menu + " .cursor");
        cur.text(token);
        cur.removeClass('cursor');
        if (cur.next().length == 0){
            cur.after("<ins></ins>")
        }
        cur.next().addClass('cursor');
        if (menu == ".home") {
            input += token;
        }
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
        switch ($(this).attr('id')) {
            case '+':
            case '-':
            case '/':
            case '*':
            case '^':
            case '\u00B2':
                {
                    if (input == ""){
                        input = write_it('Ans');
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
                    input = write_it(this.id);
                }
                break;
            case 'right':
                {
                    if ($(".cursor").next().length == 0){
                        break;
                    }
                    var cur = $(".cursor");
                    cur.css("background-color", "rgba(0, 0, 0, 0)")
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
                    cur.css("background-color", "rgba(0, 0, 0, 0)")
                    cur.removeClass("cursor");
                    cur.prev().addClass("cursor");
                }
                break;
            case 'up':
                {
                    if (menu == ".home") {
                        var cur = $(".cursor");
                        cur.removeClass("cursor");
                        if($(cur.prevAll()[35]).length == 0){
                            $(".input:last ins:first").addClass("cursor");
                            break;
                        };
                        $(cur.prevAll()[35]).addClass("cursor");
                    } else if (menu == ".yequals") {
                        var cur = $(".cursor");
                        if (cur.parent().prev().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().prev().find("ins:not(ins:first)").first().addClass("cursor");
                        };
                    };
                }
                break;
            case 'down':
                {
                    if (menu == ".home") {
                        var cur = $(".cursor");
                        cur.removeClass("cursor");
                        if($(cur.nextAll()[35]).length == 0){
                            $(".input:last ins:last").addClass("cursor");
                            break;
                        };
                        $(cur.nextAll()[35]).addClass("cursor");
                    } else if (menu == ".yequals") {
                        var cur = $(".cursor");
                        if (cur.parent().next().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().next().find("ins:not(ins:first)").first().addClass("cursor");
                        };
                    };
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
                    $(".yequals").hide();
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
            case 'y_equals':
                {
                    menu = ".yequals";
                    $(".home").toggle();
                    $(".yequals").toggle();
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
            case 'math':
                {
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    var $math_submenu = $("#math_submenu");
                    $math_submenu.addClass("cursor");
                    $("#math_menu").show();
                    $(".num_submenu").hide();
                    $(".cpx_submenu").hide();
                    $(".prb_submenu").hide();
                    $(".input").hide();
                    $(".output").hide();
                }
                break;
            case 'quit':
                {
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    $("#math_menu").hide();
                    $(".input").show();
                    $(".output").show();
                    $(".input").append("<ins class='cursor'></ins>");
                }
                break;
            case 'graph':
                {
                    var equations = {};
                    for (i=0; i<10; i++){
                        var yfn = "";
                        var $y = $($(".y_func")[i]);
                        $y.find("ins:not(ins:first)").each(function(){
                            yfn += this.innerHTML;
                        });
                        equations[$y.find("ins:first").text()] = yfn;
                    };
                    $.ajax({
                        type: "POST",
                        url: "/graph/",
                        data: equations,
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
            default: break;
        };
        update_scroller();
        $("ins:not(.cursor)").css("background-color", "rgba(0, 0, 0, 0)");
    });
    $("#math_menu").hide();
});