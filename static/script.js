let conversation = [];
let user_data;

async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  document.getElementById("user-input").value = "";

  displayMessage("user", userInput);

  conversation.push(userInput);

  if (conversation[0] === "Loan Approval") {
    if (conversation.length === 12) {
      const data = {
        loan_id: parseInt(1),
        no_of_dependents: parseInt(conversation[1]),
        education: conversation[2],
        self_employed: conversation[3],
        income_annum: parseFloat(conversation[4]),
        loan_amount: parseFloat(conversation[5]),
        loan_term: parseInt(conversation[6]),
        cibil_score: parseFloat(conversation[7]),
        residential_assets_value: parseFloat(conversation[8]),
        commercial_assets_value: parseFloat(conversation[9]),
        luxury_assets_value: parseFloat(conversation[10]),
        bank_asset_value: parseFloat(conversation[11]),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/predict/loan_approval",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      displayMessage("bot", `Predicted Loan Status: ${result.prediction}`);
      conversation = []; // Reset conversation after completion
    } else {
      const questions = [
        "How many dependents do you have? (0/1/2/3+)",
        "What's your education level? (Graduate/Not Graduate)",
        "Are you self-employed? (Yes/No)",
        "What's your income per annum? (₹)",
        "What's the loan amount? (₹)",
        "What's the loan term? (Months)",
        "What's your CIBIL score?",
        "What's the value of your residential assets? (₹)",
        "What's the value of your commercial assets? (₹)",
        "What's the value of your luxury assets? (₹)",
        "What's the value of your bank assets? (₹)",
      ];
      displayMessage("bot", questions[conversation.length - 1]);
    }
  } else if (conversation[0] === "Credit Score") {
    if (conversation.length === 29) {
      const data = {
        Monthly_Inhand_Salary: parseFloat(conversation[1] / 80),
        Num_Bank_Accounts: parseFloat(conversation[2]),
        Num_Credit_Card: parseFloat(conversation[3]),
        Interest_Rate: parseFloat(conversation[4]),
        Delay_from_due_date: parseFloat(conversation[5]),
        Num_Credit_Inquiries: parseFloat(conversation[6]),
        Credit_Utilization_Ratio: parseFloat(conversation[7]),
        Total_EMI_per_month: parseFloat(conversation[8] / 80),
        Monthly_Savings_Rate: parseFloat(conversation[9]),
        Frequency_of_Overdrafts: parseFloat(conversation[10]),
        Spending_Categories: conversation[11],
        Consistency_in_Habits: parseFloat(conversation[12]),
        Education_Level: conversation[13],
        Field_of_Study: conversation[14],
        Job_Stability: parseFloat(conversation[15]),
        Professional_Certifications: conversation[16],
        Homeownership_Status: conversation[17],
        Car_Ownership_Expenses: parseFloat(conversation[18] / 80),
        Dependents_Count: parseInt(conversation[19]),
        Retirement_Savings_Participation: conversation[20],
        Investment_Portfolio_Diversity: parseFloat(conversation[21]),
        Value_of_Assets: parseFloat(conversation[22] / 80),
        Investment_Activity_Frequency: parseFloat(conversation[23]),
        Investment_Growth_Rate: parseFloat(conversation[24]),
        Health_Insurance_Coverage: conversation[25],
        Medical_Expenses_Frequency: parseFloat(conversation[26]),
        Wellness_Program_Participation: conversation[27],
        Disability_Status: conversation[28],
      };
      user_data = data;

      const response = await fetch(
        "http://127.0.0.1:8000/predict/credit_score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(result);
      let pcs_score = 0;
      if (result.predicted_credit_score == "Good") {
        pcs_score = 1;
      } else if (result.predicted_credit_score == "Standard") {
        pcs_score = 0.5;
      } else {
        pcs_score = 0.1;
      }
      console.log(pcs_score);

      // Perform calculations for other scores
      const behavioral_score =
        data.Monthly_Savings_Rate * 0.3 +
        data.Frequency_of_Overdrafts * 0.2 +
        data.Consistency_in_Habits * 0.25 +
        (data.Spending_Categories === "Essentials" ? 1 : 0) * 0.25;
      console.log(behavioral_score);

      const educational_score =
        (data.Education_Level === "Graduate" ? 1 : 0) * 0.3 +
        data.Job_Stability * 0.3 +
        (data.Field_of_Study === "Relevant" ? 1 : 0) * 0.2 +
        (data.Professional_Certifications === "Yes" ? 1 : 0) * 0.2;
      console.log(educational_score);

      const lifestyle_score =
        (data.Homeownership_Status === "Own" ? 1 : 0) * 0.3 +
        data.Car_Ownership_Expenses * 0.25 +
        data.Dependents_Count * 0.25 +
        (data.Retirement_Savings_Participation === "Yes" ? 1 : 0) * 0.2;
      console.log(lifestyle_score);

      const investment_score =
        data.Investment_Portfolio_Diversity * 0.3 +
        data.Value_of_Assets * 0.3 +
        data.Investment_Activity_Frequency * 0.2 +
        data.Investment_Growth_Rate * 0.2;
      console.log(investment_score);

      const health_score =
        (data.Health_Insurance_Coverage === "Yes" ? 1 : 0) * 0.3 +
        data.Medical_Expenses_Frequency * 0.3 +
        (data.Wellness_Program_Participation === "Yes" ? 1 : 0) * 0.2 +
        (data.Disability_Status === "Yes" ? 1 : 0) * 0.2;
      console.log(health_score);

      // Calculate final credit score
      const final_score =
        pcs_score * 0.25 +
        behavioral_score * 0.15 +
        educational_score * 0.15 +
        lifestyle_score * 0.15 +
        investment_score * 0.15 +
        health_score * 0.15;

      console.log(final_score);
      // Map final score to categories
      const score_mapping_reverse = { 2: "Good", 1: "Standard", 0: "Poor" };
      const predicted_score =
        final_score >= 2000
          ? "Good"
          : final_score >= 1000
          ? "Standard"
          : "Poor";

      displayMessage("bot", `Predicted Credit Score: ${predicted_score}`);

      const prompt = `Generate a financial health and risk assessment report for the user with data ${JSON.stringify(
        user_data
      )} and credit score ${predicted_score}. The report should be an index.html file with graphs and suggestions for the user. Only reply with html file and no instructions, keep the html file modern looking with css and it should look good on phones`;

      const req = await fetch("http://127.0.0.1:8000/generate_report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const res = await req.json();
      let fileContent = res.prediction;
      fileContent = fileContent.replace(/^```html\n/, "");
      fileContent = fileContent.replace(/\n```$/, "");

      download(fileContent, "report.html", "text/plain");

      conversation = []; // Reset conversation after completion
    } else {
      const questions = [
        "What's your monthly in-hand salary? (₹)",
        "How many bank accounts do you have?",
        "How many credit cards do you have?",
        "What's the interest rate on your loans? (%)",
        "How many days are you delayed from due date on average?",
        "How many credit inquiries have you had?",
        "What's your credit utilization ratio? (%)",
        "What's your total EMI per month? (₹)",
        "What's your monthly savings rate? (%)",
        "How frequently do you have overdrafts? (Number per month)",
        "Do you spend more on essentials or non-essentials? (Essentials/Non-essentials)",
        "How consistent are your spending and saving habits? (Score from 0 to 1)",
        "What's your highest level of education? (Graduate/Not Graduate)",
        "Is your field of study relevant to your current job? (Relevant/Not Relevant)",
        "How stable is your job? (Score from 0 to 1)",
        "Do you have any professional certifications? (Yes/No)",
        "Do you own a home? (Own/Rent)",
        "What's your car ownership and related expenses? (₹)",
        "How many dependents do you have?",
        "Do you participate in retirement savings plans? (Yes/No)",
        "How diverse is your investment portfolio? (Score from 0 to 1)",
        "What's the value of your owned assets? (₹)",
        "How frequently do you engage in investment activities? (Score from 0 to 1)",
        "What's your investment growth rate? (Score from 0 to 1)",
        "Do you have health insurance coverage? (Yes/No)",
        "How frequently do you have medical expenses? (Number per month)",
        "Do you participate in wellness programs? (Yes/No)",
        "Do you have any disability status? (Yes/No)",
      ];
      displayMessage("bot", questions[conversation.length - 1]);
    }
  } else {
    if (conversation.length === 1) {
      displayMessage(
        "bot",
        'Invalid input. Please type "Loan Approval" or "Credit Score" to start.'
      );
    } else {
      displayMessage("bot", "Invalid input. Please start again.");
      conversation = []; // Reset conversation for invalid input
    }
  }
}

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
function displayMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "alert",
    "alert-" + (sender === "bot" ? "secondary" : "info"),
    "mb-2",
    "py-2",
    "px-3",
    "rounded"
  );
  messageElement.innerText = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

const input = document.getElementById("user-input");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
