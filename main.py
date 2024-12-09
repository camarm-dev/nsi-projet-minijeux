from flask import Flask, render_template
import sqlite3

app = Flask('Site de minijeux')

@app.get('/')
def home():
  return render_template('index.html', pseudo='invité')

if __name__ == '__main__':
  database = sqlite3.connect('database.db', check_same_thread=None)
  app.run(host='0.0.0.0', port=8000)
