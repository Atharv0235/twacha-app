import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./twacha.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_columns():
    """Tiny migration for databases created before per-device data (create_all never alters tables)."""
    from sqlalchemy import inspect, text
    insp = inspect(engine)
    wanted = {
        "programs": [("device_id", "VARCHAR DEFAULT 'anonymous' NOT NULL"), ("is_demo", "BOOLEAN DEFAULT FALSE NOT NULL")],
        "skin_scans": [("device_id", "VARCHAR DEFAULT 'anonymous' NOT NULL")],
        "dietary_logs": [("device_id", "VARCHAR DEFAULT 'anonymous' NOT NULL")],
    }
    with engine.begin() as conn:
        for table, cols in wanted.items():
            if not insp.has_table(table):
                continue
            have = {c["name"] for c in insp.get_columns(table)}
            for name, ddl in cols:
                if name not in have:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
