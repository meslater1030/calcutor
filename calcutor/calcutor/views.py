# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import simple_math


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            output = simple_math.evaluate(input)
            output = unicode(output).encode('utf-8')
        except ValueError:
            error_msg = b"That isn't a valid calculator input."
            return {'output': error_msg}
        return {'output': output}
    return {}
