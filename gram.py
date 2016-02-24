
# A very simple Flask Hello World app for you to get started with...

from flask import Flask
from flask import request
from datetime import datetime
import json
import subprocess

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask!'


@app.route("/db", methods=["POST"])
def save_db():
    db = request.get_json(force=True)
    fn = "db-{:%d-%m-%y-%H-%M-%S}.json".format(datetime.now())
    with open(fn, "w") as f:
        json.dump(db, f, ensure_ascii=False)
    subprocess.call(["ln", "-sf", fn, "db-latest.json"])
    return "{'status':'Ok'}"


if __name__ == '__main__':
    app.run(debug=True)
