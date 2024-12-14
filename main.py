import datetime
import re
from flask import Flask, render_template, request, redirect
import sqlite3
from pbkdf2 import hash_password

app = Flask('Site de minijeux')

# Convertir un objet datetime en texte à l'insertion
sqlite3.register_adapter(datetime.datetime, lambda date: date.timestamp())
# Convertir du texte en objet datetime
sqlite3.register_converter("TIME", lambda date: datetime.datetime.fromtimestamp(date))


def insert_user(name: str, pseudo: str, email: str, password: str, created_at: datetime.datetime):
    password = hash_password(password)
    cursor.execute("INSERT INTO users VALUES (?,?,?,?,?)", (pseudo, name, password, email, created_at))


def setup_database():
    cursor.execute("CREATE TABLE IF NOT EXISTS users (pseudo TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at TIME NOT NULL)")
    cursor.execute("CREATE TABLE IF NOT EXISTS scores (game TEXT NOT NULL, user TEXT NOT NULL, points INT NOT NULL, date TIME NOT NULL)")


@app.get('/')
def home():
    return render_template('index.html', pseudo='invité', logged_in=False)


@app.get('/login')
def login():
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
            return render_template('create_account.html', error=True, noMenu=True, message="Le nom d'utilisateur ne respecte pas le format demandé.")

        try:
            insert_user(fullname, pseudo, email, password, created_at)
        except sqlite3.IntegrityError:
            return render_template('create_account.html', error=True, noMenu=True, message="Le nom d'utilisateur ou l'email est déjà utilisé.")
        except Exception as e:
            return render_template('create_account.html', error=True, noMenu=True, message=f"Une erreur inconnue est survenue: {e}")
        return redirect('/')
    return render_template('create_account.html', error=False, noMenu=True)


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
    database = sqlite3.connect('database.db', check_same_thread=False)
    cursor = database.cursor()
    setup_database()
    app.run(host='0.0.0.0', port=8000, debug=True)
