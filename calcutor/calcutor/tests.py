import unittest

from pyramid import testing


class ViewTests(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    def test_basic_math(self):
        from views import home_view

        # test addition
        request = testing.DummyRequest(params={'input': '1+1'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'2')

        # test subtraction
        request = testing.DummyRequest(params={'input': '3-4'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'-1')

        # test multiplication
        request = testing.DummyRequest(params={'input': '3*4'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'12')

        # test division (expecting int)
        request = testing.DummyRequest(params={'input': '10/2'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'5')

        # test division (expectiong float)
        request = testing.DummyRequest(params={'input': '10/4'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'2.5')

    def test_trig(self):
        from views import home_view
        from math import pi

        # test sin
        request = testing.DummyRequest(params={'input': 'sin(0)'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'0')
        request = testing.DummyRequest(
            params={'input': 'sin(' + str(pi / 2) + ')'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'1')

        # test cos
        request = testing.DummyRequest(params={'input': 'cos(0)'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'1')
        request = testing.DummyRequest(
            params={'input': 'cos(' + str(pi / 2) + ')'}, post={})
        info = home_view(request)
        self.assertEqual(str(int(float(info['output']))), u'0')

        # test tan
        request = testing.DummyRequest(params={'input': 'tan(0)'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'0')
        request = testing.DummyRequest(
            params={'input': 'tan(' + str(pi) + ')'}, post={})
        info = home_view(request)
        self.assertEqual(str(int(float(info['output']))), u'0')

    def test_syntax_error(self):
        from views import home_view

        request = testing.DummyRequest(params={'input': 'fish taco'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'ERR: SYNTAX')

        request = testing.DummyRequest(params={'input': '+'}, post={})
        info = home_view(request)
        self.assertEqual(info['output'], u'ERR: SYNTAX')


if __name__ == '__main__':
    unittest.main()
