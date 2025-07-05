# Invoice Generator

A professional invoice generator web application built with Appwrite Functions. Create, preview, and download professional invoices for consulting services with support for multiple currencies, tax calculations, and PDF generation.

## ✨ Features

- **Professional Invoice Creation**: Generate clean, professional invoices
- **Multi-Currency Support**: USD, EUR, GBP, CAD, AUD, and INR (₹)
- **Dynamic Services**: Add multiple services with quantity and rate calculations
- **Tax & Discount Calculations**: Automatic tax percentage and discount calculations
- **Number-to-Words Conversion**: Convert totals to written format in multiple currencies
- **Form Data Persistence**: Save and load form data using browser localStorage
- **PDF Generation**: Download invoices as PDF (print-friendly)
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-fill Features**: Generate invoice numbers and set due dates automatically

## 🧰 API Usage

### GET /

**Main Invoice Generator Interface**

Returns the complete invoice generator web application.

**Response**: HTML page with the invoice generator form and preview.

#### Preview-Only Mode

For automated PDF generation with Puppeteer, you can use the preview-only mode:

1. **Save invoice data** to localStorage with key `invoiceFormData`
2. **Set preview flag** in localStorage: `localStorage.setItem("previewOnly", "true")`
3. **Reload the page** to show only the invoice preview without form elements

**Example JavaScript:**

```javascript
// Save your invoice data
const invoiceData = {
  yourName: "John Doe",
  yourEmail: "john@example.com",
  clientName: "Client Company",
  // ... other invoice fields
};
localStorage.setItem("invoiceFormData", JSON.stringify(invoiceData));

// Enable preview-only mode
localStorage.setItem("previewOnly", "true");

// Reload page to show clean invoice
window.location.reload();
```

---

### GET /ping

**Health Check**

Returns a simple "Pong" message to verify the function is running.

**Response**

Sample `200` Response:

```text
Pong
```

---

### POST /api/generate-invoice

**Generate Invoice Data**

Process invoice form data and return calculated totals.

**Request Body**

```json
{
  "yourName": "John Doe",
  "yourEmail": "john@example.com",
  "clientName": "Client Company",
  "invoiceNumber": "INV-001",
  "invoiceDate": "2025-06-30",
  "dueDate": "2025-07-30",
  "currency": "USD",
  "services": [
    {
      "description": "Consulting Services",
      "quantity": "1",
      "rate": "100.00"
    }
  ],
  "taxRate": "8.25",
  "discount": "0"
}
```

**Response**

Sample `200` Response:

```json
{
  "success": true,
  "invoice": {
    "yourName": "John Doe",
    "yourEmail": "john@example.com",
    "clientName": "Client Company",
    "invoiceNumber": "INV-001",
    "subtotal": 100.0,
    "discount": 0.0,
    "taxRate": 8.25,
    "taxAmount": 8.25,
    "total": 108.25,
    "generatedAt": "2025-06-30T12:00:00.000Z"
  }
}
```

---

### POST /api/generate-pdf

**Generate Invoice PDF**

Generate and download a PDF version of the invoice.

**Request Body**: Same as `/api/generate-invoice`

**Response**: PDF file download with appropriate headers.

---

### Static Assets

- **GET /favicon.png** - Favicon image
- **GET /ogp_image.png** - Open Graph preview image
- **GET /index.css** - Application stylesheet
- **GET /script.js** - Application JavaScript

## 🤖 Puppeteer Integration

The invoice generator is designed to work seamlessly with Puppeteer for automated PDF generation. The preview-only mode provides a clean invoice layout perfect for PDF capture.

### Setup Puppeteer PDF Generation

**1. Install Puppeteer**

```bash
npm install puppeteer
# or
yarn add puppeteer
```

**2. Basic PDF Generation Script**

```javascript
const puppeteer = require("puppeteer");

async function generateInvoicePDF(invoiceData, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to your invoice generator
  await page.goto("https://your-function-url.appwrite.io/");

  // Set invoice data and enable preview-only mode
  await page.evaluate((data) => {
    localStorage.setItem("invoiceFormData", JSON.stringify(data));
    localStorage.setItem("previewOnly", "true");
  }, invoiceData);

  // Reload to show preview-only mode
  await page.reload({ waitUntil: "networkidle0" });

  // Generate PDF with optimized settings
  await page.pdf({
    path: outputPath,
    format: "A4",
    margin: {
      top: "10mm",
      right: "10mm",
      bottom: "10mm",
      left: "10mm",
    },
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
}

// Usage example
const invoiceData = {
  yourName: "John Smith",
  yourEmail: "john.smith@freelancer.com",
  yourPhone: "+1-555-0123",
  yourWebsite: "https://johnsmith.dev",
  taxId: "TAX123456",
  yourAddress: "123 Business St\nSuite 100\nNew York, NY 10001\nUSA",
  clientName: "Acme Corporation",
  clientEmail: "billing@acme.com",
  clientAddress: "456 Client Ave\nClient City\nCA 90210\nUSA",
  invoiceNumber: "INV-2025-001",
  invoiceDate: "2025-06-30",
  dueDate: "2025-07-30",
  currency: "USD",
  taxRate: "8.25",
  discount: "0",
  notes:
    "Payment Terms: Net 30\nBank Details: Wire transfer available upon request",
  services: [
    {
      description: "Web Development Services",
      quantity: "40",
      rate: "125.00",
    },
    {
      description: "UI/UX Design",
      quantity: "20",
      rate: "150.00",
    },
  ],
};

generateInvoicePDF(invoiceData, "invoice.pdf");
```

