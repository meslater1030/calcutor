# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import division
from pyramid.view import view_config
from scripts import simple_math, graph_parse, clean_string
from pyparsing import ParseException

ERROR_MSG = b"ERR: SYNTAX"


@view_config(route_name='home', xhr=True, renderer='json')
@view_config(route_name='home', renderer='templates/index.jinja2')
def home_view(request):
    if request.method == 'POST':
        input = request.params.get('input')
        if '!' in input and '(' in input:
            output = clean_string.factorial(input)
            return {'output': output}
        try:
            output = clean_string.parse_string(input)
        except (ParseException,
                ValueError,
                SyntaxError,
                ZeroDivisionError) as e:
            if e.message == "":
                output = ERROR_MSG
            else:
                output = e.message
        return {'output': output}
    return {}


@view_config(route_name='graph', renderer='json')
def graph_view(request):
    if request.method == 'POST':
        eqdict = request.json_body.get('equations')
        settingsdict = request.json_body.get('settings')
        equations = []
        import pdb; pdb.set_trace()
        for x in xrange(10):
            try:
                result = eqdict.get('\\Y{}:'.format(str(x))).strip()
            except (KeyError, AttributeError):
                continue
            if result:
                equations.append(result)
        if equations:
            try:
                for idx, eq in enumerate(equations):
                    equations[idx] = clean_string.clean_string(eq)
            except SyntaxError:
                request.response.status = 400
                return {'error': ERROR_MSG}
        try:
            output = graph_parse.graph_parse(equations, settingsdict)
        except (TypeError, ValueError, SyntaxError):
            request.response.status = 400
            return {'error': ERROR_MSG}
        return {'output': output}


@view_config(route_name='table', renderer='json')
def table_view(request):
    if request.method == 'POST':
        output = {}
        xvalue = request.params.get('X').strip()
        if not xvalue:
            for x in xrange(10):
                output[str(x)] = ""
            return {'output': output}
        for x in xrange(10):
            try:
                output[str(x)] = request.params.get('\\Y{}:'.format(
                    str(x))).strip()
            except (KeyError, AttributeError):
                continue

        for key in output:
            if not output[key]:
                continue
            try:
                output[key] = clean_string.clean_string(output[key])
            except SyntaxError:
                output[key] = 'ERR'

            output[key] = output[key].replace('X', xvalue)

            try:
                simple_math.BNF().parseString(output[key])
            except ParseException:
                output[key] = 'ERR'
            else:
                try:
                    output[key] = simple_math.evaluateStack()
                except ValueError:
                    output[key] = 'ERR'
                if float.is_integer(output[key]):
                    output[key] = int(output[key])
        return {'output': output}
