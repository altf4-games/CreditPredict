from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from joblib import load
import joblib

# Load the models
credit_score_model = joblib.load('credit_score_model.joblib')
loan_approval_model = load('loan_approval_model.joblib')

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
    Gender: str
    Married: str
    Dependents: int
    Education: str
    Self_Employed: str
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: int
    Property_Area: str

# Prediction endpoints
@app.post("/predict/credit_score")
def predict_credit_score(data: CreditScoreRequest):
    input_data = pd.DataFrame([data.dict()])
    prediction = credit_score_model.predict(input_data)[0]
    score_mapping_reverse = {2: 'Good', 1: 'Standard', 0: 'Poor'}
    predicted_score = score_mapping_reverse[prediction]
    return {"predicted_credit_score": predicted_score}

@app.post("/predict/loan_approval")
def predict_loan_approval(application: LoanApplication):
    data = pd.DataFrame([application.dict()])
    try:
        prediction = loan_approval_model.predict(data)
        return {"predicted_status": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
