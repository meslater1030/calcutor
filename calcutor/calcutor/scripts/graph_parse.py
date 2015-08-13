# -*- coding: utf-8 -*-
from __future__ import unicode_literals, division
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import numexpr as ne
import cStringIO
import base64


def graph_parse(equations, settingsdict):
    for k in settingsdict:
        settingsdict[k] = settingsdict[k].replace(u'\u02c9', '-')
    replacevals = [
        ('^', '**'),
        ('acos', 'arccos'),
        ('asin', 'arcsin'),
        ('atan', 'arctan'),
    ]
    xmin = float(settingsdict['Xmin'])
    xmax = float(settingsdict['Xmax'])
    ymin = float(settingsdict['Ymin'])
    ymax = float(settingsdict['Ymax'])
    for idx, eq in enumerate(equations):
        for calc, gval in replacevals:
            eq = eq.replace(calc, gval)
        equations[idx] = eq
    fig = plt.figure()
    ax = fig.add_subplot(111)
    X = np.arange(-10, 11, .1)
    for eq in equations:
        if 'X' not in eq:
            ax.axhline(y=ne.evaluate(eq), color='k')
        else:
            Y = ne.evaluate(eq)
            ax.plot(X, Y, color='k')
    ax.axhline(y=0, color='k')
    ax.axvline(x=0, color='k')
    ax.set_xlim(xmin, xmax)
    ax.set_ylim(ymin, ymax)
    ax.xaxis.set_ticks(np.arange(xmin, xmax + 1, float(settingsdict['Xscl'])))
    ax.yaxis.set_ticks(np.arange(ymin, ymax + 1, float(settingsdict['Yscl'])))
    buf = cStringIO.StringIO()
    fig.savefig(buf, format='png', transparent=True)
    encoded = base64.b64encode(buf.getvalue())
    plt.close()
    return encoded
