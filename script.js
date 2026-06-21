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

const whatsappLink = document.getElementById("whatsappLink");
const emailLink = document.getElementById("emailLink");
const copyBtn = document.getElementById("copyBtn");
const restartBtn = document.getElementById("restartBtn");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const conditionalPanels = document.querySelectorAll(".conditional-panel");
const conditionalEmpty = document.getElementById("conditionalEmpty");

let currentStep = 0;
let finalSummary = "";

document.getElementById("year").textContent = `© ${new Date().getFullYear()} Mere Simplicity`;

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

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

  document.querySelector(".form-shell").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
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

    if (shouldShow) {
      visibleCount++;
    }
  });

  if (conditionalEmpty) {
    conditionalEmpty.classList.toggle("hidden", visibleCount > 0);
  }
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
      text: "Your business needs a connected growth system. The best path is to combine online presence, marketing, sales flow, automation, and operational structure so everything works together instead of separately."
    };
  }

  if (
    stage === "Idea stage" ||
    stage === "Started but not registered" ||
    services.includes("Business Registration")
  ) {
    return {
      title: "Business Foundation Setup",
      text: "Your first priority is structure. You need registration support, proper business documentation, compliance guidance, and a professional digital presence that makes your business look serious."
    };
  }

  if (
    services.includes("Website Services") ||
    stage === "Registered but weak online presence"
  ) {
    return {
      title: "Website & Visibility System",
      text: "Your business needs a stronger online presence. The best path is a clean website, mobile-first design, SEO setup, business contact structure, and better visibility for customers searching online."
    };
  }

  if (
    services.includes("Sales Systems") ||
    services.includes("Marketing")
  ) {
    return {
      title: "Sales & Marketing Growth System",
      text: "Your business needs a clear way to attract attention, capture leads, follow up, and convert people into paying customers. The best path is strategy, content, lead generation, and a simple sales system."
    };
  }

  if (
    services.includes("Automation and Support") ||
    services.includes("Industrial Engineering")
  ) {
    return {
      title: "Operations & Automation System",
      text: "Your business needs better flow. The best path is to reduce manual work, standardize processes, improve workflow, and create systems that make daily operations smoother."
    };
  }

  return {
    title: "Business Growth Consultation",
    text: "Your business needs a custom review. The best path is to first understand your current position, then build the right setup around your goals, budget, and urgency."
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
Hello Mere Simplicity.

My name is ${values.fullName}.

Business Name:
${values.businessName || "Not provided"}

Contact:
WhatsApp: ${values.phone}
Email: ${values.email || "Not provided"}
Location: ${values.location || "Not provided"}
Industry: ${values.industry || "Not provided"}

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const values = getFormValues();
  const recommendation = createRecommendation(values);
  const score = calculateScore(values);

  finalSummary = buildSummary(values, recommendation, score);

  resultTitle.textContent = recommendation.title;
  resultText.textContent = recommendation.text;

  scoreText.textContent = `${score}%`;

  setTimeout(() => {
    scoreFill.style.width = `${score}%`;
  }, 150);

  const encodedSummary = encodeURIComponent(finalSummary);

  whatsappLink.href = `https://wa.me/27679937070?text=${encodedSummary}`;
  emailLink.href = `mailto:vision.teamcode@gmail.com?subject=Mere Simplicity Business Checkup&body=${encodedSummary}`;

  form.classList.add("hidden");
  resultCard.classList.remove("hidden");

  resultCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(finalSummary);
    copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
  } catch {
    copyBtn.textContent = "Copy failed";
  }

  setTimeout(() => {
    copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Summary`;
  }, 1800);
});

restartBtn.addEventListener("click", () => {
  form.reset();
  currentStep = 0;
  form.classList.remove("hidden");
  resultCard.classList.add("hidden");
  scoreFill.style.width = "0";
  updateStep();

  document.getElementById("checkup").scrollIntoView({
    behavior: "smooth"
  });
});

updateStep();
