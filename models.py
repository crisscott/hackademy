from flask import url_for
from flask_login import UserMixin
from slugify import slugify
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.sql import select
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from run import db
import json
from datetime import datetime
import pytz
from tzlocal import get_localzone

class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    feel = db.Column(db.String(256))
    description = db.Column(db.Text)
    image = db.Column(db.String(256))
    timestamp = db.Column(db.DateTime)

    @staticmethod
    def get_all():
        return Entry.query.order_by(desc(Entry.timestamp)).all()
    
    def get_by_id(element):
        return Entry.query.filter_by(id = element).first()

    def delete_by_id(element):
        delete_rows = Entry.query.filter_by(id = element).delete()
        db.session.commit() 
        
        if delete_rows == 0:
            return False
        else:
            return True

    def save(self): 
        try:
            db.session.add(self)
            db.session.commit()

            return True
        except IntegrityError:
            return False