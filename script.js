const form = document.getElementById("businessForm");
const steps = document.querySelectorAll(".wizard-step");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

const stepLabel = document.getElementById("stepLabel");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");

const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const scoreText = document.getElementById("scoreText");
const scoreFill = document.getElementById("scoreFill");
const restartBtn = document.getElementById("restartBtn");

const conditionalPanels = document.querySelectorAll(".conditional-panel");
const conditionalEmpty = document.getElementById("conditionalEmpty");

let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  stepLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  progressLabel.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;

  backBtn.classList.toggle("hidden", currentStep === 0);
  nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
  submitBtn.classList.toggle("hidden", currentStep !== steps.length - 1);

  updateConditionalPanels();

  if (currentStep > 0) {
    document.querySelector(".form-section").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function validateCurrentStep() {
  const activeStep = steps[currentStep];

  const requiredGroups = activeStep.querySelectorAll("[data-required-group]");

  for (const group of requiredGroups) {
    const groupName = group.dataset.requiredGroup;
    const checked = group.querySelector(`input[name="${groupName}"]:checked`);

    if (!checked) {
      showAlert("Please choose at least one option before continuing.");
      return false;
    }
  }

  const requiredFields = activeStep.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      showAlert("Please complete the required field.");
      return false;
    }
  }

  return true;
}

function showAlert(message) {
  const existing = document.querySelector(".form-alert");

  if (existing) {
    existing.remove();
  }

  const alert = document.createElement("div");
  alert.className = "form-alert";
  alert.textContent = message;

  const activeStep = steps[currentStep];
  activeStep.prepend(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
});

function updateConditionalPanels() {
  const selectedPanels = Array.from(document.querySelectorAll('input[name="services"]:checked'))
    .map(input => input.dataset.panel);

  let visibleCount = 0;

  conditionalPanels.forEach(panel => {
    const shouldShow = selectedPanels.includes(panel.dataset.panel);
    panel.classList.toggle("show", shouldShow);

    if (shouldShow) visibleCount++;
  });

  conditionalEmpty.classList.toggle("hidden", visibleCount > 0);
}

document.querySelectorAll('input[name="services"]').forEach(input => {
  input.addEventListener("change", updateConditionalPanels);
});

function getFormValues() {
  const data = new FormData(form);

  return {
    fullName: data.get("fullName") || "",
    businessName: data.get("businessName") || "",
    phone: data.get("phone") || "",
    email: data.get("email") || "",
    location: data.get("location") || "",
    industry: data.get("industry") || "",
    stage: data.get("stage") || "",
    services: data.getAll("services"),
    assets: data.getAll("assets"),
    currentLink: data.get("currentLink") || "",

    companyRegistered: data.get("companyRegistered") || "",
    registrationDocuments: data.get("registrationDocuments") || "",

    websiteType: data.get("websiteType") || "",
    hostingStatus: data.get("hostingStatus") || "",

    marketingPlatforms: data.get("marketingPlatforms") || "",
    marketingProblem: data.get("marketingProblem") || "",

    customerContactMethod: data.get("customerContactMethod") || "",
    salesFollowUp: data.get("salesFollowUp") || "",

    manualTasks: data.get("manualTasks") || "",
    currentTools: data.get("currentTools") || "",

    operationsProblem: data.get("operationsProblem") || "",
    processDocumentation: data.get("processDocumentation") || "",

    timeline: data.get("timeline") || "",
    budget: data.get("budget") || "",
    urgency: data.get("urgency") || "",
    decisionMaker: data.get("decisionMaker") || "",

    goal: data.get("goal") || "",
    extraNotes: data.get("extraNotes") || ""
  };
}

function createRecommendation(values) {
  const services = values.services;
  const stage = values.stage;

  if (
    services.length >= 4 ||
    (
      services.includes("Website Services") &&
      services.includes("Sales Systems") &&
      services.includes("Marketing")
    )
  ) {
    return {
      title: "Full Business Growth System",
      text: "Your form has been submitted. Based on your answers, your business needs a connected growth system covering visibility, sales, automation, and operational structure."
    };
  }

  if (
    stage === "Idea stage" ||
    stage === "Started but not registered" ||
    services.includes("Business Registration")
  ) {
    return {
      title: "Business Foundation Setup",
      text: "Your form has been submitted. Based on your answers, your first priority is business structure, registration support, documentation, and a professional digital presence."
    };
  }

  if (
    services.includes("Website Services") ||
    stage === "Registered but weak online presence"
  ) {
    return {
      title: "Website & Visibility System",
      text: "Your form has been submitted. Based on your answers, your business needs a stronger online presence, a clean website, SEO setup, and better customer visibility."
    };
  }

  if (
    services.includes("Sales Systems") ||
    services.includes("Marketing")
  ) {
    return {
      title: "Sales & Marketing Growth System",
      text: "Your form has been submitted. Based on your answers, your business needs better marketing, lead generation, customer follow-up, and a stronger sales system."
    };
  }

  if (
    services.includes("Automation and Support") ||
    services.includes("Industrial Engineering")
  ) {
    return {
      title: "Operations & Automation System",
      text: "Your form has been submitted. Based on your answers, your business needs better workflow, automation, process improvement, and reduced manual work."
    };
  }

  return {
    title: "Business Growth Consultation",
    text: "Your form has been submitted. Based on your answers, your business needs a custom review so we can recommend the best starting point."
  };
}

