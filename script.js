let conversation = [];

async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  document.getElementById("user-input").value = "";

  displayMessage("user", userInput);

  conversation.push(userInput);

  if (conversation[0] === "Loan Approval") {
    if (conversation.length === 12) {
      const data = {
        Gender: conversation[1],
        Married: conversation[2],
        Dependents: parseInt(conversation[3]),
        Education: conversation[4],
        Self_Employed: conversation[5],
        ApplicantIncome: parseFloat(conversation[6]),
        CoapplicantIncome: parseFloat(conversation[7]),
        LoanAmount: parseFloat(conversation[8]),
        Loan_Amount_Term: parseFloat(conversation[9]),
        Credit_History: parseInt(conversation[10]),
        Property_Area: conversation[11],
      };

      const response = await fetch(
        "https://dane-profound-arguably.ngrok-free.app/predict/loan_approval",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      displayMessage(
        "bot",
        `Predicted Loan Status: ${result.predicted_status}`
      );
      conversation = []; // Reset conversation after completion
    } else {
      const questions = [
        "What's your gender? (Male/Female)",
        "Are you married? (Yes/No)",
        "How many dependents do you have? (0/1/2/3+)",
        "What's your education level? (Graduate/Not Graduate)",
        "Are you self-employed? (Yes/No)",
        "What's your applicant income? ($)",
        "What's your co-applicant income? ($)",
        "What's the loan amount? ($)",
        "What's the loan amount term? (Days)",
        "Do you have a credit history? (1/0)",
        "What's your property area? (Urban/Semiurban/Rural)",
      ];
      displayMessage("bot", questions[conversation.length - 1]);
    }
  } else if (conversation[0] === "Credit Score") {
    if (conversation.length === 9) {
      const data = {
        Monthly_Inhand_Salary: parseFloat(conversation[1]),
        Num_Bank_Accounts: parseFloat(conversation[2]),
        Num_Credit_Card: parseFloat(conversation[3]),
        Interest_Rate: parseFloat(conversation[4]),
        Delay_from_due_date: parseFloat(conversation[5]),
        Num_Credit_Inquiries: parseFloat(conversation[6]),
        Credit_Utilization_Ratio: parseFloat(conversation[7]),
        Total_EMI_per_month: parseFloat(conversation[8]),
      };

      const response = await fetch(
        "https://dane-profound-arguably.ngrok-free.app/predict/credit_score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      displayMessage(
        "bot",
        `Predicted Credit Score: ${result.predicted_credit_score}`
      );
      conversation = []; // Reset conversation after completion
    } else {
      const questions = [
        "What's your monthly in-hand salary? ($)",
        "How many bank accounts do you have?",
        "How many credit cards do you have?",
        "What's the interest rate on your loans? (%)",
        "How many days are you delayed from due date on average?",
        "How many credit inquiries have you had?",
        "What's your credit utilization ratio? (%)",
        "What's your total EMI per month? ($)",
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
