<%doc>
    Mako template for migration scripts.
</%doc>
"""${message}"""

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}

from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    ${upgrade_ops if upgrade_ops else "    pass  # TODO: Replace with manual Alembic op commands or op.execute('SQL')"}
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    ${downgrade_ops if downgrade_ops else "    pass  # TODO: Replace with manual Alembic op commands or op.execute('SQL')"}
    # ### end Alembic commands ###