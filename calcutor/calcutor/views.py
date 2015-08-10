from pyramid.view import view_config
from scripts import simple_math


@view_config(route_name='home', renderer='index.html')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            output = simple_math.evaluate(input)
        except ValueError:
            error_msg = "That isn't a valid calculator input."
            return {'output': error_msg}
        return {'output': output}
    return {}
