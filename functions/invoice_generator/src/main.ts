import * as fs from "fs";

export default async ({ req, res, log, error }: any) => {

  try {
    // Handle different routes
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Serve static files
    if (pathname === "/" || pathname === "/index.html") {
      return serveFile("index.html", "text/html", res);
    }

    if (pathname === "/index.css") {
      return serveFile("index.css", "text/css", res);
    }

    if (pathname === "/script.js") {
      return serveFile("script.js", "application/javascript", res);
    }

    if (pathname === "/favicon.png") {
      return serveImageFile("favicon.png", "image/png", res);
    }

    if (pathname === "/ogp_image.png") {
      return serveImageFile("ogp_image.png", "image/png", res);
    }

    // API endpoints
    if (pathname === "/api/generate-invoice") {
      return handleInvoiceGeneration(req, res, log, error);
    }

    if (pathname === "/api/generate-pdf") {
      return handlePDFGeneration(req, res, log, error);
    }

    if (req.path === "/ping") {
      return res.text("Pong");
    }

    // // Debug endpoint to find file paths
    // if (pathname === "/debug" || pathname === "/debug/") {
    //   return debugFileSystem(res, log);
    // }

    // Default response for unknown routes
    return res.json({
      message: "Invoice Generator API",
      endpoints: {
        "/": "Invoice generator interface",
        "/debug": "Debug file system paths",
        "/ogp_image.png": "Open Graph preview image",
        "/api/generate-invoice": "Generate invoice data",
        "/api/generate-pdf": "Generate invoice PDF",
        "/ping": "Health check"
      },
      motto: "Professional invoices made simple",
    });

  } catch (err: any) {
    error("Function error: " + err.message);
    return res.json({ error: "Internal server error" }, 500);
  }
};

function debugFileSystem(res: any, log: any) {
  try {
    const debugInfo: any = {
      currentWorkingDirectory: process.cwd(),
      processArgv: process.argv,
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'unknown',
      availablePaths: {},
      fileSystemExploration: {}
    };

    // Test various directory paths and list their contents
    const pathsToTest = [
      '.',
      './',
      './src',
      './function',
      './function/src',
      '/usr/local/server',
      '/usr/local/server/src',
      '/usr/local/server/src/function',
      '/tmp',
      process.cwd(),
      `${process.cwd()}/src`,
      `${process.cwd()}/function`,
      `${process.cwd()}/function/src`
    ];

    for (const path of pathsToTest) {
      try {
        const stats = fs.statSync(path);
        if (stats.isDirectory()) {
          debugInfo.availablePaths[path] = {
            exists: true,
            type: 'directory',
            files: []
          };

          try {
            const files = fs.readdirSync(path);
            debugInfo.availablePaths[path].files = files;
          } catch (err) {
            debugInfo.availablePaths[path].error = `Cannot read directory: ${err}`;
          }
        } else {
          debugInfo.availablePaths[path] = {
            exists: true,
            type: 'file',
            size: stats.size
          };
        }
      } catch (err) {
        debugInfo.availablePaths[path] = {
          exists: false,
          error: String(err)
        };
      }
    }

    // Look for our specific files
    const targetFiles = ['index.html', 'script.js', 'index.css', 'favicon.png', 'ogp_image.png'];
    debugInfo.targetFiles = {};

    for (const file of targetFiles) {
      debugInfo.targetFiles[file] = { found: [], notFound: [] };

      for (const basePath of pathsToTest) {
        const fullPath = `${basePath}/${file}`.replace(/\/+/g, '/');
        try {
          fs.statSync(fullPath);
          debugInfo.targetFiles[file].found.push(fullPath);
        } catch (err) {
          debugInfo.targetFiles[file].notFound.push(fullPath);
        }
      }
    }

    log('Debug info collected:', JSON.stringify(debugInfo, null, 2));

    return res.json(debugInfo, 200);
  } catch (err: any) {
    log('Debug error:', err.message);
    return res.json({ error: 'Debug failed', details: err.message }, 500);
  }
}

function serveFile(filename: string, contentType: string, res: any) {
  try {
    // Based on debug info: working dir is /usr/local/server, function files are in src/function/src/
    const possiblePaths = [
      `/usr/local/server/src/function/src/${filename}`,
      `/usr/local/server/src/function/${filename}`,
      `./src/function/src/${filename}`,
      `./src/function/${filename}`,
      `src/function/src/${filename}`,
      `src/function/${filename}`,
      filename
    ];

    let content: string | null = null;
    let foundPath = '';

    for (const path of possiblePaths) {
      try {
        content = fs.readFileSync(path, 'utf8');
        foundPath = path;
        break;
      } catch (err) {
        // Continue to next path
        continue;
      }
    }

    if (!content) {
      throw new Error(`File not found in any of the expected locations`);
    }


    return res.send(content, 200, {
      "content-type": contentType
    }
    );
  } catch (err) {
    return res.json({ error: `File ${filename} not found. error: ${err}` }, 404);
  }
}

