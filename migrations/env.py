import os
import sys
from logging.config import fileConfig
import sqlalchemy
from sqlalchemy import pool
from sqlalchemy.engine import URL
from alembic import context

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = None
flask_app = None
db_url_obj = None

migrations_dir = os.path.dirname(__file__)
project_root = os.path.abspath(os.path.join(migrations_dir, '..'))
backend_dir = os.path.join(project_root, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app import create_app, db
    flask_app = create_app()
    with flask_app.app_context():
        target_metadata = db.metadata
        db_url_str = flask_app.config.get('SQLALCHEMY_DATABASE_URI')
        if db_url_str:
             db_url_obj = URL.create(db_url_str)
except Exception as e:
    print(f"[WARN][env.py] Could not import Flask app context: {e}")
    pass

def run_migrations_offline():
    if target_metadata is None:
         raise RuntimeError("target_metadata required for offline mode.")

    url = db_url_obj
    if not url:
        try:
            url_str = config.get_main_option("sqlalchemy.url")
            if url_str: url = URL.create(url_str)
        except Exception: pass
    if not url: raise ValueError("Database URL not found.")

    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})
    with context.begin_transaction(): context.run_migrations()

def run_migrations_online():
    if not flask_app: raise RuntimeError("Flask app required for online migration.")
    if target_metadata is None: raise RuntimeError("target_metadata required.")

    db_url = flask_app.config.get('SQLALCHEMY_DATABASE_URI')
    if not db_url: raise ValueError("SQLALCHEMY_DATABASE_URI not set.")

    connectable = sqlalchemy.create_engine(db_url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction(): context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()