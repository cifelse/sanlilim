/**
 * A custom google search API to fetch images
 * @param query - The search query
 * @param num - The number of images to fetch
 * @returns {Promise<string[]>} - The array of image URLs
 */
export const fetchImages = async (query: string, num: number = 1) => {
  const apiKey = process.env.NEXT_PUBLIC_GCP_API_KEY;
  const searchEngineId = process.env.NEXT_PUBLIC_GCP_SEARCH_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=${num}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map((item: any) => item.link);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}