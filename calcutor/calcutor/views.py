# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyramid.view import view_config
from scripts import simple_math, graph_parse
from pyparsing import ParseException

ERROR_MSG = b"ERR: SYNTAX"


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def home_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        try:
            input = simple_math.clean_string(input)
        except SyntaxError:
            return {'output': ERROR_MSG}
        try:
            simple_math.BNF().parseString(input)
            try:
                output = simple_math.evaluateStack()
            except ValueError:
                return {'output': b"ERR: DOMAIN"}
        except ParseException:
            return {'output': ERROR_MSG}
        if float.is_integer(output):
            output = int(output)
        output = simple_math.sci_notation(output)
        output = unicode(output).encode('utf-8')
        return {'output': output}
    return {}


@view_config(route_name='graph', renderer='json')
def graph_view(request):
    if request.method == 'POST':
        equations = []
        for x in xrange(10):
            try:
                result = request.params.get('\\Y{}:'.format(str(x)))
            except KeyError:
                continue
            if result:
                equations.append(result)
        if not equations:
            return {'output': 'No equations to graph.'}
        try:
            equations = [simple_math.clean_string(eq) for eq in equations]
        except SyntaxError:
            return {'output': ERROR_MSG}
        output = graph_parse.graph_parse(equations)
        return {'output': output}
