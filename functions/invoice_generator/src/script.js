// Currency symbols mapping
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
};

// Currency names for word conversion
const currencyNames = {
  USD: { singular: "dollar", plural: "dollars", cents: "cents" },
  EUR: { singular: "euro", plural: "euros", cents: "cents" },
  GBP: { singular: "pound", plural: "pounds", cents: "pence" },
  CAD: { singular: "dollar", plural: "dollars", cents: "cents" },
  AUD: { singular: "dollar", plural: "dollars", cents: "cents" },
  INR: { singular: "rupee", plural: "rupees", cents: "paise" },
};

// Number to words conversion arrays
const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const teens = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const thousands = ["", "thousand", "million", "billion", "trillion"];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Check for preview-only mode
  const previewOnly = localStorage.getItem("previewOnly") === "true";
  const savedData = localStorage.getItem("invoiceFormData");

  if (previewOnly && savedData) {
    // Load data and show invoice in preview-only mode
    initializePreviewOnlyMode();
  } else {
    // Normal initialization
    initializeInvoice();
    setupEventListeners();
  }
});

function initializePreviewOnlyMode() {
  try {
    const formData = JSON.parse(localStorage.getItem("invoiceFormData"));

    // Load the form data first (silently)
    loadFormDataSilently(formData);

    // Hide all non-invoice elements
    const elementsToHide = [
      ".header",
      ".form-section",
      ".preview-actions",
      ".footer",
    ];

    elementsToHide.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = "none";
      }
    });

    // Show only the invoice preview using existing functionality
    document.getElementById("invoicePreview").style.display = "block";

    // Use existing preview population function
    populatePreview();
    updateTotals();

    // Set page title for PDF
    document.title = `Invoice ${formData.invoiceNumber || "Preview"}`;
  } catch (error) {
    console.error("Error loading preview-only mode:", error);
    // Fallback to normal mode
    initializeInvoice();
    setupEventListeners();
  }
}

function loadFormDataSilently(formData) {
  // Fill in the form fields without showing success message
  document.getElementById("yourName").value = formData.yourName || "";
  document.getElementById("yourEmail").value = formData.yourEmail || "";
  document.getElementById("yourPhone").value = formData.yourPhone || "";
  document.getElementById("yourWebsite").value = formData.yourWebsite || "";
  document.getElementById("taxId").value = formData.taxId || "";
  document.getElementById("yourAddress").value = formData.yourAddress || "";
  document.getElementById("clientName").value = formData.clientName || "";
  document.getElementById("clientEmail").value = formData.clientEmail || "";
  document.getElementById("clientAddress").value = formData.clientAddress || "";
  document.getElementById("invoiceNumber").value = formData.invoiceNumber || "";
  document.getElementById("invoiceDate").value = formData.invoiceDate || "";
  document.getElementById("dueDate").value = formData.dueDate || "";
  document.getElementById("currency").value = formData.currency || "USD";
  document.getElementById("taxRate").value = formData.taxRate || "0";
  document.getElementById("discount").value = formData.discount || "0";
  document.getElementById("notes").value = formData.notes || "";

  // use default values for invoice number and dates if not provided
  if (!formData.invoiceNumber) {
    const invoiceNumber = "INV-" + Date.now().toString().slice(-6);
    document.getElementById("invoiceNumber").value = invoiceNumber;
  }
  if (!formData.invoiceDate) {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("invoiceDate").value = today;
  }
  if (!formData.dueDate) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById("dueDate").value = dueDate
      .toISOString()
      .split("T")[0];
  }

  // Load services data
  if (formData.services && formData.services.length > 0) {
    loadServicesData(formData.services);
  }

  // Update currency symbols
  updateCurrencySymbols();
}

function initializeInvoice() {
  // Set default values
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("invoiceDate").value = today;

  // Set due date to 30 days from today
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  document.getElementById("dueDate").value = dueDate
    .toISOString()
    .split("T")[0];

  // Generate invoice number
  const invoiceNumber = "INV-" + Date.now().toString().slice(-6);
  document.getElementById("invoiceNumber").value = invoiceNumber;

  // Update currency symbols
  updateCurrencySymbols();
}

