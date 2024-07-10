from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import joblib
import google.generativeai as genai
from dotenv import load_dotenv
import os

def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn

load_dotenv()

GOOGLE_API_KEY=os.getenv("API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Load the models
credit_score_model = joblib.load('models/credit_score_model.joblib')
loan_approval_model = joblib.load('models/loan_approval_model.joblib')

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../static"), name="static")

# Define request bodies
class CreditScoreRequest(BaseModel):
    Monthly_Inhand_Salary: float
    Num_Bank_Accounts: float
    Num_Credit_Card: float
    Interest_Rate: float
    Delay_from_due_date: float
    Num_Credit_Inquiries: float
    Credit_Utilization_Ratio: float
    Total_EMI_per_month: float

class LoanApplication(BaseModel):
    loan_id: int
    no_of_dependents: int
    education: str
    self_employed: str
    income_annum: float
    loan_amount: float
    loan_term: int
    cibil_score: float
    residential_assets_value: float
    commercial_assets_value: float
    luxury_assets_value: float
    bank_asset_value: float

# Prediction endpoints
@app.post("/predict/credit_score")
def predict_credit_score(data: CreditScoreRequest):
    input_data = pd.DataFrame([data.dict()])
    prediction = credit_score_model.predict(input_data)[0]
    score_mapping_reverse = {2: 'Good', 1: 'Standard', 0: 'Poor'}
    predicted_score = score_mapping_reverse[prediction]
    return {"predicted_credit_score": predicted_score}

@app.post("/predict/loan_approval")
def predict(application: LoanApplication):
    data = {
        'loan_id': [application.loan_id],
        'no_of_dependents': [application.no_of_dependents],
        'education': [application.education],
        'self_employed': [application.self_employed],
        'income_annum': [application.income_annum],
        'loan_amount': [application.loan_amount],
        'loan_term': [application.loan_term],
        'cibil_score': [application.cibil_score],
        'residential_assets_value': [application.residential_assets_value],
        'commercial_assets_value': [application.commercial_assets_value],
        'luxury_assets_value': [application.luxury_assets_value],
        'bank_asset_value': [application.bank_asset_value]
    }
    
    df = pd.DataFrame(data)
    
    X = df.drop(columns=['loan_id'])
    
    prediction = loan_approval_model.predict(X)
    result = 'Approved' if prediction[0] == 1 else 'Rejected'
    
    return {"prediction": result}

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate_report")
def generate_report(request: PromptRequest):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(request.prompt)
    return {"prediction": response.text}

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
