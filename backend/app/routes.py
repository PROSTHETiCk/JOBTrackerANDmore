import os
from flask import Blueprint, jsonify, request, current_app
from marshmallow import ValidationError
from .models import JobApplication, UserProfile # Import UserProfile model
from . import db
from .schemas import JobApplicationSchema, UserProfileSchema # Import UserProfileSchema

# --- Added for Phase 3 ---
import google.generativeai as genai
# --- End Added for Phase 3 ---

api_bp = Blueprint('api', __name__)

# Instantiate schemas
job_schema = JobApplicationSchema()
jobs_schema = JobApplicationSchema(many=True)
profile_schema = UserProfileSchema()

# --- Test Route ---
# ... (Keep /ping route) ...
@api_bp.route('/ping', methods=['GET'])
def ping_pong():
    """Simple test route."""
    return jsonify({"status": "success", "message": "pong!"})

# --- Job Application CRUD Routes (Phase 1) ---
# ... (Keep existing /jobs routes) ...
@api_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Get a list of all job applications."""
    try:
        all_jobs = JobApplication.query.order_by(JobApplication.date_applied.desc()).all()
        result = jobs_schema.dump(all_jobs)
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({"error": "Failed to fetch job applications"}), 500

@api_bp.route('/jobs', methods=['POST'])
def create_job():
    """Create a new job application."""
    json_data = request.get_json()
    if not json_data: return jsonify({"error": "No input data provided"}), 400
    try:
        new_job = job_schema.load(json_data, session=db.session)
        db.session.add(new_job)
        db.session.commit()
        result = job_schema.dump(new_job)
        return jsonify(result), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify({"error": "Input validation failed", "messages": err.messages}), 400
    except Exception as e:
        db.session.rollback(); print(f"Error creating job: {e}")
        return jsonify({"error": "Failed to create job application"}), 500

@api_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job_by_id(job_id):
    """Get a specific job application by its ID."""
    try:
        job = db.session.get(JobApplication, job_id)
        if job is None: return jsonify({"error": "Job application not found"}), 404
        result = job_schema.dump(job)
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching job {job_id}: {e}")
        return jsonify({"error": "Failed to fetch job application"}), 500

@api_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    """Update an existing job application by its ID."""
    json_data = request.get_json()
    if not json_data: return jsonify({"error": "No input data provided"}), 400
    try:
        existing_job = db.session.get(JobApplication, job_id)
        if existing_job is None: return jsonify({"error": "Job application not found"}), 404
        job_schema.load(json_data, instance=existing_job, partial=True, session=db.session)
        db.session.commit()
        result = job_schema.dump(existing_job)
        return jsonify(result)
    except ValidationError as err:
        db.session.rollback()
        return jsonify({"error": "Input validation failed", "messages": err.messages}), 400
    except Exception as e:
        db.session.rollback(); print(f"Error updating job {job_id}: {e}")
        return jsonify({"error": "Failed to update job application"}), 500

@api_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a specific job application by its ID."""
    try:
        job_to_delete = db.session.get(JobApplication, job_id)
        if job_to_delete is None: return jsonify({"error": "Job application not found"}), 404
        db.session.delete(job_to_delete)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback(); print(f"Error deleting job {job_id}: {e}")
        return jsonify({"error": "Failed to delete job application"}), 500

# --- User Profile Routes (Phase 2) ---
# ... (Keep existing /profile routes) ...
@api_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get the user profile."""
    profile_id = 1 # Still assuming ID 1 for now
    try:
        user_profile = db.session.get(UserProfile, profile_id)
        if user_profile is None:
            print(f"Profile {profile_id} not found, returning empty profile.")
            return jsonify({}) # Return 200 OK with empty object
        result = profile_schema.dump(user_profile)
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching profile {profile_id}: {e}")
        return jsonify({"error": "Failed to fetch user profile"}), 500

@api_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update the user profile."""
    profile_id = 1 # Still assuming ID 1 for now
    json_data = request.get_json()
    if not json_data: return jsonify({"error": "No input data provided"}), 400
    try:
        user_profile = db.session.get(UserProfile, profile_id)
        if user_profile is None:
             user_profile = UserProfile(id=profile_id) # Assuming fixed ID 1
             # You might need to pre-populate required fields like email here if creating
             if 'email' in json_data: user_profile.email = json_data['email']
             else: return jsonify({"error": "Email is required to create profile"}), 400 # Example check
             db.session.add(user_profile)
             print(f"Profile {profile_id} not found, creating new one.")
        profile_schema.load(json_data, instance=user_profile, partial=True, session=db.session)
        db.session.commit()
        result = profile_schema.dump(user_profile)
        return jsonify(result)
    except ValidationError as err:
        db.session.rollback()
        return jsonify({"error": "Input validation failed", "messages": err.messages}), 400
    except Exception as e:
        db.session.rollback(); print(f"Error updating profile {profile_id}: {e}")
        return jsonify({"error": "Failed to update user profile"}), 500