function setupEventListeners() {
  // Add service button
  document.getElementById("addService").addEventListener("click", addService);

  // Preview and download buttons
  document
    .getElementById("previewInvoice")
    .addEventListener("click", previewInvoice);
  document.getElementById("downloadPDF").addEventListener("click", downloadPDF);
  document
    .getElementById("downloadPreviewPDF")
    .addEventListener("click", downloadPDF);
  document.getElementById("editInvoice").addEventListener("click", editInvoice);

  // New form utility buttons
  document
    .getElementById("generateInvoiceNumber")
    .addEventListener("click", generateRandomInvoiceNumber);
  document
    .getElementById("setDueDatePlus30")
    .addEventListener("click", setDueDatePlus30);
  document.getElementById("saveForm").addEventListener("click", saveFormData);
  document.getElementById("loadForm").addEventListener("click", loadFormData);

  // Currency change
  document
    .getElementById("currency")
    .addEventListener("change", updateCurrencySymbols);

  // Tax and discount inputs
  document.getElementById("taxRate").addEventListener("input", updateTotals);
  document.getElementById("discount").addEventListener("input", updateTotals);

  // Service calculations
  document.addEventListener("input", function (e) {
    if (
      e.target.classList.contains("service-quantity") ||
      e.target.classList.contains("service-rate")
    ) {
      updateServiceAmount(e.target);
      updateTotals();
    }
  });

  // Remove service buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-service")) {
      removeService(e.target);
    }
  });
}

function addService() {
  const container = document.getElementById("servicesContainer");
  const serviceCount = container.querySelectorAll(".service-item").length + 1;
  const serviceItem = document.createElement("div");
  serviceItem.className = "service-item";

  serviceItem.innerHTML = `
        <div class="row">
            <div class="col-3">
                <label>Description *</label>
                <input type="text" 
                       class="service-description" 
                       name="service-description-${serviceCount}"
                       autocomplete="off"
                       placeholder="Consulting services" 
                       required
                       list="service-suggestions">
            </div>
            <div class="col-1">
                <label>Quantity *</label>
                <input type="number" 
                       class="service-quantity" 
                       name="service-quantity-${serviceCount}"
                       autocomplete="off"
                       value="1" 
                       min="0" 
                       step="0.1" 
                       placeholder="1"
                       required>
            </div>
            <div class="col-1">
                <label>Rate *</label>
                <input type="number" 
                       class="service-rate" 
                       name="service-rate-${serviceCount}"
                       autocomplete="off"
                       min="0" 
                       step="0.01" 
                       placeholder="100.00" 
                       required>
            </div>
            <div class="col-1">
                <label>Amount</label>
                <input type="number" 
                       class="service-amount" 
                       name="service-amount-${serviceCount}"
                       autocomplete="off"
                       readonly 
                       tabindex="-1">
            </div>
            <div class="col-remove">
                <button type="button" 
                        class="remove-service" 
                        aria-label="Remove this service">❌</button>
            </div>
        </div>
    `;

  container.appendChild(serviceItem);
  updateRemoveButtons();

  // Add event listeners for new service
  const quantityInput = serviceItem.querySelector(".service-quantity");
  const rateInput = serviceItem.querySelector(".service-rate");

  quantityInput.addEventListener("input", function () {
    updateServiceAmount(this);
    updateTotals();
  });

  rateInput.addEventListener("input", function () {
    updateServiceAmount(this);
    updateTotals();
  });
}

function removeService(button) {
  const serviceItem = button.closest(".service-item");
  serviceItem.remove();
  updateRemoveButtons();
  updateTotals();
}

function updateRemoveButtons() {
  const services = document.querySelectorAll(".service-item");
  services.forEach((service, index) => {
    const removeButton = service.querySelector(".remove-service");
    if (services.length > 1) {
      removeButton.style.display = "block";
    } else {
      removeButton.style.display = "none";
    }
  });
}

function updateServiceAmount(input) {
  const serviceItem = input.closest(".service-item");
  const quantity =
    parseFloat(serviceItem.querySelector(".service-quantity").value) || 0;
  const rate =
    parseFloat(serviceItem.querySelector(".service-rate").value) || 0;
  const amount = quantity * rate;

  serviceItem.querySelector(".service-amount").value = amount.toFixed(2);
}

function updateTotals() {
  const services = document.querySelectorAll(".service-item");
  let subtotal = 0;

  services.forEach((service) => {
    const amount =
      parseFloat(service.querySelector(".service-amount").value) || 0;
    subtotal += amount;
  });

  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;

  const discountedSubtotal = subtotal - discount;
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + taxAmount;

  // Update preview if visible
  if (document.getElementById("invoicePreview").style.display !== "none") {
    document.getElementById("previewSubtotal").textContent =
      subtotal.toFixed(2);
    document.getElementById("previewDiscount").textContent =
      discount.toFixed(2);
    document.getElementById("previewTaxAmount").textContent =
      taxAmount.toFixed(2);
    document.getElementById("previewTaxRate").textContent = taxRate.toFixed(1);
    document.getElementById("previewTotal").textContent = total.toFixed(2);

    // Update total in words
    const currency = document.getElementById("currency").value;
    const totalInWords = convertAmountToWords(total, currency);
    document.getElementById("totalInWords").textContent = totalInWords;

    // Show/hide discount and tax rows
    document.getElementById("discountRow").style.display =
      discount > 0 ? "flex" : "none";
    document.getElementById("taxRow").style.display =
      taxRate > 0 ? "flex" : "none";
  }
}

