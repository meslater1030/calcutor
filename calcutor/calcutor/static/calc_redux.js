$(function(){
    var last_input = "";
    var input = "";
    var output = "";
    var menu = ".home";

    setInterval(function(){
        if ($(menu + " .cursor").text() == ""){
            $(menu + " .cursor").text(" ")
        }
        if ($(menu + " .cursor").css("background-color") == "transparent"){
            $(menu + " .cursor").css("background-color", "rgba(0, 0, 0, 0.6)");
        } else {
            $(menu + " .cursor").css("background-color", "rgba(0, 0, 0, 0)");
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
            cur.after("<ins> </ins>")
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
        $(".home .input ins:not(.input:last .cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        $(".default").show();
        $(".alpha").hide();
        $(".second").hide();
        switch ($(this).attr('id')) {
            case '+':
            case '-':
            case '/':
            case '*':
            case '^':
            case '\u00B2':
                {
                    if (menu == ".home" && input == ""){
                        write_it('Ans');
                    };
                }
            case 'A':
            case '.':
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
                    } else if ($("p").hasClass("cursor")) {
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
                    } else if ($("p").hasClass("cursor")) {
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
                    var cur = $(".cursor");
                    cur.css("background-color", "rgba(0, 0, 0, 0)");
                    if ($("p").hasClass("cursor")) {
                        var previous = cur.prev().filter(":visible");
                        if ((previous.text() != "") && (previous.is("ul") == false)) {
                            cur.prev().addClass("cursor");
                            cur.removeClass("cursor");
                        } else {
                            $(".submenu:first").addClass("cursor");
                        }
                    } else if ($("li").hasClass("cursor")) {
                        break;
                    }
                    if (menu == ".home") {
                        cur.removeClass("cursor");
                        if($(cur.prevAll()[35]).length == 0){
                            $(".home .input:last ins:first").addClass("cursor");
                            break;
                        };
                        $(cur.prevAll()[35]).addClass("cursor");
                    } else if (menu == ".yequals") {
                        if (cur.parent().prev().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().prev().find("ins:not(ins:first)").first().addClass("cursor");
                        };
                    };
                }
                break;
            case 'down':
                {
                    var cur = $(".cursor");
                    cur.css("background-color", "rgba(0, 0, 0, 0)")
                    if ($("p").hasClass("cursor")) {
                        if (cur.attr('class').indexOf(cur.next().attr('class')) > -1) {
                            cur.next().addClass("cursor");
                            cur.removeClass("cursor");
                        } else {
                            break;
                        }
                    } else if ($("li").hasClass("cursor")){
                        $(".submenu_options:visible:first").addClass("cursor");
                        cur.removeClass("cursor");
                    }
                    if (menu == ".home") {
                        var cur = $(".cursor");
                        cur.removeClass("cursor");
                        if($(cur.nextAll()[35]).length == 0){
                            $(".home .input:last ins:last").addClass("cursor");
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
                    menu = ".home";
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
                    $(".default").hide();
                    $(".second").show();
                }
                break;
            case 'alpha_mode':
                {
                    $(".default").hide();
                    $(".alpha").show();
                }
                break;
            case 'y_equals':
                {
                    menu = ".yequals";
                    $(".home").hide();
                    $("#all_menus").show();
                    $(".yequals").show();
                    $(".math_menu").hide();
                    $(".graph").hide();
                }
                break;
            case 'ENTER':
                {
                    if ($("ins").hasClass("cursor")){
                        if (input == ""){
                            input = last_input;
                        };
                        last_input = input;
                        input = input.split("Ans").join(output);
                        send_it(input);
                        input = "";
                    } else if ($(".submenu").hasClass("cursor")){
                        var cur_id = "." + $(".cursor").attr('id');
                        $(".submenu_options").hide();
                        $(cur_id).show();
                    } else if ($("p").hasClass("cursor")){
                        var cur = $(".cursor");
                        cur.css("background-color", "rgba(0, 0, 0, 0)")
                        var cur_id = $(".cursor").attr('id');
                        $("#all_menus").hide();
                        $(".input").show();
                        $(".output").show();
                        $("ins").addClass("cursor");
                        menu = ".home"
                        write_it(cur_id);
                    }
                }
                break;
            case 'math':
                {
                    menu = ".math_menu";
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    var $math_submenu = $(".submenu:first");
                    $math_submenu.addClass("cursor");
                    $("#all_menus").show();
                    $(".math_submenu").show();
                    $(".num_submenu").hide();
                    $(".cpx_submenu").hide();
                    $(".prb_submenu").hide();
                    $(".input").hide();
                    $(".output").hide();
                }
                break;
            case 'quit':
                {
                    menu = ".home";
                    var cur = $(".cursor");
                    cur.removeClass("cursor");
                    $("#all_menus").hide();
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
                        $(".yequals").hide();
                        $(".graph").show();
                        input = "";
                        menu = ".home";
                    }).fail(function(){
                        $(".home .output:last").text("Something Went Wrong");
                        $(".yequals").hide();
                        $(".home").show();
                        menu = ".home";
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
        $("ins:not(.cursor)").css("background-color", "rgba(0, 0, 0, 0)");
    });
    $("#all_menus").hide();
});