# --- Job Analyzer Route (Phase 3) ---
# ... (Keep existing /analyze route) ...
@api_bp.route('/analyze', methods=['POST'])
def analyze_job_description():
    """Analyze a job description using Google Gemini."""
    json_data = request.get_json()
    if not json_data or 'description' not in json_data:
        return jsonify({"error": "Missing 'description' in request body"}), 400
    job_description_text = json_data['description']
    if not job_description_text.strip():
        return jsonify({"error": "'description' cannot be empty"}), 400
    api_key = current_app.config.get('GEMINI_API_KEY')
    if not api_key:
        print("Error: GEMINI_API_KEY not configured.")
        return jsonify({"error": "AI Analyzer is not configured on the server."}), 500
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"""Analyze the following job description...""" # Keep prompt from previous step
        response = model.generate_content(prompt)
        analysis_text = response.text if hasattr(response, 'text') else "Could not extract analysis."
        return jsonify({'analysis': analysis_text})
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({"error": "Failed to analyze job description due to an internal error."}), 500

# --- Resume Generation Route (Phase 4) ---

@api_bp.route('/resume', methods=['GET'])
def generate_resume():
    """Generate a basic resume text from the user profile."""
    # TODO: Implement proper user identification
    profile_id = 1 # Assume profile ID 1 for now
    try:
        user_profile = db.session.get(UserProfile, profile_id)
        if user_profile is None:
            return jsonify({"error": f"User profile {profile_id} not found. Cannot generate resume."}), 404

        # --- Basic Resume Formatting ---
        # Build a simple text-based resume string
        resume_parts = []

        # Contact Info
        resume_parts.append("=" * 30)
        resume_parts.append(f"{(user_profile.full_name or 'No Name Provided').upper()}")
        resume_parts.append("=" * 30)
        if user_profile.email: resume_parts.append(f"Email: {user_profile.email}")
        if user_profile.phone: resume_parts.append(f"Phone: {user_profile.phone}")
        if user_profile.address: resume_parts.append(f"Address: {user_profile.address}")
        if user_profile.linkedin_url: resume_parts.append(f"LinkedIn: {user_profile.linkedin_url}")
        if user_profile.portfolio_url: resume_parts.append(f"Portfolio: {user_profile.portfolio_url}")
        resume_parts.append("\n") # Add spacing

        # Skills
        if user_profile.skills:
            resume_parts.append("-" * 30)
            resume_parts.append("SKILLS")
            resume_parts.append("-" * 30)
            # Assume skills might be comma-separated, list them or just print blob
            resume_parts.append(user_profile.skills)
            resume_parts.append("\n")

        # Experience
        if user_profile.experience:
            resume_parts.append("-" * 30)
            resume_parts.append("EXPERIENCE")
            resume_parts.append("-" * 30)
            resume_parts.append(user_profile.experience) # Print as is, assumes pre-formatted text
            resume_parts.append("\n")

        # Education
        if user_profile.education:
            resume_parts.append("-" * 30)
            resume_parts.append("EDUCATION")
            resume_parts.append("-" * 30)
            resume_parts.append(user_profile.education) # Print as is
            resume_parts.append("\n")

        formatted_resume = "\n".join(resume_parts)
        # -----------------------------

        return jsonify({'resume_text': formatted_resume})

    except Exception as e:
        print(f"Error generating resume for profile {profile_id}: {e}")
        return jsonify({"error": "Failed to generate resume due to an internal error."}), 500