// Convert number to words
function convertNumberToWords(num) {
  if (num === 0) return "zero";

  function convertHundreds(n) {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " hundred";
      n %= 100;
      if (n > 0) result += " ";
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += "-" + ones[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += ones[n];
    }

    return result;
  }

  if (num < 1000) {
    return convertHundreds(num);
  }

  let result = "";
  let thousandIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (thousandIndex > 0) {
        result =
          chunkWords +
          " " +
          thousands[thousandIndex] +
          (result ? " " + result : "");
      } else {
        result = chunkWords;
      }
    }
    num = Math.floor(num / 1000);
    thousandIndex++;
  }

  return result;
}

// Convert amount to words with currency
function convertAmountToWords(amount, currencyCode) {
  const currency = currencyNames[currencyCode];
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);

  let result = "";

  if (dollars === 0) {
    result = "zero " + currency.plural;
  } else if (dollars === 1) {
    result = "one " + currency.singular;
  } else {
    result = convertNumberToWords(dollars) + " " + currency.plural;
  }

  if (cents > 0) {
    if (cents === 1) {
      result += " and one cent";
    } else {
      result += " and " + convertNumberToWords(cents) + " " + currency.cents;
    }
  } else {
    result += " only";
  }

  return result;
}

function updateCurrencySymbols() {
  const currency = document.getElementById("currency").value;
  document.body.setAttribute("data-currency", currency);
}

function previewInvoice() {
  if (!validateForm()) {
    alert("Please fill in all required fields.");
    return;
  }

  // Hide form and show preview
  document.querySelector(".form-section").style.display = "none";
  document.getElementById("invoicePreview").style.display = "block";

  // Populate preview data
  populatePreview();

  // Calculate totals
  updateTotals();

  // Scroll to top
  window.scrollTo(0, 0);
}

function editInvoice() {
  // Show form and hide preview
  document.querySelector(".form-section").style.display = "block";
  document.getElementById("invoicePreview").style.display = "none";

  // Scroll to top
  window.scrollTo(0, 0);
}

function validateForm() {
  const requiredFields = [
    "yourName",
    "yourEmail",
    "clientName",
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.focus();
      return false;
    }
  }

  // Check if at least one service has description and rate
  const services = document.querySelectorAll(".service-item");
  let hasValidService = false;

  for (const service of services) {
    const description = service
      .querySelector(".service-description")
      .value.trim();
    const rate = parseFloat(service.querySelector(".service-rate").value) || 0;

    if (description && rate > 0) {
      hasValidService = true;
      break;
    }
  }

  if (!hasValidService) {
    alert("Please add at least one service with description and rate.");
    return false;
  }

  return true;
}

