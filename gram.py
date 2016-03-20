from flask import Flask, session
from flask import request
from datetime import datetime
import json
import os
import glob
import subprocess
from gram_conf import server, passw, secret
from functools import wraps

app = Flask(__name__, static_url_path='/static')
app.secret_key = secret

@app.route('/login', methods=["POST"])
def check_pass():
    pw = request.form
    print(pw)
    try:
        pw = pw["password"]
    except:
        return app.send_static_file( 'index.html')
    if pw == passw:
        session["logged"] = True
        return app.send_static_file( 'index-edit.html')
    session["logged"] = False
    return app.send_static_file( 'index.html')

def loginreq(fcn):
    @wraps(fcn)
    def wrap(*args, **kwargs):
        try:
            if session["logged"]:
                return fcn(*args, **kwargs)
        except KeyError:
            pass
        return app.send_static_file( 'index.html')
    return wrap

@app.route('/')
def hello_world():
    return app.send_static_file( 'index.html')

@app.route('/edit')
@loginreq
def edit():
    return app.send_static_file( 'index-edit.html')

@app.route("/dbs")
def list_dbs():
    res = glob.glob('db-[0-9]*.json')
    res.sort(reverse=True)
    res = [{"name": "Последняя версия", "value":"db-latest"}] + [ {"name": "Версия от {}".format(db[3:len(db)-5]), "value": db[:-5]} for db in res]
    return json.dumps({"success": True,"results":res}, ensure_ascii=False)
        
    
@app.route("/db", methods=["POST"])
@loginreq
def db():
    db = request.get_json(force=True)
    fn = "db-{:%d.%m.%y_%H:%M:%S}.json".format(datetime.utcnow())
    with open(fn, "w") as f:
        json.dump(db, f, ensure_ascii=False)
    subprocess.call(["ln", "-sf", fn, "db-latest.json"])
    return "{'status':'Ok'}"

@app.route("/db-<path:path>")
def db_by_name(path):
    with open('db-{}.json'.format(path), "r") as f:
        return f.read()

if __name__ == '__main__':
    app.run(debug=True)
