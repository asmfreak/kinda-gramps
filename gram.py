from flask import Flask
from flask import request
from datetime import datetime
import json
import os
import glob
import subprocess
from gram_conf import server, passw

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def hello_world():
    return app.send_static_file( 'index.html')
    #return "<h1>it's working</h1>"

@app.route("/dbs")
def list_dbs():
    res = glob.glob('db-[0-9]*.json')
    res.sort(reverse=True)
    res = [{"name": "Последняя версия", "value":"db-latest"}] + [ {"name": "Версия от {}".format(db[3:len(db)-5]), "value": db[:-5]} for db in res]
    return json.dumps({"success": True,"results":res}, ensure_ascii=False)
        
    
@app.route("/db", methods=["GET","POST"])
def db():
    if request.method == "POST":
        db = request.get_json(force=True)
        fn = "db-{:%d.%m.%y_%H:%M:%S}.json".format(datetime.utcnow())
        with open(fn, "w") as f:
            json.dump(db, f, ensure_ascii=False)
        subprocess.call(["ln", "-sf", fn, "db-latest.json"])
        return "{'status':'Ok'}"
    else:
        with open('db-latest.json', "w") as f:
            return f.read()
@app.route("/db-<path:path>")
def db_by_name(path):
    with open('db-{}.json'.format(path), "r") as f:
        return f.read()

if __name__ == '__main__':
    app.run(debug=True)
