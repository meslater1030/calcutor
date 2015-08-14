from __future__ import unicode_literals

import unittest
from pyramid import testing
import json

from views import home_view, graph_view


class ViewTests(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    def test_basic_math(self):
        for inp, outp in [('1+1', '2'), ('3-4', '-1'), ('3*4', '12'),
                          ('10/2', '5'), ('10/4', '2.5')]:
            request = testing.DummyRequest(params={'input': inp}, post={})
            info = home_view(request)
            self.assertEqual(info['output'], outp)

    def test_trig(self):
        for inp, outp in [('sin(0)', '0'), ('sin(\u03C0/2)', '1'),
                          ('cos(0)', '1'), ('cos(\u03C0/2)', '0'),
                          ('tan(0)', '0'), ('tan(\u03C0)', '0')]:
            request = testing.DummyRequest(params={'input': inp}, post={})
            info = home_view(request)
            self.assertEqual(str(int(float(info['output']))), outp)

    def test_order_of_oporations(self):
        for inp, outp in [('2(1+1)', '4'), ('2*1+1', '3'), ('3^4+1', '82'),
                          ('3^(4+1)', '243')]:
            request = testing.DummyRequest(params={'input': inp}, post={})
            info = home_view(request)
            self.assertEqual(info['output'], outp)

    def test_syntax_error(self):
        request = testing.DummyRequest(params={'input': 'fish taco'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], 'ERR: SYNTAX')

    def test_next_syntax_error(self):
        request = testing.DummyRequest(params={'input': '+'}, post={})
        with self.assertRaises(IndexError):
            info = home_view(request)

    def test_graph_view(self):
        equations = {'\\Y1:': '2X+1'}
        settings = {
            'Xmin': '-10', 'Xmax': '10', 'Xscl': '1', 'Ymin': '-10',
            'Ymax': '10', 'Yscl': '1'
        }
        input = {'equations': equations, 'settings': settings}
        request = testing.DummyRequest(
            path='/graph/', json_body=input, post={}
        )
        info = graph_view(request)
        decoded = info['output'].decode('base64', 'strict')
        self.assertEqual(
            info['output'], decoded.encode('base64').replace('\n', '')
        )

    def test_graph_error(self):
        equations = {'\\Y1:': '2X+1foo'}
        settings = {
            'Xmin': '-10', 'Xmax': '10', 'Xscl': '1', 'Ymin': '-10',
            'Ymax': '10', 'Yscl': '1'
        }
        input = {'equations': equations, 'settings': settings}
        request = testing.DummyRequest(
            path='/graph/', json_body=input, post={}
        )
        info = graph_view(request)
        self.assertEqual(info['error'], b"ERR: SYNTAX")


class FrontEndTests(unittest.TestCase):
    from splinter import Browser

    browser = Browser()

    def setUp(self):
        self.config = testing.setUp()
        self.browser.visit("localhost:8000/")

    def tearDown(self):
        testing.tearDown()

    def test_buttons(self):
        self.browser.find_by_id('1').first.click()
        text = self.browser.find_by_css('.input').first.text
        self.assertEqual(text, '1\n ')

    def test_cursor(self):
        cur = self.browser.find_by_css(".cursor")
        self.assertFalse(cur.is_empty())
        self.browser.find_by_id("1").first.click()
        cur = self.browser.find_by_css(".cursor")
        self.assertFalse(cur.is_empty())
        self.browser.find_by_id("ENTER").first.click()
        cur = self.browser.find_by_css(".cursor")
        self.assertFalse(cur.is_empty())
        self.browser.find_by_id("y_equals")
        cur = self.browser.find_by_css(".cursor")
        self.assertFalse(cur.is_empty())

    def test_enter(self):
        self.browser.find_by_id('1').first.click()
        self.browser.find_by_id('ENTER').first.click()
        text = self.browser.find_by_css('.output').first.text
        self.assertEqual(text, '1')

    def test_graph(self):
        self.browser.find_by_id('y_equals').first.click()
        self.browser.find_by_id('XT').first.click()
        self.assertTrue(self.browser.find_by_tag('img').is_empty())
        self.browser.find_by_id('graph').click()
        self.assertFalse(self.browser.find_by_tag('img').is_empty())

    def test_text_entry(self):
        for x in range(10):
            self.browser.find_by_id(str(x)).first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text,
                         "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n ")
        self.browser.find_by_id('left').first.click()
        self.browser.find_by_id('delete').first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text,
                         "0\n1\n2\n3\n4\n5\n6\n7\n8\n ")
        self.browser.find_by_id('up').first.click()
        self.browser.find_by_id('sin(').first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text,
                         "sin(\n1\n2\n3\n4\n5\n6\n7\n8\n ")
        self.browser.find_by_id('right').first.click()
        self.browser.find_by_id('delete').first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text,
                         "sin(\n1\n3\n4\n5\n6\n7\n8\n ")
        self.browser.find_by_id('down').first.click()
        self.browser.find_by_id('second_mode').first.click()
        self.browser.find_by_id('\u03C0').first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text,
                         "sin(\n1\n3\n4\n5\n6\n7\n8\n\u03C0\n ")

    def test_clear(self):
        self.browser.find_by_id("1").first.click()
        self.assertEqual(self.browser.find_by_css(".input").first.text, "1\n ")
        self.browser.find_by_id("clear").first.click()
        self.assertEqual(
            self.browser.find_by_css(".input").first.text.strip(), "")
        self.browser.find_by_id("y_equals").first.click()
        self.assertTrue(self.browser.is_text_present("Y1:"))
        self.browser.find_by_id("clear").first.click()
        self.assertFalse(self.browser.is_text_present("Y1:"))
        self.assertEqual(
            self.browser.find_by_css(".input").first.text.strip(), "")

    def test_math_menu(self):
        self.browser.find_by_id("math").first.click()
        self.assertTrue(self.browser.is_text_present("MATH"))
        self.assertTrue(self.browser.is_text_present("NUM"))
        self.assertTrue(self.browser.is_text_present("CPX"))
        self.assertTrue(self.browser.is_text_present("PRB"))

    def test_math_menu_traversing(self):
        self.browser.find_by_id("math").first.click()
        self.assertTrue(self.browser.is_text_present("\u00B3"))
        self.browser.find_by_id("right").first.click()
        self.browser.find_by_id("ENTER").first.click()
        self.assertTrue(self.browser.is_text_present("abs("))
        self.browser.find_by_id("right").first.click()
        self.browser.find_by_id("ENTER").first.click()
        self.assertTrue(self.browser.is_text_present("conj("))
        self.browser.find_by_id("right").first.click()
        self.browser.find_by_id("ENTER").first.click()
        self.assertTrue(self.browser.is_text_present("rand"))

    def test_window_menu(self):
        self.browser.find_by_id("window").first.click()
        self.assertTrue(self.browser.is_text_present("Xmin"))
        self.browser.find_by_id("delete").first.click()
        self.browser.find_by_id("delete").first.click()
        self.browser.find_by_id("delete").first.click()
        self.browser.find_by_id("1").first.click()
        self.browser.find_by_id("graph").first.click()
        self.assertTrue(self.browser.is_text_present("ERR: GRAPH SYNTAX"))

if __name__ == '__main__':
    unittest.main()