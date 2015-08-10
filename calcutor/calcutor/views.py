# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import fourFn
from pyparsing import ParseException


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        input = input.replace('\u02c9', '-')
        try:
            fourFn.BNF().parseString(input)
            output = fourFn.evaluateStack()
        except ParseException:
            error_msg = b"That isn't a valid calculator input."
            return {'output': error_msg}
        if float.is_integer(output):
            output = int(output)
        output = unicode(output).encode('utf-8')
        return {'output': output}
    return {}
