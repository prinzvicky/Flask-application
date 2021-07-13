from flask import Flask, render_template, url_for, redirect, session, request, jsonify
import accounts
from flask_mysqldb import MySQL
import MySQLdb.cursors

app = Flask(__name__)
app.config['SECRET_KEY'] = '7dded6da486f264c527425b0f0a51084'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'pr1nzvicky1482001...'
app.config['MYSQL_DB'] = 'pm'

mysql = MySQL(app)

nav = ""
l = []
@app.before_first_request
def init_app():
	global nav
	if session.permanent == True:
		nav = "LOGOUT"
	else:
		nav = "LOGIN"
@app.route("/")
@app.route("/home")
def home():
	return render_template("home.html", title="Home |HAGROCARE", flash = "false", nav = nav)

@app.route("/about")
def about():
	return render_template("about.html", title="About |HAGROCARE", flash = "false", nav = nav)

@app.route("/registration", methods = ["GET", "POST"])
def registration():
	form = accounts.Registration()
	if form.validate_on_submit():
		cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
		roles = "farmer" if form.role.data == 1 else "shopkeeper"
		sql = "INSERT INTO users (username, email, passwords, confirm_password, roles) VALUES (%s, %s, %s, %s, %s)"
		val = (form.username.data, form.email.data, form.password.data, form.confirm_password.data, roles)
		cursor.execute(sql, val)
		mysql.connection.commit()
		return render_template('registration.html', form = form, title="Registration |HAGROCARE", flash = "true", nav = nav)
	if "loggedin" not in session:
		return render_template("registration.html", form = form, title="Registration |HAGROCARE", flash = "false", nav = nav)
	else:
		return redirect(url_for("home"))

@app.route("/login", methods = ["GET", "POST"])
def login():
	form = accounts.Login()
	if form.validate_on_submit():
		cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
		sql = "SELECT * FROM users WHERE email = %s AND passwords = %s"
		val = (form.email.data, form.password.data)
		cursor.execute(sql, val)
		user = cursor.fetchone()
		if user:
			global nav
			nav = "LOGOUT"
			session["loggedin"] = True
			session["id"] = user["user_id"]
			session["username"] = user["username"]
			if form.remember.data == True:
				session.permanent = True
			return redirect(url_for("farmer"))	
		else:
			return render_template("login.html", form = form, title="Login |HAGROCARE", flash = "true", nav = nav)
	if "loggedin" not in session:
		return render_template("login.html", form = form, title="Login |HAGROCARE", flash = "false", nav = nav)
	else:
		return redirect(url_for("home"))
@app.route("/services")
def services():
	return render_template("services.html", title = "Services |HAGROCARE", nav = nav)

@app.route("/weather")
def weather():
	return render_template("weather.html", title = "Weather |HAGROCARE")

@app.route("/logout")
def logout():
	global nav
	nav = "LOGIN"
	session.clear()
	return redirect(url_for('login'))

@app.route("/farmer", methods = ["GET", "POST"])
def farmer():
	form = accounts.Farmer()
	if "loggedin" in session:
		return render_template("farmer.html", form = form)
	else:
		return(redirect(url_for("login")))

@app.route("/farmer/get", methods = ["GET"])
def get():
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	global l
	cursor.execute("SELECT * FROM crops")
	l = cursor.fetchall()
	return jsonify(l);

@app.route("/farmer/post", methods = ["POST"])
def post():
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	req = request.get_json()
	option = req["id"].split("-")
	print(option)
	cursor.execute("DELETE FROM crops WHERE crop_id = %s", (option[1],))
	mysql.connection.commit()
	return redirect(url_for("get"))

if __name__ == '__main__':
    app.run(debug = True)
