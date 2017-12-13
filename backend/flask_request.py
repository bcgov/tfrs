# Application definition
from flask import Flask, request

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def dump_headers(path):
    print(request.headers)
    return str(request.headers), 200, {
        'Content-Type': 'text/plain; charset=utf-8'}

if __name__ == '__main__':
    app.run()