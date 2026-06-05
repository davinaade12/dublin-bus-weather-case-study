from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from .database import Base

class Stop(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    stop_code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float)
    lon = Column(Float)


class ArrivalSnapshot(Base):
    __tablename__ = "arrival_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id"))
    route = Column(String)
    scheduled_time = Column(DateTime)
    predicted_time = Column(DateTime)
    captured_time = Column(DateTime)


class WeatherHour(Base):
    __tablename__ = "weather_hours"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String)
    timestamp_hour = Column(DateTime)
    precipitation_mm = Column(Float)


class MetricAggregate(Base):
    __tablename__ = "metric_aggregates"

    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id"))
    timestamp_hour = Column(DateTime)
    rain_bin = Column(String)
    on_time_percentage = Column(Float)
    samples = Column(Integer)