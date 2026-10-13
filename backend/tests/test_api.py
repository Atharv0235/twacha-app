"""
Run from the backend root:   pip install pytest httpx && pytest -q
Optional real-photo tests:   TWACHA_PHOTOS=/path/to/folder pytest -q   (any .jpg/.png/.webp with a face)
"""
import io, os, sys, glob, tempfile
from datetime import date, timedelta

_tmp = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp}/test.db"
os.environ["ENABLE_DEMO"] = "1"
os.environ.pop("WAQI_TOKEN", None)
os.environ.pop("DEMO_AQI", None)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np, cv2, pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def _jpg(arr):
    ok, buf = cv2.imencode(".jpg", arr)
    return buf.tobytes()


def _post(client, data, name="x.jpg", **form):
    return client.post("/api/scan/", files={"image": (name, data, "image/jpeg")}, data=form)


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200 and r.json()["acne_model_loaded"] is True


def test_no_file_is_422(client):
    assert client.post("/api/scan/").status_code == 422


def test_not_an_image(client):
    r = _post(client, b"hello world")
    assert r.status_code == 422 and "image" in r.json()["detail"].lower()


def test_empty_file(client):
    assert _post(client, b"").status_code == 422


def test_too_dark(client):
    r = _post(client, _jpg(np.full((400, 400, 3), 8, np.uint8)))
    assert r.status_code == 422 and r.json()["detail"]     # no face / too dark: friendly message


def test_blurry_or_no_face(client):
    rng = np.random.default_rng(0)
    img = cv2.GaussianBlur(rng.integers(60, 200, (400, 400, 3), dtype=np.uint8), (51, 51), 0)
    assert _post(client, _jpg(img)).status_code == 422


def test_too_large(client):
    assert _post(client, b"0" * (10 * 1024 * 1024 + 1)).status_code == 413


def test_limits_validated(client):
    assert client.get("/api/history/?limit=0").status_code == 422
    assert client.get("/api/history/?limit=100000").status_code == 422


def test_log_validation(client):
    assert client.post("/api/log/", json={"foods_eaten": []}).status_code == 422
    assert client.post("/api/log/", json={"foods_eaten": ["dal"], "log_date": str(date.today() + timedelta(days=2))}).status_code == 422
    assert client.post("/api/log/", json={"foods_eaten": ["dal", "  "]}).json()["foods_eaten"] == ["dal"]


def test_foods_picker(client):
    names = client.get("/api/foods/").json()
    assert len(names) > 20 and names == sorted(names)


A = {"X-Device-Id": "device-aaaa-1111"}
B = {"X-Device-Id": "device-bbbb-2222"}


def test_two_devices_are_isolated(client):
    client.post("/demo/reset", headers=A); client.post("/demo/reset", headers=B)
    client.post("/demo/seed?days=5", headers=A)
    client.post("/api/log/", json={"foods_eaten": ["dal"]}, headers=A)
    ha = client.get("/api/history/", headers=A).json()
    hb = client.get("/api/history/", headers=B).json()
    assert len(ha["scans"]) == 5 and ha["program"]["is_demo"] is True
    assert hb["scans"] == [] and hb["program"]["is_demo"] is False
    assert client.get("/api/log/", headers=B).json() == []
    assert client.get("/api/log/", headers=A).json()[0]["foods_eaten"] == ["dal"]


def test_delete_my_data_only_deletes_mine(client):
    client.post("/demo/seed?days=4", headers=A); client.post("/demo/seed?days=4", headers=B)
    r = client.delete("/api/data/", headers=A)
    assert r.status_code == 200 and r.json()["deleted"]["scans"] == 4
    assert client.get("/api/history/", headers=A).json()["scans"] == []
    assert len(client.get("/api/history/", headers=B).json()["scans"]) == 4


def test_bad_device_id_falls_back_to_anonymous(client):
    client.post("/demo/reset"); client.post("/demo/seed?days=3", headers={"X-Device-Id": "<script>"})
    assert len(client.get("/api/history/").json()["scans"]) == 3      # both landed in "anonymous"
    client.post("/demo/reset")


def test_old_database_gets_new_columns():
    import sqlite3, tempfile, importlib, os
    d = tempfile.mkdtemp(); path = f"{d}/old.db"
    con = sqlite3.connect(path)
    con.execute("CREATE TABLE programs (id INTEGER PRIMARY KEY, start_date DATE NOT NULL, total_days INTEGER NOT NULL)")
    con.execute("INSERT INTO programs (start_date, total_days) VALUES ('2026-09-01', 30)")
    con.commit(); con.close()
    from sqlalchemy import create_engine, inspect
    import app.database as dbm
    old = dbm.engine
    dbm.engine = create_engine(f"sqlite:///{path}")
    try:
        dbm.ensure_columns()
        cols = {c["name"] for c in inspect(dbm.engine).get_columns("programs")}
        assert {"device_id", "is_demo"} <= cols
    finally:
        dbm.engine = old


def test_demo_seed_and_trend(client):
    assert client.post("/demo/seed?days=14").status_code == 200
    h = client.get("/api/history/").json()
    assert len(h["scans"]) == 14 and h["program"]["current_day"] == 15
    assert h["scans"][0]["created_at"].endswith(("Z", "+00:00"))       # UTC-aware
    client.post("/demo/reset")
    assert client.get("/api/history/").json()["scans"] == []


PHOTOS = sorted(sum((glob.glob(os.path.join(os.environ.get("TWACHA_PHOTOS", "/nonexistent"), e))
                     for e in ("*.jpg", "*.jpeg", "*.png", "*.webp")), []))


@pytest.mark.skipif(not PHOTOS, reason="set TWACHA_PHOTOS to a folder of face photos")
@pytest.mark.parametrize("path", PHOTOS)
def test_real_photo(client, path):
    data = open(path, "rb").read()
    r = _post(client, data, name=os.path.basename(path))
    assert r.status_code in (201, 422), r.text
    if r.status_code == 201:
        j = r.json()
        for k in ("acne_score", "redness_score", "dryness_score"):
            assert 0 <= j["scan"][k] <= 10
        assert j["environment"]["source"] == "unavailable"           # no token in tests
        assert 1 <= len(j["recommendations"]) <= 3
        assert any("Air-quality" in n for n in j["quality_notes"])
        for rec in j["recommendations"]:
            assert rec["evidence_tier"] != "clinical"
            assert "Fabbrocini" not in (rec["source_note"] or "")
