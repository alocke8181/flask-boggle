from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_home(self):
        with self.client:
            resp = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('num_plays'))
            self.assertIn(b'<h2 id="score">Your Score:', resp.data)
            self.assertIn(b'<h3>Highscore:', resp.data)
            self.assertIn(b'<h3>Time Remaining:', resp.data)

    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [
                    ["B","O","A","R","D"],
                    ["G","A","M","E","S"],
                    ["S","U","P","E","R"],
                    ["M","E","M","E","S"],
                    ["S","T","O","N","E"]
                ]
        resp = self.client.get('/check-guess?guess=board')
        self.assertEqual(resp.json['result'],'ok')

    def test_invalid_word(self):
        self.client.get('/')
        resp = self.client.get('/check-guess?guess=carrot')
        self.assertEqual(resp.json['result'],'not-on-board')

    def test_non_english_word(self):
        self.client.get('/')
        resp = self.client.get('/check-guess?guess=sdkjfhsdjkfhsadkjfhsdajkf')
        self.assertEqual(resp.json['result'],'not-word')

