from datetime import datetime

def late_minutes(scheduled_time: datetime, predicted_time: datetime) -> float:
    difference = predicted_time - scheduled_time
    return difference.total_seconds() / 60

def is_on_time(scheduled_time: datetime, predicted_time: datetime) -> bool:
    return late_minutes(scheduled_time, predicted_time) <= 2

def rain_bin(precipitation_mm: float) -> str:
    if precipitation_mm == 0:
        return "none"
    elif precipitation_mm <= 1:
        return "light"
    elif precipitation_mm <= 4:
        return "moderate"
    else:
        return "heavy"