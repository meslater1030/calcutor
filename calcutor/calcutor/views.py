# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import fourFn, graph_parse
from pyparsing import ParseException

ERROR_MSG = b"ERR: SYNTAX"


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def my_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            input = fourFn.clean_string(input)
        except SyntaxError:
            return {'output': ERROR_MSG}
        try:
            fourFn.BNF().parseString(input)
            output = fourFn.evaluateStack()
        except ParseException:
            return {'output': ERROR_MSG}
        if float.is_integer(output):
            output = int(output)
        output = unicode(output).encode('utf-8')
        return {'output': output}
    return {}


@view_config(route_name='graph', renderer='json')
def graph_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        for unic, byte in [('\u02c9', '-'), ('\u00B2', '^2')]:
            input = input.replace(unic, byte)
        graph_parse.graph_parse(input)