function serveImageFile(filename: string, contentType: string, res: any) {
  try {
    // Based on debug info: working dir is /usr/local/server, function files are in src/function/src/
    const possiblePaths = [
      `/usr/local/server/src/function/src/${filename}`,
      `/usr/local/server/src/function/${filename}`,
      `./src/function/src/${filename}`,
      `./src/function/${filename}`,
      `src/function/src/${filename}`,
      `src/function/${filename}`,
      filename
    ];

    let content: any = null;
    let foundPath = '';

    for (const path of possiblePaths) {
      try {
        content = fs.readFileSync(path);
        foundPath = path;
        break;
      } catch (err) {
        // Continue to next path
        continue;
      }
    }

    if (!content) {
      throw new Error(`Image not found in any of the expected locations`);
    }


    return res.send(content, 200, {
      "content-type": contentType,
      "Cache-Control": "public, max-age=31536000"

    });
  } catch (err) {
    return res.json({ error: `Image ${filename} not found. error: ${err}` }, 404);
  }
}

async function handleInvoiceGeneration(req: any, res: any, log: any, error: any) {
  try {
    if (req.method !== "POST") {
      return res.json({ error: "Method not allowed" }, 405);
    }

    const invoiceData = req.body;

    // Validate required fields
    const requiredFields = [
      'yourName', 'yourEmail', 'clientName', 'invoiceNumber',
      'invoiceDate', 'dueDate', 'services'
    ];

    for (const field of requiredFields) {
      if (!invoiceData[field]) {
        return res.json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    // Calculate totals
    const calculations = calculateInvoiceTotals(invoiceData);

    // Generate invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      invoiceData.invoiceNumber = generateInvoiceNumber();
    }

    const response = {
      success: true,
      invoice: {
        ...invoiceData,
        ...calculations,
        generatedAt: new Date().toISOString()
      }
    };

    log(`Invoice generated: ${invoiceData.invoiceNumber}`);
    return res.json(response);

  } catch (err: any) {
    error("Invoice generation error: " + err.message);
    return res.json({ error: "Failed to generate invoice" }, 500);
  }
}

function calculateInvoiceTotals(invoiceData: any) {
  let subtotal = 0;

  // Calculate subtotal from services
  if (invoiceData.services && Array.isArray(invoiceData.services)) {
    subtotal = invoiceData.services.reduce((sum: number, service: any) => {
      const quantity = parseFloat(service.quantity) || 0;
      const rate = parseFloat(service.rate) || 0;
      return sum + (quantity * rate);
    }, 0);
  }

  const discount = parseFloat(invoiceData.discount) || 0;
  const taxRate = parseFloat(invoiceData.taxRate) || 0;

  const discountedSubtotal = subtotal - discount;
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + taxAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    taxRate: Number(taxRate.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `INV-${timestamp}-${random}`;
}

async function handlePDFGeneration(req: any, res: any, log: any, error: any) {
  try {
    if (req.method !== "POST") {
      return res.json({ error: "Method not allowed" }, 405);
    }

    const invoiceData = req.body;

    // Validate required fields
    const requiredFields = [
      'yourName', 'yourEmail', 'clientName', 'invoiceNumber',
      'invoiceDate', 'dueDate', 'services'
    ];

    for (const field of requiredFields) {
      if (!invoiceData[field]) {
        return res.json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    // Calculate totals
    const calculations = calculateInvoiceTotals(invoiceData);

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF({
      ...invoiceData,
      ...calculations
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    log(`PDF generated for invoice: ${invoiceData.invoiceNumber}`);
    return res.send(pdfBuffer);

  } catch (err: any) {
    error("PDF generation error: " + err.message);
    return res.json({ error: "Failed to generate PDF: " + err.message }, 500);
  }
}

async function generateInvoicePDF(invoiceData: any): Promise<Uint8Array> {
  // TODO: Replace with Appwrite-compatible PDF generation
  // Options: html-pdf, PDFKit, jsPDF, or other non-Chromium solutions

  // For now, return a simple placeholder
  const placeholderPDF = `PDF generation for invoice ${invoiceData.invoiceNumber} - Implementation needed`;
  return new TextEncoder().encode(placeholderPDF);
}
