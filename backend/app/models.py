from . import db
import datetime

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    linkedin_url = db.Column(db.String(200), nullable=True)
    portfolio_url = db.Column(db.String(200), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    experience = db.Column(db.Text, nullable=True)
    education = db.Column(db.Text, nullable=True)
    # TODO: Add relationships later (e.g., one-to-many with JobApplication) if needed for Phase 2+

    def __repr__(self):
        return f'<UserProfile {self.email or self.full_name or self.id}>'

class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(150), nullable=False)
    company_name = db.Column(db.String(150), nullable=False)
    date_applied = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String(50), default='Applied')
    job_description = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    job_url = db.Column(db.String(500), nullable=True)
    # TODO: Add ForeignKey(user_profile.id) later if linking applications to users for Phase 2+

    def __repr__(self):
        return f'<JobApplication {self.job_title} at {self.company_name}>'