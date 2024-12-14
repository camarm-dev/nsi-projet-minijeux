import datetime
import locale
import re
import secrets
import sys

import waitress
from flask import Flask, render_template, request, redirect, make_response
import sqlite3
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
locale.setlocale(locale.LC_ALL, 'fr_FR.utf8')
# Convertir un objet datetime en texte à l'insertion
sqlite3.register_adapter(datetime.datetime, lambda date: date.timestamp())
# Convertir du texte en objet datetime
sqlite3.register_converter("TIME", lambda date: datetime.datetime.fromtimestamp(float(date.decode())))


def build_user(row: list):
    return {
        "pseudo": row[0],
        "name": row[1],
        "email": row[3],
        "created_at": row[4]
    }


def build_score(row: list):
    return {
        "game": row[0],
        "user": row[1],
        "points": row[2],
        "date": row[3],
        "name": GAMES[row[0]]
    }


def insert_user(name: str, pseudo: str, email: str, password: str, created_at: datetime.datetime):
    password = hash_password(password)
    cursor.execute("INSERT INTO users VALUES (?,?,?,?,?)", (pseudo, name, password, email, created_at))
    database.commit()


def insert_score(game: str, user: str, points: int, created_at: datetime.datetime):
    cursor.execute("INSERT INTO scores VALUES (?,?,?,?,?)", (game, user, points, created_at))
    database.commit()


def get_user(pseudo: str):
    user = cursor.execute("SELECT * FROM users WHERE pseudo=?", (pseudo,)).fetchone()
    if user:
        return build_user(user)


def get_user_scores(pseudo: str):
    scores = cursor.execute("SELECT * FROM scores WHERE user=?", (pseudo,)).fetchall()
    if scores:
        return list(map(build_score, scores))
    return []


def authenticate(email: str, password: str):
    user = cursor.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if user:
        pseudo, name, hashed_password, email, created_at = user
        return verify_password(password, hashed_password), build_user(user)
    return False


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
    cursor.execute("CREATE TABLE IF NOT EXISTS users (pseudo TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at TIME NOT NULL)")
    cursor.execute("CREATE TABLE IF NOT EXISTS scores (game TEXT NOT NULL, user TEXT NOT NULL, points INT NOT NULL, date TIME NOT NULL)")


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


@app.get('/me')
def my_profile():
    authenticated, user = get_authentication_status()
    if authenticated:
        games = get_user_scores(user['username'])
        return render_template('profile.html', logged_in=True, user=user, games=games)
    return redirect('/login')


@app.get('/@<username>')
def profile(username: str):
    authenticated, _ = get_authentication_status()
    user = get_user(username)
    games = get_user_scores(username)
    return render_template('profile.html', logged_in=authenticated, user=user, games=games)


@app.get('/credits')
def credits():
    return render_template('credits.html', noMenu=True)


@app.get('/game/dino')
def dino():
    return render_template('dino.html', pseudo='invité', logged_in=False)


@app.get('/game/osu')
def osu():
    return render_template('osu.html', pseudo='invité', logged_in=False, noMenu=True)


@app.get('/game/morpion')
def morpion():
    return render_template('morpion.html', pseudo='invité', logged_in=False)


@app.get('/game/justeprix')
def justeprix():
    return render_template('justeprix.html', pseudo='invité', logged_in=False)


@app.get('/game/pfc')
def pfc():
    return render_template('pfc.html', pseudo='invité', logged_in=False)


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
