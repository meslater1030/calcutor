$(function(){
    /*************** GLOBALS ***************/
    var last_input = "";
    var output = "";
    var tableinput = "";
    var menu = ".home";

    setInterval(function(){
        if ($(menu + " .cursor").text() == ""){
            $(menu + " .cursor").text(" ")
        }
        if ($(menu + " .cursor").css("background-color") == "transparent" ||
            $(menu + " .cursor").css("background-color") == "rgba(0, 0, 0, 0)"){
            $(menu + " .cursor").css("background-color", "rgba(0, 0, 0, 0.6)");
        } else {
            $(menu + " .cursor").css("background-color", "rgba(0, 0, 0, 0)");
        };

    }, 500);

    $(".tablewrapper").scrollLeft(0);

    /*************** HELPERS ***************/

    /***** VISUAL *****/
    var update_scroller = function() {
        $("#screen").scrollTop($("#screen")[0].scrollHeight);
    };

    var show_graph = function(graph) {
        $(".graph").html('<img src="data:image/png;base64,' + graph + '" id="graphimg" />');
        hide_all();
        $(".graph").show();
        $(".cursor").removeClass("cursor");
    };

    var hide_all = function(){
        $(".home").hide();
        $(".yequals").hide();
        $(".math_menu").hide();
        $(".graph").hide();
        $(".table").hide();
        $(".windowmenu").hide();

        $("#all_menus").show();
    };

    /***** SCREEN INTERACTION *****/
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

    /***** AJAX CALLS *****/
    var send_it = function(string){
        var output = "";
        $.ajax({
            type: "POST",
            url: "/",
            async: false,
            data: {input: string}
        }).done(function(response){
            output = response.output;
        }).fail(function(){
            output = "Your mother was a hamster and your father smelt of elderberries!";
        });
        return output;
    };

    var get_graph = function(equations, settings){
        var output = "";
        $.ajax({
            type: "POST",
            url: "/graph/",
            data: JSON.stringify({equations: equations, settings: settings}),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(response){
            show_graph(response.output);
        }).fail(function(){
            $(".home .output:last").text("ERR: GRAPH SYNTAX");
            hide_all();
            $(".home").show();
        }).always(function(){
            menu = ".home";
        });
    };

    function update_table(){
        var table_row = $(".table .cursor").parent().parent();
        equations = get_equations();
        table_row.find("ins").each(function(idx, val){
            tableinput += val.textContent;
        })
        equations['X'] = tableinput;
        tableinput = "";
        $.ajax({
            type: "POST",
            url: "/table/",
            data: equations,
        }).done(function(response){
            output = response.output;
            table_row.find(".output").each(function(idx, val){
                val.textContent = output[idx+1];
            });
            table_row.find(".Y0")[0].textContent = output[0];
        }).fail(function(){
            $(".home .output:last").text("ERR: TABLE SYNTAX");
            $(".table").hide();
            $(".home").show();
            menu = ".home";
        });
    };


    /***** PARSING *****/
    var get_input = function(){
        var input = "";
        $(".home .input:last ins").each(function(){
            input += this.innerHTML;
        });
        return input.trim();
    };

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
        var win = {};
        var names = ['Xmin', 'Xmax', 'Xscl', 'Ymin', 'Ymax', 'Yscl'];
        for (clas in names){
            var val = "";
            var $setting = $("."+names[clas]);
            $setting.find("ins").each(function(){
                val += this.innerHTML;
            });
            win[names[clas]] = val;
        };
        return win;
    };


    /***** OTHER *****/
    var math_ans = function(eq){
        switch (eq) {
            case '>Frac':
            case '>Dec':
            case '\u00B3':
            case 'x\u221a':
            case '>Rect':
            case '>Polar':
            case 'nPr':
            case 'nCr':
            case '!':
                {
                    if (get_input() == ""){
                        write_it('Ans');
                    };
                }
                break;
        };
    };



    /*************** FUNCTIONALITY ***************/

    /***** BUTTONS *****/
    $("#buttons button").click(function(event) {
        $(".alpha").hide();
        $(".second").hide();
        $(".default").show();
        $(".python").remove();
        switch ($(this).attr('id')) {
            case '+':
            case '-':
            case '/':
            case '*':
            case '^':
            case '\u00B2':
            case '^-1':
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
            case 'XT':
                {
                    write_it('X');
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
                            cur.removeClass("cursor");
                            $(".submenu:first").addClass("cursor");
                        }
                    } else if ($("li").hasClass("cursor")) {
                        break;
                    }
                    if (menu == ".home") {
                        cur.removeClass("cursor");
                        if($(cur.prevAll()[42]).length == 0){
                            $(".home .input:last ins:first").addClass("cursor");
                            break;
                        };
                        $(cur.prevAll()[42]).addClass("cursor");
                    } else if (menu == ".yequals" || menu == ".windowmenu") {
                        if (cur.parent().prev().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().prev().find("ins:first").first().addClass("cursor");
                        };
                    } else if (menu == ".table") {
                        if (cur.parent().parent().prev().find("ins").length != 0){
                            cur.removeClass("cursor");
                            cur.parent().parent().prev().find("ins:first").first().addClass("cursor");
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
                        if($(cur.nextAll()[42]).length == 0){
                            $(".home .input:last ins:last").addClass("cursor");
                            break;
                        };
                        $(cur.nextAll()[42]).addClass("cursor");
                    } else if (menu == ".yequals" || menu == ".windowmenu") {
                        if (cur.parent().next().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().next().find("ins:first").first().addClass("cursor");
                        };
                    } else if (menu == ".table") {
                        if (cur.parent().parent().next().length != 0){
                            cur.removeClass("cursor");
                            cur.parent().parent().next().find("ins:first").first().addClass("cursor");
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
                    hide_all();
                    $(".yequals").show();
                }
                break;
            case 'ENTER':
                {

                    if (menu == ".table"){
                        update_table();
                    } else if ($(menu + " ins").hasClass("cursor")){
                            if (menu == ".yequals"){
                                $("#down").click();
                                break;
                            };
                            if (menu == ".windowmenu"){
                                $("#down").click();
                                break;
                            };

                            input = get_input()
                            if (input == ""){
                                input = last_input;
                            };
                            last_input = input;
                            input = input.split("Ans").join(output);
                            output = send_it(input);
                            $(".home .output:last").text(output);
                            $(".cursor").removeClass("cursor");
                            $(".home").append("<p class='input'><ins class='cursor'></ins></p>");
                            $(".home").append("<p class='output'></p>");
                            input = "";
                    } else if ($(menu + ".submenu").hasClass("cursor")){
                        var cur_id = "." + $(menu + ".cursor").attr('id');
                        $(".submenu_options").hide();
                        $(cur_id).show();
                    } else if ($("p" + menu).hasClass("cursor")){
                        if ( $(".yequals ins").hasClass("cursor") ){
                            $(".yequals .cursor").removeClass("cursor");
                            $(".home .input:last ins:last").addClass("cursor");
                        };
                        var cur = $(menu + " .cursor");
                        cur.css("background-color", "rgba(0, 0, 0, 0)")
                        var cur_id = $(menu + " .cursor").attr('id');
                        $("#all_menus").hide();
                        $(".home").show();
                        $("p.cursor").removeClass("cursor");
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
                    hide_all();
                    $(".math_menu").show();
                    $(".math_submenu").show();
                    $(".num_submenu").hide();
                    $(".cpx_submenu").hide();
                    $(".prb_submenu").hide();
                }
                break;
            case 'quit':
                {
                    $(".cursor").removeClass("cursor");
                    menu = ".home";
                    hide_all();
                    $(".home").show();
                    $(".home .input:last ins:last").addClass("cursor");
                }
                break;
            case 'graph':
                {
                    var settings = get_graph_window();
                    $.each(settings, function(index, val){
                        settings[index] = send_it(val);
                    });
                    var graph = get_graph(get_equations(), settings);
                }
                break;
            case 'TABLE':
                {
                    hide_all();
                    $(".table .cursor").removeClass("cursor")
                    $(".table").show();
                    $(".table ins:first").addClass("cursor")
                    menu = ".table";
                }
                break;
            case 'window':
                {
                    hide_all();
                    $(".windowmenu").show();
                    menu = ".windowmenu";
                    $(".windowmenu ins:first").addClass("cursor");
                }
                break;
            default: {
                var pythonArray = ["wshyX6Hw52I", "QqreRufrkxM", "523uxFMUTGA", "S3I5XcsReT0", "AAW6D21ICdg", "xzYO0joolR0", "H_Mgx8Ytjag", "qry9IeJnbNU", "M_eYSuPKP3Y", "U0kJHQpvgB8"];
                var rand = pythonArray[Math.floor(Math.random() * pythonArray.length)];
                $("#screen").append("<iframe class='python' width='100%' height='100%' src='https://www.youtube.com/embed/" + rand + "?autoplay=1&controls=0&showinfo=0' frameborder='0'></iframe>");
            }

            break;
        };
        update_scroller();
        $(".home .input ins:not(.input:last .cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        $("ins:not(.cursor)").css("background-color", "rgba(0, 0, 0, 0)");
        $("button").blur();
    });

    $("#guide").click(function(event){
        $("#instructionscontent").toggle();
    });

    /***** KEYBORD INPUT *****/
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
                    document.getElementById("XT").click();
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
            case "n":
                {
                    document.getElementById("\u02C9").click();
                }
                break;
            case "a":
                {
                    document.getElementById("Ans").click();
                }
                break;
            case "m":
                {
                    document.getElementById("math").click();
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