
import { generateMeme } from "./meme";
import { serveStatic } from "./static";

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }: any) => {

  try {
    const { text, resource } = req.query;

    // Serve static files (HTML or CSS)
    if (serveStatic(resource, res)) return;

    // Generate meme if text is provided
    if (text) {
      const memeBuffer = await generateMeme(text);
      res.binary(memeBuffer, 200, {
        'Cache-Control': 'no-cache',
        'Content-Length': memeBuffer.length,
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="meme.png"',
      });
      return;
    }

    // Default: serve the HTML page
    serveStatic(undefined, res);
  } catch (error) {
    error('Error:', error);
    res.json({ error: 'Something went wrong!' }, 500);
  }
};
