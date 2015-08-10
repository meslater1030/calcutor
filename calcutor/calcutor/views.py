from pyramid.view import view_config
from scripts import simple_math


@view_config(route_name='home', renderer='json')
def my_view(request):
    input = request.params.get('input')
    output = simple_math.evaluate(input)
    return {'output': output}
