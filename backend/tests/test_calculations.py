from datetime import datetime
from app.utils.calculations import late_minutes, is_on_time, rain_bin

def test_late_minutes():
    scheduled = datetime(2026, 6, 5, 9, 0)
    predicted = datetime(2026, 6, 5, 9, 3)
    assert late_minutes(scheduled, predicted) == 3

def test_is_on_time_true():
    scheduled = datetime(2026, 6, 5, 9, 0)
    predicted = datetime(2026, 6, 5, 9, 2)
    assert is_on_time(scheduled, predicted) == True

def test_is_on_time_false():
    scheduled = datetime(2026, 6, 5, 9, 0)
    predicted = datetime(2026, 6, 5, 9, 5)
    assert is_on_time(scheduled, predicted) == False

def test_rain_bin_none():
    assert rain_bin(0) == "none"

def test_rain_bin_light():
    assert rain_bin(0.5) == "light"

def test_rain_bin_moderate():
    assert rain_bin(3.2) == "moderate"

def test_rain_bin_heavy():
    assert rain_bin(5.0) == "heavy"