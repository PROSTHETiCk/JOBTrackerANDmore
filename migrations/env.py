import os
import sys
from logging.config import fileConfig

from flask import current_app
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.engine import URL # For parsing URL if needed

from alembic import context

# Ensure the backend directory is in the Python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here
# for 'autogenerate' support.
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# target_metadata = None # Default if not using autogenerate initially

# Try to load metadata from the Flask app context
target_metadata = None
db_url_str = None
try:
    # Adjust import if your factory is named differently or located elsewhere
    from app import create_app, db
    flask_app = create_app() # Create an app instance
    with flask_app.app_context(): # Use the app context
        target_metadata = db.metadata
        # Get URL from Flask app config if possible
        db_url_str = current_app.config.get('SQLALCHEMY_DATABASE_URI')
except ImportError as ie:
     print(f"[WARN][env.py] Could not import Flask app or db: {ie}. Autogenerate might need manual metadata setup.")
except Exception as e:
     print(f"[WARN][env.py] Error getting metadata/URL from Flask app context: {e}")


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well. By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Use URL from Flask app if available, otherwise fallback to alembic.ini
    url = db_url_str or config.get_main_option("sqlalchemy.url")
    if not url:
        raise ValueError("Database URL not found in Flask config or alembic.ini")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True, # Useful for generating SQL scripts
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
     # Use URL from Flask app if available, otherwise fallback to alembic.ini
    effective_url = db_url_str or config.get_main_option("sqlalchemy.url")
    if not effective_url:
        raise ValueError("Database URL not found in Flask config or alembic.ini")

    # Create engine configuration based on effective URL
    engine_config = config.get_section(config.config_ini_section) or {}
    engine_config["sqlalchemy.url"] = effective_url # Ensure the URL is set

    connectable = engine_from_config(
        engine_config,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()