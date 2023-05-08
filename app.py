from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False


debug = DebugToolbarExtension(app)

boggle_game = Boggle()


#Home route
@app.route('/')
def make_board():
    board = boggle_game.make_test_board()
    session['board'] = board
    session['score'] = 0
    session['highscore'] = 0
    return render_template('board.html')

@app.route('/check-guess')
def check_guess():
    guess = request.args['guess']
    board = session['board']
    resp = boggle_game.check_valid_word(board,guess)
    return jsonify({'result':resp})
    