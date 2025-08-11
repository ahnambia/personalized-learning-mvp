"""baseline core tables + extensions

Revision ID: 20250811_0001
Revises: 
Create Date: 2025-08-11 00:00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '20250811_0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Extensions (pgcrypto for gen_random_uuid, pgvector for later)
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('email', sa.String(length=320), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('provider', sa.String(length=16), nullable=False, server_default='local'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_users_email_unique', 'users', ['email'], unique=True)

    # profiles (1:1 users)
    op.create_table(
        'profiles',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('display_name', sa.String(length=120), nullable=True),
        sa.Column('avatar_url', sa.String(length=512), nullable=True),
        sa.Column('timezone', sa.String(length=64), nullable=True),
    )

    # skills
    op.create_table(
        'skills',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('slug', sa.String(length=128), nullable=False, unique=True),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('domain', sa.String(length=64), nullable=False, server_default='dsa'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_skills_slug_unique', 'skills', ['slug'], unique=True)

    # content_items
    op.create_table(
        'content_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('slug', sa.String(length=128), nullable=False, unique=True),
        sa.Column('title', sa.String(length=256), nullable=False),
        sa.Column('content_type', sa.String(length=32), nullable=False),   # video/article/challenge
        sa.Column('difficulty', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('url', sa.String(length=1024), nullable=True),
        sa.Column('est_minutes', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_content_slug_unique', 'content_items', ['slug'], unique=True)

def downgrade():
    op.drop_index('ix_content_slug_unique', table_name='content_items')
    op.drop_table('content_items')
    op.drop_index('ix_skills_slug_unique', table_name='skills')
    op.drop_table('skills')
    op.drop_table('profiles')
    op.drop_index('ix_users_email_unique', table_name='users')
    op.drop_table('users')
    op.execute("DROP EXTENSION IF EXISTS vector;")
    op.execute("DROP EXTENSION IF EXISTS pgcrypto;")
