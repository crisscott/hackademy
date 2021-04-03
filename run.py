import os
from flask import Flask, jsonify, request, render_template, redirect, url_for, abort, Response
from werkzeug.urls import url_parse
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime
import pytz
from tzlocal import get_localzone

UPLOAD_FOLDER = './static/img/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['SECRET_KEY'] = '7110c8ae51a4b5af97be6534caef90e4bb9bdcb3380af008f90b23a5d1616bf319bc298105da20fe'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:12345@localhost:5432/diary'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

from models import Entry

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/getinfo', methods=['GET', 'POST'])
def get_data():
    if request.method == 'GET':
        json_data_list = []
        entries = Entry.get_all()

        for entrie in entries:

            date = ''
            if entrie.date: 
                date = entrie.date.strftime("%d/%m/%Y")

            json_data_list.append({
                'id': entrie.id,
                'date': date,
                'feel': entrie.feel,
                'description': entrie.description, 
                'image': entrie.image,
                'timestamp': entrie.timestamp.strftime("%d/%m/%Y %H:%M:%S")
            })
        
        return jsonify(json_data_list)

@app.route('/upload', methods=['GET', 'POST'])
def upload_form():

    dir_file = ''
    if request.files:
        file = request.files['file']
    
        if file:
            filename, file_extension = os.path.splitext(file.filename)
            filename = str(datetime.timestamp(datetime.now(pytz.timezone("Mexico/General")))) + file_extension.lower()
            dir_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(dir_file)
    
    query = Entry(date = request.form['date'], feel = request.form['feel'], description = request.form['description'], image = dir_file, timestamp = datetime.now(pytz.timezone("Mexico/General")))
    if query.save():
        return jsonify({'status': 200}) 
    else:
        return jsonify({'status': 500}) 

@app.route('/delete')
def delete_element(): 
    id = request.args.get('element')
    element = Entry.get_by_id(id)

    if element.image != "":
        if os.path.isfile(element.image):
            os.remove(element.image)
    
    if Entry.delete_by_id(id):
        return jsonify({'status': 200}) 
    else:
        return jsonify({'status': 500})     

if __name__ == "__main__":
    app.run(debug=True)