# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import fourFn, graph_parse
from pyparsing import ParseException

ERROR_MSG = b"ERR: SYNTAX"


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def home_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            input = fourFn.clean_string(input)
        except SyntaxError:
            return {'output': ERROR_MSG}
        try:
            fourFn.BNF().parseString(input)
            try:
                output = fourFn.evaluateStack()
            except ValueError:
                return {'output': b"ERR: DOMAIN"}
        except ParseException:
            return {'output': ERROR_MSG}
        if float.is_integer(output):
            output = int(output)
        output = fourFn.sci_notation(output)
        output = unicode(output).encode('utf-8')
        return {'output': output}
    return {}


@view_config(route_name='graph', renderer='json')
def graph_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            input = fourFn.clean_string(input)
        except SyntaxError:
            return {'output': ERROR_MSG}
        graph_parse.graph_parse(input)
