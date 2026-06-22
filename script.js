const form = document.getElementById("businessForm");
const steps = document.querySelectorAll(".wizard-step");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

const stepLabel = document.getElementById("stepLabel");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");

const conditionalPanels = document.querySelectorAll(".conditional-panel");
const conditionalEmpty = document.getElementById("conditionalEmpty");

const recommendedServiceField = document.getElementById("recommendedService");
const businessScoreField = document.getElementById("businessScore");
const fullSummaryField = document.getElementById("fullSummary");

const successCard = document.getElementById("successCard");
const resetBtn = document.getElementById("resetBtn");

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
  const selectedPanels = Array.from(document.querySelectorAll('input[name="services_needed"]:checked'))
    .map(input => input.dataset.panel);

  let visibleCount = 0;

  conditionalPanels.forEach(panel => {
    const shouldShow = selectedPanels.includes(panel.dataset.panel);
    panel.classList.toggle("show", shouldShow);

    if (shouldShow) visibleCount++;
  });

  conditionalEmpty.classList.toggle("hidden", visibleCount > 0);
}

document.querySelectorAll('input[name="services_needed"]').forEach(input => {
  input.addEventListener("change", updateConditionalPanels);
});

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(input => input.value);
}

function getValue(name) {
  const field = document.querySelector(`[name="${name}"]`);
  return field ? field.value.trim() : "";
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function collectFormData() {
  return {
    fullName: getValue("full_name"),
    businessName: getValue("business_name"),
    whatsapp: getValue("whatsapp_number"),
    email: getValue("email"),
    location: getValue("location"),
    industry: getValue("industry"),
    stage: getRadioValue("business_stage"),
    services: getCheckedValues("services_needed"),
    assets: getCheckedValues("current_assets"),
    currentLink: getValue("current_website_or_social_link"),

    companyStatus: getValue("company_registered_status"),
    registrationDocs: getValue("registration_documents_needed"),

    websiteType: getValue("website_type_needed"),
    hostingStatus: getValue("hosting_domain_status"),

    marketingPlatforms: getValue("marketing_platforms"),
    marketingProblem: getValue("marketing_problem"),

    customerContact: getValue("customer_contact_method"),
    salesFollowUp: getValue("sales_follow_up_process"),

    manualTasks: getValue("manual_tasks"),
    currentTools: getValue("current_tools"),

    operationsProblem: getValue("operations_problem"),
    processDocumentation: getValue("process_documentation_status"),

    timeline: getValue("timeline"),
    budget: getValue("budget_range"),
    urgency: getValue("urgency"),
    decisionMaker: getValue("decision_maker"),

    message: getValue("message"),
    extraNotes: getValue("extra_notes")
  };
}

function createRecommendation(data) {
  const services = data.services;
  const stage = data.stage;

  if (
    services.length >= 4 ||
    (
      services.includes("Website Services") &&
      services.includes("Sales Systems") &&
      services.includes("Marketing")
    )
  ) {
    return "Full Business Growth System";
  }

  if (
    stage === "Idea stage" ||
    stage === "Started but not registered" ||
    services.includes("Business Registration")
  ) {
    return "Business Foundation Setup";
  }

  if (
    services.includes("Website Services") ||
    stage === "Registered but weak online presence"
  ) {
    return "Website & Visibility System";
  }

  if (
    services.includes("Sales Systems") ||
    services.includes("Marketing")
  ) {
    return "Sales & Marketing Growth System";
  }

  if (
    services.includes("Automation and Support") ||
    services.includes("Industrial Engineering")
  ) {
    return "Operations & Automation System";
  }

  return "Business Growth Consultation";
}

function calculateScore(data) {
  let score = 20;

  score += data.assets.length * 5;
  score += data.services.length * 4;

  if (data.stage === "Registered but weak online presence") score += 12;
  if (data.stage === "Operating but need better systems") score += 18;
  if (data.email) score += 5;
  if (data.currentLink) score += 5;
  if (data.timeline === "Immediately") score += 8;
  if (data.urgency === "Very urgent") score += 8;

  return Math.min(score, 96);
}

function buildSummary(data, recommendation, score) {
  return `
New Mere Simplicity Business Checkup

Full Name:
${data.fullName}

Business Name:
${data.businessName || "Not provided"}

WhatsApp:
${data.whatsapp}

Email:
${data.email || "Not provided"}

Location:
${data.location || "Not provided"}

Industry:
${data.industry || "Not provided"}

Business Stage:
${data.stage}

Services Needed:
${data.services.length ? data.services.join(", ") : "Not selected"}

Current Business Assets:
${data.assets.length ? data.assets.join(", ") : "None selected"}

Current Website / Social Link:
${data.currentLink || "Not provided"}

Registration Details:
Company Status: ${data.companyStatus || "Not provided"}
Documents Needed: ${data.registrationDocs || "Not provided"}

Website Details:
Website Type: ${data.websiteType || "Not provided"}
Hosting / Domain: ${data.hostingStatus || "Not provided"}

Marketing Details:
Platforms: ${data.marketingPlatforms || "Not provided"}
Marketing Problem: ${data.marketingProblem || "Not provided"}

Sales Details:
Customer Contact Method: ${data.customerContact || "Not provided"}
Sales Follow-Up: ${data.salesFollowUp || "Not provided"}

Automation Details:
Manual Tasks: ${data.manualTasks || "Not provided"}
Current Tools: ${data.currentTools || "Not provided"}

Operations Details:
Operations Problem: ${data.operationsProblem || "Not provided"}
Process Documentation: ${data.processDocumentation || "Not provided"}

Timeline:
${data.timeline}

Budget:
${data.budget}

Urgency:
${data.urgency}

Decision Maker:
${data.decisionMaker || "Not provided"}

Main Goal:
${data.message}

Extra Notes:
${data.extraNotes || "None"}

Recommended Service:
${recommendation}

Business Readiness Score:
${score}%
`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  const data = collectFormData();
  const recommendation = createRecommendation(data);
  const score = calculateScore(data);
  const summary = buildSummary(data, recommendation, score);

  recommendedServiceField.value = recommendation;
  businessScoreField.value = `${score}%`;
  fullSummaryField.value = summary;

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const formData = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/xvznjlqk", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    form.classList.add("hidden");
    successCard.classList.remove("hidden");

    document.querySelector(".form-card").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    showAlert("Something went wrong. Please try again or contact us on WhatsApp.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Business Checkup";
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();

  currentStep = 0;

  form.classList.remove("hidden");
  successCard.classList.add("hidden");

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Business Checkup";

  recommendedServiceField.value = "";
  businessScoreField.value = "";
  fullSummaryField.value = "";

  updateStep();
});

updateStep();
