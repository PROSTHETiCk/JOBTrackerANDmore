from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

@api_bp.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')

# --- Job Application Routes ---
# TODO: Implement Phase 1 CRUD endpoints for JobApplication here
# GET /jobs - List all jobs
# POST /jobs - Add a new job
# GET /jobs/<id> - Get specific job
# PUT /jobs/<id> - Update specific job
# DELETE /jobs/<id> - Delete specific job

# --- User Profile Routes ---
# TODO: Implement Phase 2 CRUD endpoints for UserProfile here
# GET /profile/<id> - Get profile
# PUT /profile/<id> - Update profile