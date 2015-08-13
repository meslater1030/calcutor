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
        to_fraction = False
        if '>Frac' in input:
            to_fraction = True
        if '!' in input:
            output = clean_string.factorial(input)
            return {'output': output}
        try:
            input = clean_string.clean_string(input)
        except SyntaxError as e:
            return {'output': e.message}
        try:
            simple_math.BNF().parseString(input)
            try:
                output = simple_math.evaluateStack()
            except ValueError:
                return {'output': b"ERR: DOMAIN"}
        except ParseException:
            return {'output': ERROR_MSG}
        if type(output) == float:
            if float.is_integer(output):
                output = int(output)
        if to_fraction:
            output = simple_math.decimal_to_fraction(output)
        else:
            output = simple_math.sci_notation(output)
        output = unicode(output).encode('utf-8')
        return {'output': output}
    return {}


@view_config(route_name='graph', renderer='json')
def graph_view(request):
    if request.method == 'POST':
        eqdict = request.json_body.get('equations')
        settingsdict = request.json_body.get('settings')
        equations = []
        for x in xrange(10):
            try:
                result = eqdict.get('\\Y{}:'.format(str(x))).strip()
            except (KeyError, AttributeError):
                continue
            if result:
                equations.append(result)
        if not equations:
            request.response.status = 400
            return {'error': 'No equations to graph.'}
        try:
            for idx, eq in enumerate(equations):
                equations[idx] = clean_string.clean_string(eq)
        except SyntaxError:
            request.response.status = 400
            return {'error': ERROR_MSG}
        try:
            output = graph_parse.graph_parse(equations, settingsdict)
        except (TypeError, ValueError, SyntaxError) as e:
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
            except KeyError:
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
