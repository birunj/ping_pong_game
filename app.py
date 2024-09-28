from flask import Flask, render_template
from backend import game, get_game_status, update_score, reset_game, end_game

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status', methods=['GET'])
def status():
    return get_game_status()

@app.route('/hit', methods=['POST'])
def hit():
    return update_score()

@app.route('/reset', methods=['POST'])
def reset():
    return reset_game()

@app.route('/end', methods=['POST'])
def end():
    return end_game()

if __name__ == '__main__':
    app.run(debug=True)
