from flask import Flask, send_file, abort, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/exam.pdf')
def serve_pdf():
    path = '/home/sabbirba10/exam.pdf'
    if os.path.exists(path):
        return send_file(path, mimetype='application/pdf')
    else:
        abort(404)

@app.route('/exam.json')
def serve_json():
    path = '/home/sabbirba10/exam.json'
    if os.path.exists(path):
        return send_file(path, mimetype='application/json')
    else:
        abort(404)
