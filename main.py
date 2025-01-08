import datetime
import json
import locale
import math
import re
import secrets
import sys

import waitress
from flask import Flask, render_template, request, redirect, make_response
import sqlite3
from sqlite3 import IntegrityError
from pbkdf2 import hash_password, verify_password
import jwt

app = Flask('Site de minijeux')

GAMES = {
    "osu": "OSU!",
    "morpion": "Morpion",
    "pfc": "Pierre Feuille Ciseaux",
    "dino": "Jeu du dino",
    "justeprix": "Juste Prix"
}

# Pour afficher les dates en français
#locale.setlocale(locale.LC_ALL, 'fr_FR.utf8')
# Convertir un objet datetime en texte à l'insertion
sqlite3.register_adapter(datetime.datetime, lambda date: date.timestamp())
# Convertir du texte en objet datetime
sqlite3.register_converter("TIME", lambda date: datetime.datetime.fromtimestamp(float(date.decode())))


def build_user(row: list):
    return {
        "pseudo": row[0],
        "name": row[1],
        "email": row[3],
        "created_at": row[4],
        "color_primary": row[5],
        "color_secondary": row[6]
    }


def build_score(row: list):
    return {
        "game": row[0],
        "user": row[1],
        "points": row[2],
        "date": row[3],
        "name": GAMES[row[0]],
        "win": row[4]
    }


def build_leaderboard_document(row: list):
    return {
        "pseudo": row[0],
        "name": row[1],
        "score": row[2],
        "rank": row[3],
        "color_primary": row[4],
        "color_secondary": row[5]
    }


def insert_user(name: str, pseudo: str, email: str, password: str, created_at: datetime.datetime):
    if len(name) > 50 or len(pseudo) > 50 or len(email) > 50 or len(password) > 50:
        raise IntegrityError("Vos informations de profil ne peuvent pas dépasser 50 caractères.")
    password = hash_password(password)
    cursor.execute("INSERT INTO users VALUES (?,?,?,?,?,?,?)", (pseudo, name, password, email, created_at, '#f2f2f2', '#0e0e0e'))
    database.commit()


def insert_score(game: str, user: str, points: int, created_at: datetime.datetime, win: bool | None):
    cursor.execute("INSERT INTO scores VALUES (?,?,?,?,?)", (game, user, points, created_at, win))
    database.commit()


def get_user(pseudo: str):
    user = cursor.execute("SELECT * FROM users WHERE pseudo=?", (pseudo,)).fetchone()
    if user:
        return build_user(user)


def update_user(pseudo: str, name: str, primary: str, secondary: str):
    if len(pseudo) > 50 or len(name) > 50 or len(primary) > 7 or len(secondary) > 7:
        raise IntegrityError("Vos informations de profil ne peuvent pas dépasser 50 caractères. La couleure doit être au format hexadécimal (#ffffff)")
    cursor.execute("UPDATE users SET name=?, color_primary=?, color_secondary=? WHERE pseudo=?", (name, primary, secondary, pseudo))
    database.commit()


def get_user_scores(pseudo: str):
    scores = cursor.execute("SELECT * FROM scores WHERE user=? ORDER by date DESC", (pseudo,)).fetchall()
    if scores:
        return list(map(build_score, scores))
    return []


def get_user_ranking(username: str, game: None | str = None):
    if game:
        ranking = cursor.execute("""SELECT * FROM 
                                        (SELECT u.pseudo, u.name, SUM(s.points) AS score, RANK() OVER (ORDER BY SUM(s.points) DESC) AS rank, u.color_primary, u.color_secondary
                                        FROM users u                                     
                                        JOIN scores s ON u.pseudo = s.user
                                        WHERE game=?                                    
                                        GROUP BY u.pseudo, u.name)
                                     WHERE pseudo=?""", (game, username)).fetchone()
    else:
        ranking = cursor.execute("""SELECT * FROM 
                                        (SELECT u.pseudo, u.name, SUM(s.points) AS score, RANK() OVER (ORDER BY SUM(s.points) DESC) AS rank, u.color_primary, u.color_secondary
                                        FROM users u                                     
                                        JOIN scores s ON u.pseudo = s.user                                    
                                        GROUP BY u.pseudo, u.name)
                                     WHERE pseudo=?""", (username,)).fetchone()
    if ranking:
        return build_leaderboard_document(ranking)


