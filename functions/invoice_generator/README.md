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
- **Load Saved Data**: Retrieve and populate previously saved form data
- **Timestamp Tracking**: Track when data was saved

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
- **Print Optimized**: CSS print styles for PDF generation
- **Real-time Calculations**: Live updates of totals and taxes
- **Amount in Words**: Written format of total amount

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
