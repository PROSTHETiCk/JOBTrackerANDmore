from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
# from marshmallow import fields
from .models import JobApplication, UserProfile # Import UserProfile model

# --- Job Application Schema (from Phase 1) ---
class JobApplicationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = JobApplication
        load_instance = True
        # sqla_session = db.session # Uncomment if needed

    # Add custom fields or validation if needed later


# --- User Profile Schema (for Phase 2) ---
class UserProfileSchema(SQLAlchemyAutoSchema):
    """
    Marshmallow schema for the UserProfile model.
    Used for validating input and serializing output for the profile API.
    """
    class Meta:
        model = UserProfile
        load_instance = True
        # Exclude 'id' from loading, as it's usually not set by the client directly
        # Allow 'id' in dump (output)
        load_only = () # Or specify fields allowed for loading if needed
        dump_only = ("id",) # 'id' is typically read-only from API perspective

        # Define fields explicitly if needed for more control, e.g.:
        # fields = ("full_name", "email", "phone", "address", "linkedin_url", "portfolio_url", "skills", "experience", "education")

    # Add any custom validation or formatting if needed
    # email = fields.Email(required=True) # Example if making email required via schema