def get_ranking(page: int, game: None | str = None):
    # On sélectionne le pseudo de l'utilisateur et son nom depuis la table users (alias u)
    # On joint la table scores (alias s): u.pseudo et s.user
    # Cela nous permet de sélectionner la somme des points (SUM(s.points), alias score)
    # On établit un classement avec la fonction RANK, dans la colonne rank, avec la somme des points, dans l'ordre décroissant
    # On limite le nombre de résultats à 20 (LIMIT) et on récupère les profils à afficher sur la page demandée
    if game:
        results = cursor.execute("""SELECT u.pseudo, u.name, SUM(s.points) AS score, RANK() OVER (ORDER BY SUM(s.points) DESC) AS rank, u.color_primary, u.color_secondary
                                    FROM users u 
                                    JOIN scores s ON u.pseudo = s.user
                                    WHERE game=?
                                    GROUP BY u.pseudo, u.name
                                    ORDER BY rank
                                    LIMIT 20
                                    OFFSET 20*?;
                                """, (game,page)).fetchall()
    else:
        results = cursor.execute("""SELECT u.pseudo, u.name, SUM(s.points) AS score, RANK() OVER (ORDER BY SUM(s.points) DESC) AS rank, u.color_primary, u.color_secondary
                                    FROM users u 
                                    JOIN scores s ON u.pseudo = s.user
                                    GROUP BY u.pseudo, u.name
                                    ORDER BY rank
                                    LIMIT 20
                                    OFFSET 20*?;
                                """, (page,)).fetchall()
    if results:
        return [build_leaderboard_document(row) for row in results]


def get_statistics():
    total_users = cursor.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    total_games = cursor.execute("SELECT COUNT(*) FROM scores").fetchone()[0]
    total_pages = math.ceil(total_users / 20)
    return total_users, total_games, total_pages


def authenticate(email: str, password: str):
    user = cursor.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if user is not None:
        _, _, hashed_password, _, _, _, _ = user
        return verify_password(password, hashed_password), build_user(user)
    return False, {}


def get_authentication_status():
    if request.cookies.get('token', None):
        token = request.cookies.get('token')
        try:
            user = verify_token(token)
            return True, get_user(user['pseudo'])
        except jwt.PyJWTError:
            pass
    return False, {}


def generate_token(username: str):
    return jwt.encode({"pseudo": username, "exp": datetime.datetime.now() + datetime.timedelta(days=30)}, SECRET, algorithm="HS256")


def verify_token(token: str):
    return jwt.decode(token, SECRET, algorithms=["HS256"])


def setup_database():
    cursor.execute("CREATE TABLE IF NOT EXISTS users (pseudo TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at TIME NOT NULL, color_primary TEXT NOT NULL, color_secondary TEXT NOT NULL)")
    cursor.execute("CREATE TABLE IF NOT EXISTS scores (game TEXT NOT NULL, user TEXT NOT NULL, points INT NOT NULL, date TIME NOT NULL, win BOOLEAN)")


def isWin(game, score):
    # Les parties de morpion et pfc sont gagnées <=> 5 points marqués
    if game in ['morpion', 'pfc'] and score != 1:
        return score == 5
    return None


