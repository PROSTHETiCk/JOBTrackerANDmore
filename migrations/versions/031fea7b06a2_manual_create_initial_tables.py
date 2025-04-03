"""Manual create initial tables

Revision ID: 031fea7b06a2
Revises: 
Create Date: YYYY-MM-DD HH:MM:SS.ffffff # Populated by Alembic

"""
# revision identifiers, used by Alembic.
revision = '031fea7b06a2' # Make sure this matches your filename!
down_revision = None # First migration
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
# Import any specific types if needed, e.g.:
# from sqlalchemy.dialects import mysql

def upgrade():
    # ### commands manually written ###
    print("Running manual upgrade: Creating user_profile table...")
    # Use MariaDB syntax within op.execute
    op.execute("""
    CREATE TABLE user_profile (
        id INTEGER NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        address VARCHAR(200),
        linkedin_url VARCHAR(200),
        portfolio_url VARCHAR(200),
        skills TEXT,
        experience TEXT,
        education TEXT,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    """)
    print("Running manual upgrade: Creating job_application table...")
    op.execute("""
    CREATE TABLE job_application (
        id INTEGER NOT NULL AUTO_INCREMENT,
        job_title VARCHAR(150) NOT NULL,
        company_name VARCHAR(150) NOT NULL,
        date_applied DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Applied',
        job_description TEXT,
        notes TEXT,
        job_url VARCHAR(500),
        PRIMARY KEY (id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    """)
    print("Manual table creation commands finished.")
    # ### end commands ###


def downgrade():
    # ### commands manually written ###
    print("Running manual downgrade: Dropping job_application table...")
    op.execute("DROP TABLE IF EXISTS job_application;")
    print("Running manual downgrade: Dropping user_profile table...")
    op.execute("DROP TABLE IF EXISTS user_profile;")
    print("Manual table drop commands finished.")
    # ### end commands ###