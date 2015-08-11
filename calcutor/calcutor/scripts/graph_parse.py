# -*- coding: utf-8 -*-
from __future__ import unicode_literals, division
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import numexpr as ne
import cStringIO
import base64


def graph_parse(input):
    replacevals = [
        ('^', '**'),
        ('acos', 'arccos'),
        ('asin', 'arcsin'),
        ('atan', 'arctan'),
    ]
    for calc, gval in replacevals:
        input = input.replace(calc, gval)
    fig = plt.figure()
    ax = fig.add_subplot(111)
    X = np.arange(-10, 11, 1)
    Y = ne.evaluate(input)
    ax.plot(X, Y, color='k')
    ax.axhline(y=0, color='k')
    ax.axvline(x=0, color='k')
    ax.set_xlim(-20, 20)
    ax.set_ylim(-20, 20)
    buf = cStringIO.StringIO()
    fig.savefig(buf, format='png', transparent=True)
    encoded = base64.b64encode(buf.getvalue())
    plt.close()
    return encoded
