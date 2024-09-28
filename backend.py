from flask import jsonify

class PingPongGame:
    def __init__(self, difficulty='easy'):
        self.score = 0
        self.difficulty = difficulty
        self.ball_speed = self.set_ball_speed(difficulty)
        self.game_over = False

    def set_ball_speed(self, difficulty):
        if difficulty == 'easy':
            return 2
        elif difficulty == 'moderate':
            return 4
        elif difficulty == 'difficult':
            return 6

    def increment_score(self):
        self.score += 1

    def reset_game(self):
        self.score = 0
        self.game_over = False
        self.ball_speed = self.set_ball_speed(self.difficulty)

    def end_game(self):
        self.game_over = True

game = PingPongGame()

def get_game_status():
    return jsonify(score=game.score, difficulty=game.difficulty, game_over=game.game_over)

def update_score():
    if not game.game_over:
        game.increment_score()
    return jsonify(score=game.score)

def reset_game():
    game.reset_game()
    return jsonify(message="Game reset.")

def end_game():
    game.end_game()
    return jsonify(message="Game over.", score=game.score)