function calculateScore(values) {
  let score = 20;

  score += values.assets.length * 5;
  score += values.services.length * 4;

  if (values.stage === "Registered but weak online presence") score += 12;
  if (values.stage === "Operating but need better systems") score += 18;
  if (values.email) score += 5;
  if (values.currentLink) score += 5;
  if (values.timeline === "Immediately") score += 8;
  if (values.urgency === "Very urgent") score += 8;

  return Math.min(score, 96);
}

function buildSummary(values, recommendation, score) {
  return `
New Mere Simplicity Business Checkup

Full Name:
${values.fullName}

Business Name:
${values.businessName || "Not provided"}

WhatsApp:
${values.phone}

Email:
${values.email || "Not provided"}

Location:
${values.location || "Not provided"}

Industry:
${values.industry || "Not provided"}

Business Stage:
${values.stage}

Services Needed:
${values.services.length ? values.services.join(", ") : "Not selected"}

Current Business Assets:
${values.assets.length ? values.assets.join(", ") : "None selected"}

Current Website / Social Link:
${values.currentLink || "Not provided"}

Registration Details:
Company Status: ${values.companyRegistered || "Not provided"}
Documents Needed: ${values.registrationDocuments || "Not provided"}

Website Details:
Website Type: ${values.websiteType || "Not provided"}
Hosting / Domain: ${values.hostingStatus || "Not provided"}

Marketing Details:
Platforms: ${values.marketingPlatforms || "Not provided"}
Marketing Problem: ${values.marketingProblem || "Not provided"}

Sales Details:
Customer Contact Method: ${values.customerContactMethod || "Not provided"}
Sales Follow-Up: ${values.salesFollowUp || "Not provided"}

Automation Details:
Manual Tasks: ${values.manualTasks || "Not provided"}
Current Tools: ${values.currentTools || "Not provided"}

Operations Details:
Operations Problem: ${values.operationsProblem || "Not provided"}
Process Documentation: ${values.processDocumentation || "Not provided"}

Timeline:
${values.timeline}

Budget:
${values.budget}

Urgency:
${values.urgency}

Decision Maker:
${values.decisionMaker || "Not provided"}

Goal:
${values.goal}

Extra Notes:
${values.extraNotes || "None"}

Recommended Service Path:
${recommendation.title}

Recommendation:
${recommendation.text}

Business Readiness Score:
${score}%
`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const values = getFormValues();
  const recommendation = createRecommendation(values);
  const score = calculateScore(values);
  const summary = buildSummary(values, recommendation, score);

  const formspreeData = new FormData();

  formspreeData.append("_subject", "New Mere Simplicity Business Checkup");
  formspreeData.append("Full Name", values.fullName);
  formspreeData.append("Business Name", values.businessName || "Not provided");
  formspreeData.append("WhatsApp", values.phone);
  formspreeData.append("Email", values.email || "Not provided");
  formspreeData.append("Location", values.location || "Not provided");
  formspreeData.append("Industry", values.industry || "Not provided");
  formspreeData.append("Business Stage", values.stage);
  formspreeData.append("Services Needed", values.services.join(", "));
  formspreeData.append("Current Assets", values.assets.join(", ") || "None selected");
  formspreeData.append("Current Website / Social Link", values.currentLink || "Not provided");

  formspreeData.append("Company Status", values.companyRegistered || "Not provided");
  formspreeData.append("Documents Needed", values.registrationDocuments || "Not provided");

  formspreeData.append("Website Type", values.websiteType || "Not provided");
  formspreeData.append("Hosting / Domain", values.hostingStatus || "Not provided");

  formspreeData.append("Marketing Platforms", values.marketingPlatforms || "Not provided");
  formspreeData.append("Marketing Problem", values.marketingProblem || "Not provided");

  formspreeData.append("Customer Contact Method", values.customerContactMethod || "Not provided");
  formspreeData.append("Sales Follow-Up", values.salesFollowUp || "Not provided");

  formspreeData.append("Manual Tasks", values.manualTasks || "Not provided");
  formspreeData.append("Current Tools", values.currentTools || "Not provided");

  formspreeData.append("Operations Problem", values.operationsProblem || "Not provided");
  formspreeData.append("Process Documentation", values.processDocumentation || "Not provided");

  formspreeData.append("Timeline", values.timeline);
  formspreeData.append("Budget", values.budget);
  formspreeData.append("Urgency", values.urgency);
  formspreeData.append("Decision Maker", values.decisionMaker || "Not provided");

  formspreeData.append("Goal", values.goal);
  formspreeData.append("Extra Notes", values.extraNotes || "None");

  formspreeData.append("Recommended Service Path", recommendation.title);
  formspreeData.append("Recommendation", recommendation.text);
  formspreeData.append("Business Readiness Score", `${score}%`);
  formspreeData.append("Full Summary", summary);

  try {
    const response = await fetch("https://formspree.io/f/xvznjlqk", {
      method: "POST",
      body: formspreeData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    resultTitle.textContent = recommendation.title;
    resultText.textContent = recommendation.text;
    scoreText.textContent = `${score}%`;

    setTimeout(() => {
      scoreFill.style.width = `${score}%`;
    }, 150);

    form.classList.add("hidden");
    resultCard.classList.remove("hidden");

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    showAlert("Something went wrong. Please try again.");

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Business Checkup";
  }
});

restartBtn.addEventListener("click", () => {
  form.reset();
  currentStep = 0;

  form.classList.remove("hidden");
  resultCard.classList.add("hidden");

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Business Checkup";
  scoreFill.style.width = "0";

  updateStep();
});

updateStep();
