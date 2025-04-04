from . import db # Import db instance from __init__.py
import datetime

class UserProfile(db.Model):
    __tablename__ = 'user_profile'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=True)
    # Assuming email will be used for identification, make it required
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(200), nullable=True) # Optional address field
    linkedin_url = db.Column(db.String(200), nullable=True)
    portfolio_url = db.Column(db.String(200), nullable=True)
    # Fields often used for resume/job matching
    skills = db.Column(db.Text, nullable=True)      # E.g., comma-separated or JSON
    experience = db.Column(db.Text, nullable=True)   # Could be structured text/JSON
    education = db.Column(db.Text, nullable=True)    # Could be structured text/JSON

    # Relationship (defined later if needed for user-specific jobs)
    # job_applications = db.relationship('JobApplication', backref='applicant', lazy=True)

    def __repr__(self):
        return f'<UserProfile {self.email}>' # Use email for representation

class JobApplication(db.Model):
    # No changes needed for JobApplication model in Phase 2
    __tablename__ = 'job_application'
    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(150), nullable=False)
    company_name = db.Column(db.String(150), nullable=False)
    date_applied = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String(50), default='Applied', nullable=False)
    job_description = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    job_url = db.Column(db.String(500), nullable=True)

    # Foreign Key (defined later if needed for user-specific jobs)
    # user_id = db.Column(db.Integer, db.ForeignKey('user_profile.id'), nullable=True)

    def __repr__(self):
        return f'<JobApplication {self.id}: {self.job_title} at {self.company_name}>'