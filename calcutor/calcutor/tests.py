from __future__ import unicode_literals

import unittest
from pyramid import testing
from splinter import Browser

from views import home_view


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

#        request = testing.DummyRequest(params={'input': '+'}, post={})
#        info = home_view(request)
#        self.assertEqual(info['output'], u'ERR: SYNTAX')


class FrontEndTests(unittest.TestCase):
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

if __name__ == '__main__':
    unittest.main()