**3. Advanced PDF Configuration**

```javascript
// For better print quality and layout
const pdfOptions = {
  format: "A4",
  margin: {
    top: "10mm",
    right: "10mm",
    bottom: "10mm",
    left: "10mm",
  },
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
  scale: 1.0,
  width: "210mm",
  height: "297mm",
};

await page.pdf(pdfOptions);
```

### Docker Setup for Puppeteer

**Dockerfile Example**

```dockerfile
FROM node:18-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "generate-pdf.js"]
```

### Batch PDF Generation

**Generate Multiple Invoices**

```javascript
async function generateBatchPDFs(invoicesData) {
  const browser = await puppeteer.launch();

  for (const [index, invoiceData] of invoicesData.entries()) {
    const page = await browser.newPage();

    await page.goto("https://your-function-url.appwrite.io/");

    await page.evaluate((data) => {
      localStorage.setItem("invoiceFormData", JSON.stringify(data));
      localStorage.setItem("previewOnly", "true");
    }, invoiceData);

    await page.reload({ waitUntil: "networkidle0" });

    await page.pdf({
      path: `invoice-${invoiceData.invoiceNumber}.pdf`,
      format: "A4",
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      printBackground: true,
    });

    await page.close();
  }

  await browser.close();
}
```

### Key Benefits

- **Clean Layout**: Preview-only mode hides all form elements and navigation
- **Print Optimized**: CSS designed specifically for PDF generation
- **No Clipping**: Content flows properly across multiple pages if needed
- **Consistent Styling**: Same layout as web preview
- **A4 Optimized**: Perfect margins and formatting for standard paper size

## 💰 Supported Currencies

| Currency          | Symbol | Code | Word Format   |
| ----------------- | ------ | ---- | ------------- |
| US Dollar         | $      | USD  | dollars/cents |
| Euro              | €      | EUR  | euros/cents   |
| British Pound     | £      | GBP  | pounds/pence  |
| Canadian Dollar   | C$     | CAD  | dollars/cents |
| Australian Dollar | A$     | AUD  | dollars/cents |
| Indian Rupee      | ₹      | INR  | rupees/paise  |

## 🎯 Form Features

### Auto-Generation

- **Invoice Numbers**: Generate random invoice numbers with timestamp
- **Due Dates**: Automatically set due date to 30 days from invoice date
- **Current Date**: Auto-fill invoice date with today's date

### Data Persistence

- **Save Form Data**: Store all form data in browser localStorage
- **Load Saved Data**: Retrieve and populate previously saved form data (no confirmation dialog)
- **Timestamp Tracking**: Track when data was saved
- **Preview-Only Mode**: Special mode for Puppeteer PDF generation that hides form elements

### localStorage Keys

| Key               | Purpose                                    | Type   |
| ----------------- | ------------------------------------------ | ------ |
| `invoiceFormData` | Stores complete form data                  | JSON   |
| `previewOnly`     | Enables clean preview mode (set to "true") | String |

**Utility Functions Available:**

```javascript
// Enable preview-only mode programmatically
function enablePreviewOnlyMode(invoiceData) {
  if (invoiceData) {
    localStorage.setItem("invoiceFormData", JSON.stringify(invoiceData));
  }
  localStorage.setItem("previewOnly", "true");
  window.location.reload();
}

// Disable preview-only mode
function disablePreviewOnlyMode() {
  localStorage.removeItem("previewOnly");
  window.location.reload();
}
```

### Validation

- **Required Fields**: Client name, your name, email, invoice details
- **Service Validation**: At least one service with description and rate
- **Email Format**: Proper email validation
- **Number Formats**: Proper validation for rates, quantities, taxes

## 📱 User Interface

### Form Sections

1. **Your Information**: Name, email, phone, website, tax ID, address
2. **Client Information**: Client name, email, address
3. **Invoice Details**: Invoice number, dates, currency selection
4. **Services**: Dynamic service items with description, quantity, rate
5. **Additional Info**: Tax rate, discount, notes

### Invoice Preview

- **Professional Layout**: Clean, business-ready invoice design
- **Print Optimized**: CSS print styles for PDF generation and browser printing
- **Real-time Calculations**: Live updates of totals and taxes
- **Amount in Words**: Written format of total amount
- **No Clipping**: Content flows across multiple pages for long invoices
- **Preview-Only Mode**: Clean mode for automated PDF generation (hides form elements)

### Print Features

- **A4 Optimized**: Perfect formatting for standard paper size
- **Proper Margins**: 10mm margins for professional appearance
- **Consultant Info Right-Aligned**: Professional header layout
- **Page Breaks**: Smart page breaking for multi-page invoices
- **Background Colors**: Preserved in print output

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Bun (1.0)     |
| Entrypoint        | `src/main.ts` |
| Build Commands    | `bun install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |

## 🔒 Environment Variables

No environment variables required. The application is fully self-contained.

## 🚀 Deployment

1. Deploy to Appwrite Functions
2. Access the web interface at your function URL
3. Start creating professional invoices immediately

## � File Structure

```
src/
├── main.ts          # Main function entry point and API routes
├── index.html       # Invoice generator web interface
├── script.js        # Client-side JavaScript functionality
├── index.css        # Styling and print CSS
├── favicon.png      # Application favicon
├── ogp_image.png    # Social media preview image
└── data.json        # Sample invoice data (for testing)
```

## 🎨 Tech Stack

- **Backend**: TypeScript (Bun runtime)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Custom CSS with responsive design
- **PDF Generation**: Browser print functionality
- **Storage**: Browser localStorage for form persistence