def anticheat(game: str, points: int, user: dict):
    last_game = cursor.execute("SELECT * FROM scores WHERE user=? ORDER BY date DESC", (user['pseudo'],)).fetchone()
    # Les parties de la dernière minute
    now = datetime.datetime.now()
    last_minute_games = cursor.execute("SELECT * FROM scores WHERE user=? AND date<=?", (user['pseudo'], now - datetime.timedelta(minutes=1))).fetchall()
    last_minute_games = [build_score(row) for row in last_minute_games]
    if not last_game:
        return (True, points) if points < 25 else (False, 0)
    last_game = build_score(last_game)
    match game:
        case 'dino':
            # 1 point = 2 secondes
            # <=> Le nombre de secondes de la différences des dates / 2 doit être supérieur au nombre de points
            return ((now - last_game['date']).seconds / 2) > points and points < 40, points
        case 'morpion':
            # La partie doit durer 10s
            # <=> La différence des dates doit être supérieur à 10s
            # Une partie gagnée = 5 points, une partie égalité = 1, une partie perdue = 0
            points = points if points in [5, 1, 0] else 0
            return (now - last_game['date']).seconds > 10, points
        case 'justeprix':
            # La partie doit durer 10s
            # <=> La différence des dates doit être supérieur à 10s
            # Ici points représente le nombre d'essais
            points = -0.5 * (points ** 2) + 30 if points <= 7 else 5  # Formule pour les points: -0.5x²+30 et à partir de 7 essais, le score est constant à 5

            # Pas plus de 1 partie à 30 points dans une minute
            for game in last_minute_games:
                if game['game'] == 'justeprix' and game['points'] == 30:
                    return False, 0

            return (now - last_game['date']).seconds > 10, points
        case 'pfc':
            # La partie doit durer 5s
            # <=> La différence des dates doit être supérieur à 5s
            # Une partie gagnée = 5 points, une partie égalité = 1, une partie perdue = 0
            points = points if points in [5, 1, 0] else 0
            return (now - last_game['date']).seconds > 5, points
        case 'osu':
            # TODO
            # 30s min
            # 15pt max
            points = points / 7 if points <= 250 else 0
            return (now - last_game['date']).seconds > 30, points
        case _:
            return False, 0
    return True, points


@app.get('/')
def home():
    authenticated, user = get_authentication_status()
    if authenticated:
        return render_template('index.html', pseudo=user['pseudo'], logged_in=True, user=user)
    return render_template('index.html', pseudo='invité', logged_in=False)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.args.get('expired', False) != False:
        return render_template('login.html', error=True, message="Votre session a expirée, merci de vous reconnecter.",
                               noMenu=True)
    if request.method == 'POST':  # Formulaire envoyé
        data = request.form
        email = data.get('email', None)
        password = data.get('password', None)
        authenticated, user = authenticate(email, password)
        if authenticated:
            response = make_response(redirect('/'))
            response.set_cookie('token', generate_token(user["pseudo"]))
            return response
        return render_template('login.html', error=True,
                               message="Impossible de vous authentifier. Mot de passe ou email invalide.", noMenu=True)
    return render_template('login.html', error=False, noMenu=True)


