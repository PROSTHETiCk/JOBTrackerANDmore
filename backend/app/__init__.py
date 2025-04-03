import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
MIGRATIONS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'migrations'))
migrate = Migrate(directory=MIGRATIONS_DIR)
cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    cors.init_app(app, resources={r"/api/*": {"origins": [frontend_url]}})

    with app.app_context():
        from . import routes
        from . import models
        app.register_blueprint(routes.api_bp, url_prefix='/api')

        @app.route('/hello')
        def hello():
            return 'Hello, World from Flask App Factory!'

        return app