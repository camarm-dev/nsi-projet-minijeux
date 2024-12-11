from flask import Flask, render_template
import sqlite3

app = Flask('Site de minijeux')

@app.get('/')
def home():
  return render_template('index.html', pseudo='invité', logged_in=False)

@app.get('/game/dino')
def dino():
  return render_template('dino.html', pseudo='invité', logged_in=False)

@app.get('/game/osu')
def osu():
  return render_template('osu.html', pseudo='invité', logged_in=False)

@app.get('/game/morpion')
def morpion():
  return render_template('morpion.html', pseudo='invité', logged_in=False)

@app.get('/game/justeprix')
def justeprix():
  return render_template('justeprix.html', pseudo='invité', logged_in=False)


if __name__ == '__main__':
  database = sqlite3.connect('database.db', check_same_thread=False)
  app.run(host='0.0.0.0', port=8000)
