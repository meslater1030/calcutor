from __future__ import unicode_literals
from __future__ import division
import pytest
import clean_string


def test_min_val():
    min = clean_string.min_val("1,4,8")
    assert min == "1.0"
    min = clean_string.min_val("0.34,9,7.3,8")
    assert min == "0.34"
    with pytest.raises(SyntaxError):
        clean_string.min_val("[1,2,3],5")


def test_max_val():
    max = clean_string.max_val("1,4,8")
    assert max == "8.0"
    max = clean_string.max_val("0.34,9,7.3,8")
    assert max == "9.0"
    with pytest.raises(SyntaxError):
        clean_string.max_val("[1,2,3],5")


def test_ipart():
    ipart = clean_string.ipart("3.56")
    assert ipart == "3.0"
    ipart = clean_string.ipart("9")
    assert ipart == "9.0"


def test_fpart():
    fpart = clean_string.fpart("3.56")
    assert fpart == "0.56"
    fpart = clean_string.fpart("9")
    assert fpart == "0.0"


def test_gcd():
    gcd = clean_string.gcd("6,9")
    assert gcd == "3"


def test_lcm():
    lcm = clean_string.lcm("6,9")
    assert lcm == "18"


def test_two_integers():
    x, y = clean_string.two_integers("9,6")
    assert x == 9
    assert y == 6
    assert type(x) == int
    assert type(y) == int
    x, y = clean_string.two_integers("9.0,6.0")
    assert x == 9
    assert y == 6
    assert type(x) == int
    assert type(y) == int
    with pytest.raises(SyntaxError):
        clean_string.two_integers("1.2,9.5")
    with pytest.raises(SyntaxError):
        clean_string.two_integers("1.3.5")


def test_randint():
    randint = clean_string.randint("5,9")
    assert float(randint).is_integer
    assert int(randint) <= 9
    assert int(randint) >= 5


def test_x_root():
    x_root = clean_string.x_root("3x_root8")
    assert x_root == "2.0"
    with pytest.raises(SyntaxError):
        clean_string.x_root("*x_root10")
    with pytest.raises(SyntaxError):
        clean_string.x_root("3x_root*")
    x_root = clean_string.x_root("2*3x_root8+6")
    assert x_root == "2*2.0+6"


def test_fix_decimals():
    decimal = clean_string.fix_decimals(".2")
    assert decimal == "0.2"
    decimal = clean_string.fix_decimals("(.2)")
    assert decimal == "(0.2)"
    decimal = clean_string.fix_decimals(").2")
    assert decimal == ")0.2"