function populatePreview() {
  const currency = document.getElementById("currency").value;

  // Basic information
  document.getElementById("previewInvoiceNumber").textContent =
    document.getElementById("invoiceNumber").value;
  document.getElementById("previewYourName").textContent =
    document.getElementById("yourName").value;
  document.getElementById("previewYourEmail").textContent =
    document.getElementById("yourEmail").value;
  document.getElementById("previewYourPhone").textContent =
    document.getElementById("yourPhone").value;

  const website = document.getElementById("yourWebsite").value;
  const websiteElement = document.getElementById("previewYourWebsite");
  if (website) {
    websiteElement.textContent = website;
    websiteElement.style.display = "block";
  } else {
    websiteElement.style.display = "none";
  }

  const taxId = document.getElementById("taxId").value;
  const taxIdElement = document.getElementById("previewTaxId");
  if (taxId) {
    taxIdElement.textContent = "Tax ID: " + taxId;
    taxIdElement.style.display = "block";
  } else {
    taxIdElement.style.display = "none";
  }

  document.getElementById("previewYourAddress").innerHTML = document
    .getElementById("yourAddress")
    .value.replace(/\n/g, "<br>");

  // Client information
  document.getElementById("previewClientName").textContent =
    document.getElementById("clientName").value;

  const clientEmail = document.getElementById("clientEmail").value;
  const clientEmailElement = document.getElementById("previewClientEmail");
  if (clientEmail) {
    clientEmailElement.textContent = clientEmail;
    clientEmailElement.style.display = "block";
  } else {
    clientEmailElement.style.display = "none";
  }

  document.getElementById("previewClientAddress").innerHTML = document
    .getElementById("clientAddress")
    .value.replace(/\n/g, "<br>");

  // Dates
  document.getElementById("previewInvoiceDate").textContent = formatDate(
    document.getElementById("invoiceDate").value
  );
  document.getElementById("previewDueDate").textContent = formatDate(
    document.getElementById("dueDate").value
  );

  // Services
  const servicesContainer = document.getElementById("previewServices");
  servicesContainer.innerHTML = "";

  const services = document.querySelectorAll(".service-item");
  services.forEach((service) => {
    const description = service.querySelector(".service-description").value;
    const quantity = service.querySelector(".service-quantity").value;
    const rate = parseFloat(service.querySelector(".service-rate").value) || 0;
    const amount =
      parseFloat(service.querySelector(".service-amount").value) || 0;

    if (description && rate > 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${description}</td>
                <td>${quantity}</td>
                <td><span class="currency-symbol"></span>${rate.toFixed(2)}</td>
                <td><span class="currency-symbol"></span>${amount.toFixed(
                  2
                )}</td>
            `;
      servicesContainer.appendChild(row);
    }
  });

  // Notes
  const notes = document.getElementById("notes").value.trim();
  const notesSection = document.getElementById("previewNotesSection");
  if (notes) {
    document.getElementById("previewNotes").innerHTML = notes.replace(
      /\n/g,
      "<br>"
    );
    notesSection.style.display = "block";
  } else {
    notesSection.style.display = "none";
  }

  // Update currency
  updateCurrencySymbols();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function downloadPDF() {
  // Show the invoice preview if it's not already visible
  const wasPreviewVisible =
    document.getElementById("invoicePreview").style.display !== "none";

  if (!wasPreviewVisible) {
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }
    previewInvoice();
  }

  // Add A4 page setup class to body for better print formatting
  document.body.classList.add("print-mode");

  // Ensure the invoice preview is properly visible for printing
  const invoicePreview = document.getElementById("invoicePreview");
  invoicePreview.style.display = "block";

  // Small delay to ensure styles are applied
  setTimeout(() => {
    // Use the browser's print functionality to save as PDF
    window.print();

    // Remove print mode class after printing
    document.body.classList.remove("print-mode");
  }, 100);

  // If preview wasn't visible before, ask if user wants to keep it open
  if (!wasPreviewVisible) {
    setTimeout(() => {
      if (confirm("Would you like to keep the invoice preview open?")) {
        return;
      } else {
        editInvoice();
      }
    }, 2000);
  }
}

// Alternative PDF generation using a library (if needed)
function downloadPDFAdvanced() {
  // This would require including a PDF library like jsPDF or Puppeteer
  // For now, we'll use the browser's print functionality
  downloadPDF();
}

// Generate a random invoice number
function generateRandomInvoiceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const invoiceNumber = `INV-${timestamp}-${random}`;

  document.getElementById("invoiceNumber").value = invoiceNumber;

  // Add a small animation to show it changed
  const input = document.getElementById("invoiceNumber");
  input.style.backgroundColor = "#e7f3ff";
  setTimeout(() => {
    input.style.backgroundColor = "";
  }, 500);
}

// Set due date to 30 days from invoice date
function setDueDatePlus30() {
  const invoiceDateInput = document.getElementById("invoiceDate");
  const dueDateInput = document.getElementById("dueDate");

  if (!invoiceDateInput.value) {
    alert("Please set the invoice date first.");
    invoiceDateInput.focus();
    return;
  }

  const invoiceDate = new Date(invoiceDateInput.value);
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);

  dueDateInput.value = dueDate.toISOString().split("T")[0];

  // Add a small animation to show it changed
  dueDateInput.style.backgroundColor = "#e7f3ff";
  setTimeout(() => {
    dueDateInput.style.backgroundColor = "";
  }, 500);
}

// Save form data to localStorage
function saveFormData() {
  const formData = {
    yourName: document.getElementById("yourName").value,
    yourEmail: document.getElementById("yourEmail").value,
    yourPhone: document.getElementById("yourPhone").value,
    yourWebsite: document.getElementById("yourWebsite").value,
    taxId: document.getElementById("taxId").value,
    yourAddress: document.getElementById("yourAddress").value,
    clientName: document.getElementById("clientName").value,
    clientEmail: document.getElementById("clientEmail").value,
    clientAddress: document.getElementById("clientAddress").value,
    invoiceNumber: document.getElementById("invoiceNumber").value,
    invoiceDate: document.getElementById("invoiceDate").value,
    dueDate: document.getElementById("dueDate").value,
    currency: document.getElementById("currency").value,
    taxRate: document.getElementById("taxRate").value,
    discount: document.getElementById("discount").value,
    notes: document.getElementById("notes").value,
    services: getServicesData(),
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem("invoiceFormData", JSON.stringify(formData));

    // Show success message
    const button = document.getElementById("saveForm");
    const originalText = button.textContent;
    button.textContent = "✅ Saved!";
    button.style.backgroundColor = "#28a745";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    alert("Failed to save form data. Please try again.");
    console.error("Save error:", error);
  }
}

// Load form data from localStorage
function loadFormData() {
  try {
    const savedData = localStorage.getItem("invoiceFormData");

    if (!savedData) {
      alert("No saved form data found.");
      return;
    }

    const formData = JSON.parse(savedData);

    // Fill in the form fields
    document.getElementById("yourName").value = formData.yourName || "";
    document.getElementById("yourEmail").value = formData.yourEmail || "";
    document.getElementById("yourPhone").value = formData.yourPhone || "";
    document.getElementById("yourWebsite").value = formData.yourWebsite || "";
    document.getElementById("taxId").value = formData.taxId || "";
    document.getElementById("yourAddress").value = formData.yourAddress || "";
    document.getElementById("clientName").value = formData.clientName || "";
    document.getElementById("clientEmail").value = formData.clientEmail || "";
    document.getElementById("clientAddress").value =
      formData.clientAddress || "";
    document.getElementById("invoiceNumber").value =
      formData.invoiceNumber || "";
    document.getElementById("invoiceDate").value = formData.invoiceDate || "";
    document.getElementById("dueDate").value = formData.dueDate || "";
    document.getElementById("currency").value = formData.currency || "USD";
    document.getElementById("taxRate").value = formData.taxRate || "0";
    document.getElementById("discount").value = formData.discount || "0";
    document.getElementById("notes").value = formData.notes || "";

    // Load services data
    if (formData.services && formData.services.length > 0) {
      loadServicesData(formData.services);
    }

    // Update currency symbols and totals
    updateCurrencySymbols();
    updateTotals();

    // Show success message
    const button = document.getElementById("loadForm");
    const originalText = button.textContent;
    button.textContent = "✅ Loaded!";
    button.style.backgroundColor = "#28a745";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    alert("Failed to load form data. The saved data might be corrupted.");
    console.error("Load error:", error);
  }
}

// Utility function to enable preview-only mode (can be called externally)
function enablePreviewOnlyMode(invoiceData) {
  if (invoiceData) {
    localStorage.setItem("invoiceFormData", JSON.stringify(invoiceData));
  }
  localStorage.setItem("previewOnly", "true");

  // Reload the page to apply preview-only mode
  window.location.reload();
}

// Utility function to disable preview-only mode
function disablePreviewOnlyMode() {
  localStorage.removeItem("previewOnly");
  window.location.reload();
}

// Helper function to get services data
function getServicesData() {
  const services = [];
  const serviceItems = document.querySelectorAll(".service-item");

  serviceItems.forEach((item) => {
    const description = item.querySelector(".service-description").value;
    const quantity = item.querySelector(".service-quantity").value;
    const rate = item.querySelector(".service-rate").value;

    if (description || quantity || rate) {
      services.push({
        description: description,
        quantity: quantity,
        rate: rate,
      });
    }
  });

  return services;
}

// Helper function to load services data
function loadServicesData(services) {
  // Clear existing services except the first one
  const container = document.getElementById("servicesContainer");
  const serviceItems = container.querySelectorAll(".service-item");

  // Remove all but the first service item
  for (let i = 1; i < serviceItems.length; i++) {
    serviceItems[i].remove();
  }

  // Load the services data
  services.forEach((service, index) => {
    let serviceItem;

    if (index === 0) {
      // Use the first existing service item
      serviceItem = container.querySelector(".service-item");
    } else {
      // Add new service items
      addService();
      serviceItem = container.lastElementChild;
    }

    // Fill in the data
    serviceItem.querySelector(".service-description").value =
      service.description || "";
    serviceItem.querySelector(".service-quantity").value =
      service.quantity || "1";
    serviceItem.querySelector(".service-rate").value = service.rate || "";

    // Update the amount
    updateServiceAmount(serviceItem.querySelector(".service-quantity"));
  });

  updateRemoveButtons();
}
