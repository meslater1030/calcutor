# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import division
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
            import pdb; pdb.set_trace()
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
                result = request.params.get('\\Y{}:'.format(str(x))).strip()
            except KeyError:
                continue
            if result:
                equations.append(result)
        if not equations:
            request.response.status = 400
            return {'error': 'No equations to graph.'}
        try:
            for idx, eq in enumerate(equations):
                equations[idx] = simple_math.clean_string(eq)
        except SyntaxError:
            request.response.status = 400
            return {'error': ERROR_MSG}
        try:
            output = graph_parse.graph_parse(equations)
        except (TypeError, ValueError):
            request.response.status = 400
            return {'error': ERROR_MSG}
        return {'output': output}
