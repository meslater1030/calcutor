# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import simple_math


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        for unic, byte in [('\u02c9', '-'), ('\u00B2', '**2'), ('^', '**')]:
            input = input.replace(unic, byte)
        try:
            output = simple_math.evaluate(input)
            output = unicode(output).encode('utf-8')
        except ValueError:
            output = b"That isn't a valid calculator input."
        return {'output': output}
    return {}
