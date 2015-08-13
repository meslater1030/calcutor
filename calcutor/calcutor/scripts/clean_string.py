from __future__ import unicode_literals
from __future__ import division

import re
import math


def clean_string(input):
    checkParens(input)
    if re.search(r'[+\-*/=]{2,}', input):
        raise SyntaxError
    for unic, byte in [(u'\u02c9', '-'),
                       (u'\u00B2', '^2'),
                       (u'3\u221a', 'cube_root'),
                       (u'x\u221a', 'x_root'),
                       (u'\u221a', 'sqrt'),
                       (u'\u00B3', '^3'),
                       (u'sin^-1', 'asin'),
                       (u'cos^-1', 'acos'),
                       (u'tan^-1', 'atan'),
                       (u'\u03c0', 'PI')]:
        input = input.replace(unic, byte)
    for reg_ex in [r'(\d+)(X)', r'(X)(\d+)', r'(\d+)(\()', r'(\))(\d+)']:
        input = re.sub(reg_ex, r'\1 * \2', input)
    input = parse_function(input)
    input = x_root(input)
    input = fix_decimals(input)
    return input


def checkParens(input):
    input.replace("{", "[")
    input.replace("}", "]")
    count = 0
    for x in input:
        if x == "(":
            count += 1
        elif x == ")":
            count -= 1
        if count == -1:
            raise SyntaxError


def fix_decimals(input):
    if input[0] == '.':
        input = '0' + input
    for item in [('+.', '+0.'),
                 ('*.', '*0.'),
                 ('/.', '0/.'),
                 ('-.', '0-.'),
                 ('(.', '(0.'),
                 (').', ')0.')]:
        input = input.replace(item[0], item[1])
    return input

operators = ['*', '+', '-', '/']


def parse_function(input):
    for function in functions:
        if function in input:
            index = input.index(function)
            if index > 0 and input[index - 1] not in operators:
                raise SyntaxError
            beginning = index + len(function)
            end = beginning + 1
            while end < (len(input) - 1):
                if input[end] == ")":
                    break
                else:
                    end += 1
            to_evaluate = input[beginning:end]
            evaluated = functions[function](to_evaluate)
            input = input.replace(input[index:end+1], evaluated)
    return input


def min_val(to_evaluate):
    if '[' in to_evaluate or ']' in to_evaluate:
        # come back to fix this to accept lists if time
        raise SyntaxError
    to_evaluate = to_evaluate.split(',')
    return str(min([float(x) for x in to_evaluate]))


def max_val(to_evaluate):
    if '[' in to_evaluate or ']' in to_evaluate:
        # come back to fix this to accept lists if time
        raise SyntaxError
    to_evaluate = to_evaluate.split(',')
    return str(max([float(x) for x in to_evaluate]))


def ipart(to_evaluate):
    return str(float(to_evaluate) // 1)


def fpart(to_evaluate):
    return str(float(to_evaluate) % 1)


def gcd(to_evaluate):
    to_evaluate = to_evaluate.split(',')
    try:
        x, y = to_evaluate
        x = int(x)
        y = int(y)
        while(y):
            x, y = y, x % y
        return str(x)
    except ValueError:
        raise SyntaxError


def lcm(to_evaluate):
    to_evaluate = to_evaluate.split(',')
    try:
        x, y = to_evaluate
        x = int(x)
        y = int(y)
        lcm = (x*y)//int(gcd(','.join(to_evaluate)))
        return str(lcm)
    except ValueError:
        raise SyntaxError

functions = {
    "iPart(": ipart,
    "fPart(": fpart,
    "min(": min_val,
    "max(": max_val,
    "lcm(": lcm,
    "gcd(": gcd,
}


def x_root(input):
    if 'x_root' in input:
        index = input.index('x_root')
        if input[index-1] in operators or input[index+6] in operators:
            raise SyntaxError
        left = index-1
        right = index + 6
        while left > 0:
            if input[left] in operators:
                break
            else:
                left -= 1
        while right < (len(input) - 1):
            if input[right] in operators:
                break
            else:
                right += 1
        if left == 0:
            replacement = (math.pow(float(input[index+6:right+1]),
                           (1/float(input[:index]))))
        else:
            replacement = (math.pow(float(input[index+6:right+1]),
                           (1/float(input[left:index-1]))))
        input = input.replace(input[left:right+1], str(replacement))
    return input
