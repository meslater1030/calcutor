$(function(){
    var last_input = "";
    var input = "";
    var output = "";
    $(".second").hide();

    var update_scroller = function() {
        $("#screen").scrollTop($("#screen")[0].scrollHeight);
    };
    var write_it = function(token){
        var curr = $(".home .input:last .cursor");
        curr.text(token);
        curr.removeClass('cursor');
        curr.after("<ins class='cursor'></ins>");
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
            $(".home").append("<p class='input'><ins class='cursor'></ins></p>");
            $(".home").append("<p class='output'></p>");
        });
    };

    $("#buttons button").click(function(event) {
        switch ($(this).attr('id')) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                {
                    write_it(this.id);
                }
            case '+':
            case '-':
            case '/':
            case '*':
            case '\u00B2':
                {
                    if (input == ""){
                        write_it('Ans');
                    };
                    write_it(this.id);
                }
                break;
            case 'clear':
                {
                    $(".home").empty();
                    $(".home").append("<p class='input'><ins class='cursor'></ins></p>");
                    $(".home").append("<p class='output'></p>");
                    input = "";
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
            default: break;
        };
    });
});