@app.route('/createAccount', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':  # Formulaire envoyé
        data = request.form
        email = data.get('email', None)
        pseudo = data.get('username', None)
        password = data.get('password', None)
        fullname = data.get('name', None)
        created_at = datetime.datetime.now()

        # Le pseudo utilise des caractères interdits
        if not re.match(r"^[a-z\d]+$", pseudo):
            return render_template('create_account.html', error=True, noMenu=True,
                                   message="Le nom d'utilisateur ne respecte pas le format demandé.")

        try:
            insert_user(fullname, pseudo, email, password, created_at)
        except sqlite3.IntegrityError:
            return render_template('create_account.html', error=True, noMenu=True,
                                   message="Le nom d'utilisateur ou l'email est déjà utilisé.")
        except Exception as e:
            return render_template('create_account.html', error=True, noMenu=True,
                                   message=f"Une erreur inconnue est survenue: {e}")
        return redirect('/')
    return render_template('create_account.html', error=False, noMenu=True)


@app.post('/updateProfile')
def update_profile():
    authenticated, user = get_authentication_status()
    if not authenticated:
        return render_template('login.html', error=True, message="Votre session a expirée, merci de vous reconnecter.",
                               noMenu=True)
    data = request.form
    name = data.get('name', None)
    primary = data.get('colorPrimary', None)
    secondary = data.get('colorSecondary', None)
    if name and primary and secondary:
        update_user(user['pseudo'], name, primary, secondary)
    return redirect('/me')


@app.post('/sendScore')
def save_score():
    authenticated, user = get_authentication_status()
    if not authenticated:
        return {
            "success": False,
            "code": 401,
            "message": "Impossible de vous authentifier, veuillez vous connectez."
        }
    try:
        data = json.loads(request.data)
        score = data['score']
        game = data['game']
        anticheat_ok, points = anticheat(game, int(score), user)
        if anticheat_ok:
            win = isWin(game, score)
            insert_score(game, user['pseudo'], points, datetime.datetime.now(), win)
            return {
                "success": True,
                "code": 200,
                "message": "La partie a été sauvegardée !"
            }
        return {
            "success": False,
            "code": 400,
            "message": "Cette requête a été bloquée par l'anti cheat !"
        }
    except Exception as e:
        raise e
    return {
        "success": False,
        "code": 500,
        "message": "Une erreur est survenue, impossible d'enregistrer le score."
    }


@app.get('/me')
def my_profile():
    authenticated, user = get_authentication_status()
    if authenticated:
        total_users, _, _ = get_statistics()
        ranking = get_user_ranking(user['pseudo'])
        games = get_user_scores(user['pseudo'])
        return render_template('profile.html', logged_in=True, user=user, games=games, total_users=total_users, rank=ranking['rank'], can_modify=True)
    return redirect('/login')


@app.get('/@<username>')
def profile(username: str):
    authenticated, _ = get_authentication_status()
    user = get_user(username)
    total_users, _, _ = get_statistics()
    if not user:
        return render_template('error.html', logged_in=authenticated, message='Utilisateur introuvable')
    games = get_user_scores(username)
    ranking = get_user_ranking(user['pseudo'])
    return render_template('profile.html', logged_in=authenticated, user=user, games=games, total_users=total_users, rank=ranking['rank'])


@app.get('/leaderboard')
def leaderboard():
    authenticated, user = get_authentication_status()
    page = request.args.get('page', 1)
    game = request.args.get('game', 'all')
    total_users, total_games, total_pages = get_statistics()
    if game == 'all':
        ranking = get_ranking(page - 1)
    else:
        ranking = get_ranking(page - 1, game)
    if authenticated:
        user_ranking = get_user_ranking(user['pseudo'], game) if game else get_user_ranking(user['pseudo'])
        return render_template('leaderboard.html', leaderboard=ranking, logged_in=True, personal_ranking=user_ranking, total_users=total_users, total_games=total_games, total_pages=total_pages, page=page)
    return render_template('leaderboard.html', leaderboard=ranking, logged_in=False, personal_ranking=None, total_users=total_users, total_games=total_games, total_pages=total_pages, page=page)


@app.get('/credits')
def credits():
    return render_template('credits.html', noMenu=True)


@app.get('/game/dino')
def dino():
    authenticated, user = get_authentication_status()
    return render_template('dino.html', pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated)


@app.get('/game/osu')
def osu():
    authenticated, user = get_authentication_status()
    return render_template('osu.html', pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated, noMenu=True)


@app.get('/game/morpion')
def morpion():
    authenticated, user = get_authentication_status()
    return render_template('morpion.html', pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated)


@app.get('/game/justeprix')
def justeprix():
    authenticated, user = get_authentication_status()
    return render_template('justeprix.html', pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated)


@app.get('/game/pfc')
def pfc():
    authenticated, user = get_authentication_status()
    return render_template('pfc.html', pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated)


@app.errorhandler(Exception)
def error(error):
    authenticated, user = get_authentication_status()
    return render_template('error.html', message=f"{error}: {error.args}", pseudo=user['pseudo'] if authenticated else 'invité', user=user, logged_in=authenticated)


if __name__ == '__main__':
    SECRET = secrets.token_urlsafe(512)
    database = sqlite3.connect('database.db', detect_types=sqlite3.PARSE_DECLTYPES, check_same_thread=False)
    cursor = database.cursor()
    setup_database()
    if '--dev' in sys.argv:
        SECRET = 'debug'  # Prevent token validation fail after hot-reload
        app.run(host='0.0.0.0', port=8000, debug=True)
    else:
        print("Starting production server on http://0.0.0.0:8000...")
        waitress.serve(app, host='0.0.0.0', port=8000)
