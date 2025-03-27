export const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meme Generator</title>
  <link rel="stylesheet" href="?resource=styles.css">
</head>
<body>
  <div class="container">
    <h1>Make Your Own Meme!</h1>
    <p>Enter some text, hit generate, and see your meme come to life.</p>
    <form id="memeForm">
      <input type="text" name="text" placeholder="Type your meme text here" required>
      <button type="submit">Generate Meme</button>
    </form>
    <div id="result" class="result">
      <img id="memeImage" alt="Your generated meme" style="display: none;">
      <p id="loading" style="display: none;">Generating...</p>
    </div>
  </div>
  <script>
    const form = document.getElementById('memeForm');
    const memeImage = document.getElementById('memeImage');
    const loading = document.getElementById('loading');

    form.onsubmit = async (e) => {
      e.preventDefault();
      const text = form.text.value.trim();
      if (!text) return;

      loading.style.display = 'block';
      memeImage.style.display = 'none';

      const url = \`?text=\${encodeURIComponent(text)}\`;
      const response = await fetch(url);
      const blob = await response.blob();

      memeImage.src = URL.createObjectURL(blob);
      memeImage.style.display = 'block';
      loading.style.display = 'none';
    };
  </script>
</body>
</html>
`;