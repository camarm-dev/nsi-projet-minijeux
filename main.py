from flask import Flask, render_template
import sqlite3

app = Flask('Site de minijeux')


@app.get('/')
def home():
  return render_template('index.html', pseudo='invité', logged_in=False)


@app.get('/login')
def login():
  return render_template('login.html', error=False, noMenu=True)


@app.get('/createAccount')
def signup():
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
  app.run(host='0.0.0.0', port=8000, debug=True)
