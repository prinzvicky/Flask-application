from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, RadioField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError 
from agri import mysql
import MySQLdb.cursors
from wtforms.fields.html5 import DateField

class Registration(FlaskForm):
	username = StringField("Username", validators = [DataRequired(), Length(min = 5, max = 20)])
	email = StringField("Email", validators = [DataRequired(), Email()])
	password = PasswordField("Password", validators = [DataRequired()])
	confirm_password = PasswordField("Confirm Password", validators = [DataRequired(), EqualTo("password")])
	role = RadioField("Label", choices=[
        (1,'Farmer'), (2,'Shopkeeper')],
        default=1)
	submit = SubmitField("Signup")

	def validate_username(self, username):
		cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
		sql = "SELECT username FROM users WHERE username = %s"
		val = (username.data, )
		cursor.execute(sql, val)
		user = cursor.fetchone()
		if user:
			raise ValidationError("Username already taken enter a different one")
	
	def validate_email(self, email):
		cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
		sql = "SELECT email FROM users WHERE email = %s"
		val = (email.data, )
		cursor.execute(sql, val)
		user = cursor.fetchone()
		if user:
			raise ValidationError("Email already taken enter a different one")

class Login(FlaskForm):
	email = StringField("Email", validators = [DataRequired(), Email()])
	password = PasswordField("Password", validators = [DataRequired()])
	remember = BooleanField("Remember me")
	submit = SubmitField("Login")

class Farmer(FlaskForm):
	crop_name = StringField("Crop Name", validators = [DataRequired(), Length(min = 5, max = 20)])
	disease = StringField("Disease", validators = [DataRequired(), Length(min = 5, max = 20)])
	fertilizers = StringField("Fertilizers", validators = [DataRequired(), Length(min = 5, max = 20)])
	crop_type = StringField("Crop Type", validators = [DataRequired(), Length(min = 5, max = 20)])
	date_sown = DateField('Date sown', format='%Y-%m-%d')
	submit = SubmitField("Submit")