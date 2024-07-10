# Credit Predict
### Credit Score and Loan Approval Prediction App

This application predicts credit scores and loan approvals using AI models. It includes a detailed credit score calculation formula and various parameters contributing to the prediction.

## Problem Statement
This app aims to improve credit scoring and loan prediction accuracy using AI models, enabling lenders to make more informed decisions about loan approvals and interest rates.

## Setting Up the Environment

To run the application locally, follow these steps:

1. Clone this repository:
 ```bash
 git clone https://github.com/altf4-games/CreditPredict.git
 ```
2. Navigate to the api directory:
```bash
cd api
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Create a .env file in the root directory and configure environment variable API_KEY for the Gemini API.
```bash
API_KEY=
```
6. Start the FastAPI server using uvicorn:
```bash
uvicorn index:app --reload
```
6. Access the application at:
```bash
http://127.0.0.1:8000/static/index.html
```

## Credit Score Calculation Formula

The credit score is calculated using the following formula:

Credit Score = (0.25 × Normalized PCS) + (0.15 × Normalized BAS) + (0.15 × Normalized EPS) + (0.15 × Normalized LFRS) + (0.15 × Normalized IAMS) + (0.15 × Normalized HWS)

### Detailed Explanation of Components

#### 1. Primary Credit Score (PCS)

Parameters:
- Monthly Inhand Salary
- Number of Bank Accounts
- Number of Credit Cards
- Interest Rate
- Delay from Due Date
- Number of Credit Inquiries
- Credit Utilization Ratio
- Total EMI per Month

#### 2. Behavioral Analysis Score (BAS)

Parameters:
- Monthly Savings Rate
- Frequency of Overdrafts
- Spending Categories (essentials vs. non-essentials)
- Consistency in Spending and Saving Habits

#### 3. Educational and Professional Background Score (EPS)

Parameters:
- Highest Level of Education
- Field of Study and Relevance to Current Job Market
- Job Stability (duration in current job, frequency of job changes)
- Professional Certifications and Skills

#### 4. Lifestyle and Financial Responsibility Score (LFRS)

Parameters:
- Homeownership Status (own vs. rent)
- Car Ownership and Related Expenses
- Dependents and Family Obligations
- Participation in Retirement Savings Plans

#### 5. Investment and Asset Management Score (IAMS)

Parameters:
- Diversity of Investment Portfolio
- Value of Owned Assets (real estate, stocks, bonds)
- Frequency of Investment Activities
- Growth Rate of Investments

#### 6. Health and Wellness Score (HWS)

Parameters:
- Health Insurance Coverage
- Frequency of Medical Expenses
- Participation in Wellness Programs
- Disability Status
