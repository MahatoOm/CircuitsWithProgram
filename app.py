from flask import Flask, render_template, request

app = Flask('__main__')

@app.route('/')
def home():
    return "This is first circuit displayed."







if __name__ == "__main__":
    app.run(debug = True)
