from pyramid.view import view_config
from scripts import simple_math


@view_config(route_name='home', renderer='templates/mytemplate.jinja2')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        output = simple_math.evaluate(input)
        return {'output': output}
    return {}
