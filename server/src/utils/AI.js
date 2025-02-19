import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-pro",
//     generationConfig: {
//         responseMimeType: "application/json",
//         temperature: 1,
//     },
//     systemInstruction: `
//     You are an AI that helps categorize emotions into subcategories for YouTube content recommendations. When given an emotion like "happy", "sad", etc., break it down into relevant subcategories such as:
//         - happy: ["latest comedy video", "latest comedy with action", "thriller", "feel-good movies"]
//         - sad: ["drama", "documentary", "romance", "melancholic music"]
//         - excited: ["adventure", "action", "sports", "travel vlogs"]
//         - relaxed: ["nature", "meditation", "lo-fi music", "yoga"]
//         - angry: ["action", "crime", "horror", "thriller"]
//         Provide the result in JSON format with the emotion as the key and an array of subcategories as the value.

//         <example>
//             user:happy
//             response:{
//                 "text": "["latest comedy video", "latest comedy with action", "thriller", "feel-good movies"]"
//             }
//         </example>
//     `
// });


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
    },
});

// Object to store previously generated prompts for each emotion
const promptHistory = {};

const generateUniquePrompts = async (emotion, count = 4) => {
    const systemInstruction = `
    Generate ${count} unique and interesting YouTube search queries based on the emotion "${emotion}". 
    These queries should be diverse, unexpected, and relevant to the emotion. 
    Avoid common or generic phrases. Be creative and think outside the box.
    
    Format the response as a JSON array of strings.
    `;

    try {
        const result = await model.generateContent([
            { text: systemInstruction },
            { text: JSON.stringify(promptHistory[emotion] || []) + "\nAvoid these previously generated prompts." }
        ]);
        const response = JSON.parse(result.response.text());
        
        // Ensure we have an array of strings
        const newPrompts = Array.isArray(response) ? response : [];
        
        // Update prompt history
        if (!promptHistory[emotion]) {
            promptHistory[emotion] = [];
        }
        promptHistory[emotion] = [...promptHistory[emotion], ...newPrompts].slice(-50); // Keep last 50 prompts

        return newPrompts;
    } catch (error) {
        console.error("Error generating prompts:", error);
        return [];
    }
};

const fetchYouTubeResults = async (query) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay of 1 second
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error(`Error fetching YouTube results for query "${query}":`, error);
        return [];
    }
};

export const generateResult = async (emotion) => {
    try {
        const prompt = emotion.toLowerCase().trim();
        const queries = await generateUniquePrompts(prompt);
        console.log(`Generated Queries for "${emotion}":`, queries);

        const youtubeResults = {};

        // Fetch YouTube results for each query
        const videoPromises = queries.map(query => fetchYouTubeResults(query));
        const videosArray = await Promise.all(videoPromises);

        // Map results to the queries
        queries.forEach((query, index) => {
            youtubeResults[query] = videosArray[index];
        });

        console.log(`YouTube Results for "${emotion}":`, youtubeResults);
        return youtubeResults;
    } catch (error) {
        console.error("Error generating YouTube results:", error);
        return {};
    }
};

// generateResult("sad");
