# This module is heavily modified from the following:
#
# fourFn.py
#
# Demonstration of the pyparsing module, implementing a simple 4-function
# expression parser,
# with support for scientific notation, and symbols for e and pi.
# Extended to add exponentiation and simple built-in functions.
# Extended test cases, simplified pushFirst method.
#
# Copyright 2003-2006 by Paul McGuire
#

# lcm and gcd code from
# http://www.programiz.com/python-programming/examples/lcm

from __future__ import division
from pyparsing import (Literal,
                       CaselessLiteral,
                       Word,
                       Combine,
                       Optional,
                       ZeroOrMore,
                       Forward,
                       nums,
                       alphas)
import math
import operator
from fractions import Fraction
from decimal import Decimal

exprStack = []


def pushFirst(strg, loc, toks):
    exprStack.append(toks[0])


def pushUMinus(strg, loc, toks):
    if toks and toks[0] == '-':
        exprStack.append('unary -')
        # ~ exprStack.append( '-1' )
        # ~ exprStack.append( '*' )

bnf = None


def BNF():
    """
    expop   :: '^'
    multop  :: '*' | '/'
    addop   :: '+' | '-'
    integer :: ['+' | '-'] '0'..'9'+
    atom    :: PI | E | real | fn '(' expr ')' | '(' expr ')'
    factor  :: atom [ expop factor ]*
    term    :: factor [ multop factor ]*
    expr    :: term [ addop term ]*
    """
    global bnf
    if not bnf:
        point = Literal(".")
        e = CaselessLiteral("E")
        fnumber = Combine(Word("+-"+nums, nums) +
                          Optional(point + Optional(Word(nums))) +
                          Optional(e + Word("+-"+nums, nums)))
        ident = Word(alphas, alphas+nums+"_$")

        plus = Literal("+")
        minus = Literal("-")
        mult = Literal("*")
        div = Literal("/")
        lpar = Literal("(").suppress()
        rpar = Literal(")").suppress()
        addop = plus | minus
        multop = mult | div
        expop = Literal("^")
        pi = CaselessLiteral("PI")

        expr = Forward()
        atom = ((Optional("-") + (pi | e | fnumber | ident +
                                  lpar + expr + rpar).setParseAction(pushFirst)
                | (lpar + expr.suppress() + rpar)).setParseAction(pushUMinus))

        # by defining exponentiation as "atom [ ^ factor ]..." instead of
        # "atom [ ^ atom ]...", we get right-to-left exponents, instead of
        # left-to-right
        # that is, 2^3^2 = 2^(3^2), not (2^3)^2.
        factor = Forward()
        factor << atom + ZeroOrMore((expop + factor).setParseAction(pushFirst))

        term = factor + ZeroOrMore((multop +
                                    factor).setParseAction(pushFirst))
        expr << term + ZeroOrMore((addop + term).setParseAction(pushFirst))
        bnf = expr
    return bnf

# map operator symbols to corresponding arithmetic operations
epsilon = 1e-12
opn = {"+": operator.add,
       "-": operator.sub,
       "*": operator.mul,
       "/": operator.truediv,
       "^": operator.pow}
fn = {"sin": math.sin,
      "cos": math.cos,
      "tan": math.tan,
      "abs": abs,
      "sqrt": math.sqrt,
      "log": math.log,
      "acos": math.acos,
      "asin": math.asin,
      "atan": math.atan,
      "trunc": lambda a: int(a),
      "round": round,
      "sgn": lambda a: abs(a) > epsilon and cmp(a, 0) or 0,
      "x_root": math.pow,
      "int": int,
      }


def evaluateStack():
    op = exprStack.pop()
    if op == 'unary -':
        return -evaluateStack()
    if op in "+-*/^":
        op2 = evaluateStack()
        op1 = evaluateStack()
        try:
            return opn[op](op1, op2)
        except ZeroDivisionError:
            raise ZeroDivisionError("ERR: DIVIDE BY 0")
    elif op == "PI":
        return math.pi  # 3.1415926535
    elif op == "E":
        return math.e  # 2.718281828
    elif op == "ln":
        return math.log(evaluateStack(), math.e)
    elif op == "cube_root":
        return evaluateStack()**(1/3)
    elif op in fn:
        return fn[op](evaluateStack())
    elif op[0].isalpha():
        return 0
    else:
        return float(op)


def decimal_to_fraction(output):
    frac = Fraction(Decimal(str(output)))
    return str(frac.numerator) + "/" + str(frac.denominator)


def sci_notation(output):
    if output >= 10000000000 and output.isalpha() is False:
        return '%e' % output
    else:
        return output
