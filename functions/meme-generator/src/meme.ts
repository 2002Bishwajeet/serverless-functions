import sharp from 'sharp';

export async function generateMeme(text: string): Promise<Buffer> {
    // Fetch random meme from Giphy
    const giphyApiKey = Bun.env["GIPHY_API_KEY"]; // Replace with your key
    const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=meme&rating=pg`;

    const response = await fetch(giphyUrl);
    if (!response.ok) throw new Error('Failed to fetch Giphy image');
    const giphyData = await response.json();
    const imageUrl = giphyData.data.images.original.url;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to download image');
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Overlay text
    const memeBuffer = await sharp(imageBuffer)
        .composite([{
            input: Buffer.from(
                `<svg width="100%" height="100%"><text x="50%" y="50%" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial">${text}</text></svg>`
            ),
            gravity: 'center'
        }])
        .png()
        .toBuffer();

    return memeBuffer;
}