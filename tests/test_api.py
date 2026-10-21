"""
Tests for FastAPI backend endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)


class TestAPIEndpoints:
    def test_health(self):
        res = client.get('/api/health')
        assert res.status_code == 200
        data = res.json()
        assert data['status'] == 'HEALTHY'
        assert data['total_records'] == 44

    def test_summary(self):
        res = client.get('/api/summary')
        assert res.status_code == 200
        data = res.json()
        assert data['sector_count'] == 11
        assert data['event_count'] == 4
        assert data['class_distribution']['High'] == 26
        assert data['class_distribution']['Medium'] == 18
        assert data['class_distribution']['Low'] == 0

    def test_stress_events(self):
        res = client.get('/api/stress-events')
        assert res.status_code == 200
        events = res.json()
        assert len(events) == 4
        names = [e['event_name'] for e in events]
        assert "COVID-19 Crash" in names
        assert "Russia-Ukraine Shock" in names

    def test_sectors(self):
        res = client.get('/api/sectors')
        assert res.status_code == 200
        sectors = res.json()
        assert len(sectors) == 11

    def test_risk_matrix(self):
        res = client.get('/api/risk-matrix')
        assert res.status_code == 200
        data = res.json()
        assert len(data['sectors']) == 11
        assert len(data['events']) == 4
        assert len(data['matrix']) == 11

    def test_records_filtering(self):
        res_all = client.get('/api/records')
        assert res_all.status_code == 200
        assert len(res_all.json()) == 44

        res_bank = client.get('/api/records?sector=Banking')
        assert res_bank.status_code == 200
        assert len(res_bank.json()) == 4

        res_high = client.get('/api/records?risk_label=High')
        assert res_high.status_code == 200
        assert len(res_high.json()) == 26

    def test_prediction_endpoint(self):
        res = client.post('/api/predict', json={'var_95': -7.5, 'sharpe_drop': -4.0})
        assert res.status_code == 200
        data = res.json()
        assert data['predicted_label'] in ['High', 'Medium']
        assert 'confidence' in data
        assert 'probabilities' in data

    def test_export_endpoints(self):
        res_csv = client.get('/api/export/csv')
        assert res_csv.status_code == 200
        assert 'text/csv' in res_csv.headers['content-type']

        res_excel = client.get('/api/export/excel')
        assert res_excel.status_code == 200
