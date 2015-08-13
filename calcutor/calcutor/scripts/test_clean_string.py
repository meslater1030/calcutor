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
    with pytest.raises(SyntaxError):
        clean_string.ipart("1.2,9.5")
    with pytest.raises(SyntaxError):
        clean_string.ipart("1.3.5")


def test_fpart():
    fpart = clean_string.fpart("3.56")
    assert fpart == "0.56"
    fpart = clean_string.fpart("9")
    assert fpart == "0.0"
    with pytest.raises(SyntaxError):
        clean_string.fpart("1.2,9.5")
    with pytest.raises(SyntaxError):
        clean_string.fpart("1.2.4")


def test_gcd():
    gcd = clean_string.gcd("6,9")
    assert gcd == "3"
    gcd = clean_string.gcd("5.0,15.0")
    assert gcd == "5"
    with pytest.raises(SyntaxError):
        clean_string.gcd("1,3,9")
    with pytest.raises(SyntaxError):
        clean_string.gcd("3.2,8.1")


# def test_lcm():
#     lcm = clean_string.lcm("6,9")
#     assert lcm == "18"
#     lcm = clean_string.lcm("5.0,15.0")
#     assert lcm == "15"
#     with pytest.raises(SyntaxError):
#         clean_string.lcm("1,3,9")
#     with pytest.raises(SyntaxError):
#         clean_string.lcm("3.2,8.1")
