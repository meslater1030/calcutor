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
        if ( $(menu + " .cursor").is("ins") ) {
            var cur = $(menu + " .cursor");
            cur.text(token);
            cur.removeClass('cursor');
            if (cur.next().length == 0){
                cur.after("<ins> </ins>")
            }
            cur.next().addClass('cursor');
        };
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
    var get_input = function(){
        var input = "";
        $(".home .input:last ins").each(function(){
            input += this.innerHTML;
        });
        return input.trim();
    };

    var math_ans = function(eq){
        switch (eq) {
            case '>Frac':
            case '>Dec':
            case '\u00B3':
            case '>Rect':
            case '>Polar':
            case 'nPr':
            case 'nCr':
            case '!':
                {
                    if (input == ""){
                        write_it('Ans');
                    };
                }
                break;
        };
    };

    $("#buttons button").click(function(event) {
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
                    if (menu == ".home" && get_input() == ""){
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
            case '.':
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
                    if ($(menu + " .cursor").next().length == 0){
                        break;
                    } else if ($("p").hasClass("cursor")) {
                        break;
                    };
                    var cur = $(menu + " .cursor");
                    cur.css("background-color", "rgba(0, 0, 0, 0)")
                    cur.removeClass("cursor");
                    cur.next().addClass("cursor");
                }
                break;
            case 'left':
                {
                    if ($(menu + " .cursor").prev().length == 0){
                        break;
                    } else if ($("p").hasClass("cursor")) {
                        break;
                    };
                    var cur = $(menu + " .cursor");
                    cur.css("background-color", "rgba(0, 0, 0, 0)")
                    cur.removeClass("cursor");
                    cur.prev().addClass("cursor");
                }
                break;
            case 'up':
                {
                    var cur = $(menu + " .cursor");
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
                    } else if (menu == ".yequals" || menu == ".windowmenu") {
                        if (cur.parent().prev().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().prev().find("ins:first").first().addClass("cursor");
                        };
                    };
                }
                break;
            case 'down':
                {
                    var cur = $(menu + " .cursor");
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
                        cur.removeClass("cursor");
                        if($(cur.nextAll()[35]).length == 0){
                            $(".home .input:last ins:last").addClass("cursor");
                            break;
                        };
                        $(cur.nextAll()[35]).addClass("cursor");
                    } else if (menu == ".yequals" || menu == ".windowmenu") {
                        if (cur.parent().next().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().next().find("ins:first").first().addClass("cursor");
                        };
                    };
                }
                break;
            case 'delete':
                {
                    var cur = $(menu + " .cursor");
                    if (cur.next().length != 0 && cur.is("ins")){
                        cur.next().addClass('cursor');
                        cur.remove()
                    };
                }
                break;
            case 'clear':
                {
                    $(".cursor").removeClass('cursor');
                    menu = ".home";
                    $(".yequals").hide();
                    $(".math_menu").hide();
                    $(".windowmenu").hide();
                    $(".graph").hide();
                    $(".table").hide();
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
                    $(".cursor").removeClass("cursor");
                    $(".yequals .y_func:first ins:first").addClass('cursor');
                    menu = ".yequals";
                    $(".home").hide();
                    $("#all_menus").show();
                    $(".windowmenu").hide();
                    $(".view").hide();
                    $(".yequals").show();
                }
                break;
            case 'ENTER':
                {

                    if (menu == ".table"){
                        update_table();
                    };
                    if ($(menu + " ins").hasClass("cursor")){
                            if (menu == ".yequals"){
                                $("#down").click();
                                break;
                            };
                            input = get_input()
                            if (input == ""){
                                input = last_input;
                            };
                            last_input = input;
                            input = input.split("Ans").join(output);
                            send_it(input);
                            input = "";
                    } else if ($(menu + ".submenu").hasClass("cursor")){
                        var cur_id = "." + $(menu + ".cursor").attr('id');
                        $(".submenu_options").hide();
                        $(cur_id).show();
                    } else if ($("p" + menu).hasClass("cursor")){
                        var cur = $(menu + ".cursor");
                        cur.css("background-color", "rgba(0, 0, 0, 0)")
                        var cur_id = $(menu + ".cursor").attr('id');
                        $("#all_menus").hide();
                        $(".home").show();
                        menu = ".home"
                        math_ans(cur_id);
                        write_it(cur_id);
                    };
                }
                break;
            case 'math':
                {
                    menu = ".math_menu";
                    var $math_submenu = $(".submenu:first");
                    $math_submenu.addClass("cursor");
                    $(".math_menu").show();
                    $("#all_menus").show();
                    $(".math_submenu").show();
                    $(".graph").hide();
                    $(".num_submenu").hide();
                    $(".cpx_submenu").hide();
                    $(".prb_submenu").hide();
                    $(".home").hide();
                    $(".yequals").hide();
                }
                break;
            case 'quit':
                {
                    menu = ".home";
                    $("#all_menus").hide();
                    $(".yequals").hide();
                    $(".home").show()
                }
                break;
            case 'graph':
                {
                    $.ajax({
                        type: "POST",
                        url: "/graph/",
                        data: {equations: get_equations(), settings: get_graph_window()}
                    }).done(function(response){
                        output = response.output;
                        $(".graph").html('<img src="data:image/png;base64,' + output + '" id="graphimg" />');
                        $(".home").hide();
                        $(".view").hide();
                        $(".graph").show();
                        input = "";
                        menu = ".home";
                    }).fail(function(){
                        $(".home .output:last").text("ERR: GRAPH SYNTAX");
                        $(".yequals").hide();
                        $(".home").show();
                        menu = ".home";
                    });
                }
                break;
            case 'TABLE':
                {
                    $(".view").hide();
                    $(".table").show();
                    menu = ".table";
                }
                break;
            case 'window':
                {
                    $("#all_menus").show();
                    $(".math_menu").hide();
                    $(".home").hide();
                    $(".yequals").hide();
                    $(".windowmenu").show();
                    menu = ".windowmenu";
                    $(".windowmenu ins:first").addClass("cursor");
                }
                break;
            default: break;
        };
        update_scroller();
        $(".home .input ins:not(.input:last .cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        $("ins:not(.cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        $("button").blur();
    });

    function get_equations(){
        var equations = {};
        for (i=0; i<10; i++){
            var yfn = "";
            var $y = $($(".y_func")[i]);
            $y.find("ins").each(function(){
                yfn += this.innerHTML;
            });
            equations[$y.find("span").text()] = yfn;
        };
        return equations;
    };
    function get_graph_window(){
        var win = {}
        for (clas in ['Xmin', 'Xmax', 'Xscl', 'Ymin', 'Ymax', 'Yscl']){
            var val = "";
            var $setting = $("."+clas);
            $setting.find("ins").each(function(){
                val += this.innerHTML;
            });
            win[clas] = val;
        };
        return win;
    };


    $("body").keyup(function(event){
        switch (event.key) {
            case "Enter":
                {
                    $("#ENTER").click();
                }
                break;
            case "Up":
            case "ArrowUp":
                {
                    $("#up").click();
                }
                break;
            case "Down":
            case "ArrowDown":
                {
                    $("#down").click();
                }
                break;
            case "Left":
            case "ArrowLeft":
                {
                    $("#left").click();
                }
                break;
            case "Right":
            case "ArrowRight":
                {
                    $("#right").click();
                }
                break;
            case "Del":
            case "Delete":
                {
                    $("#delete").click();
                }
                break;
            case "s":
                {
                    document.getElementById("sin(").click();
                }
                break;
            case "c":
                {
                    document.getElementById("cos(").click();
                }
                break;
            case "t":
                {
                    document.getElementById("tan(").click();
                }
                break;
            case "i":
                {
                    document.getElementById("\u2148").click();
                }
                break;
            case " ":
                {
                    document.getElementById("\u2423").click();
                }
                break;
            case "x":
                {
                    document.getElementById("X").click();
                }
                break;
            case "p":
                {
                    document.getElementById("\u03C0").click();
                }
                break;
            case "g":
                {
                    document.getElementById("graph").click();
                }
                break;
            case "y":
                {
                    document.getElementById("y_equals").click();
                }
                break;
            case "Esc":
            case "Escape":
                {
                    $("#clear").click();
                }
                break;
            case "Backspace":
                {
                    $("#left").click();
                    $("#delete").click();
                }
                break;
            default:
                {
                    if (document.getElementById(event.key) != null) {
                        document.getElementById(event.key).click();
                    };
                }
                break;
        };
    });

    $("#all_menus").hide();
});