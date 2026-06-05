from fastapi import FastAPI

app = FastAPI(title="Dublin Bus Weather Case Study API")

@app.get("/")
def home():
    return {"message": "Dublin Bus Weather API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/sample-data")
def sample_data():
    return {
        "stop": "O'Connell Street",
        "rainfall_mm": 3.2,
        "rain_bin": "moderate",
        "on_time_percentage": 82,
        "samples": 25
    }