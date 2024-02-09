from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import search
import requests

# from config import settings

app = FastAPI()


@app.get("/")
def root():
    return "Welcome to my name game API! use the /docs endpoint to see the docs"


app.include_router(search.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
