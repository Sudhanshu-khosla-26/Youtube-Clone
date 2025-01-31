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
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
    },
    systemInstruction: `
    You are an AI system that generates multiple unique YouTube search queries based on the emotion provided by the user. Your task is to:
    - Understand the given emotion (e.g., "happy", "sad") and generate **4 fresh and contextually relevant YouTube search queries** per call.
    - Ensure that all queries align with the emotion but offer diverse perspectives or genres to maximize variety.
    - Avoid repeating queries across calls for the same emotion.

    Example Queries for Emotions:
    - happy: 
        - "latest stand-up comedy specials"
        - "funniest moments in movies 2025"
        - "feel-good motivational videos"
        - "top trending comedy sketches"
    - sad:
        - "heartwarming short films about hope"
        - "nostalgic songs for reflection"
        - "classic emotional dramas"
        - "poignant true stories documentaries"
    - excited:
        - "extreme sports highlights compilation"
        - "best action movie trailers 2025"
        - "travel adventure vlogs in exotic locations"
        - "concert performances of top artists"
    - relaxed:
        - "soothing piano instrumentals"
        - "chill lo-fi music mixes for relaxation"
        - "guided yoga and meditation routines"
        - "beautiful nature scenery with calming sounds"
    - angry:
        - "intense crime thrillers"
        - "powerful protest documentaries"
        - "motivational workout videos"
        - "revenge-themed action movies"

    Output Format:
    Provide the result in JSON format with the emotion as the key and an array of 4 queries as the value.

    Example interaction:
    <example>
        User: happy
        Response:
        {
            "text": ["latest stand-up comedy specials", "funniest moments in movies 2025", "feel-good motivational videos", "top trending comedy sketches"]
        }
    </example>
    `
});


const fetchYouTubeResults = async (query) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay of 1 second
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=AIzaSyDpicnbroQi7p8Sp0zbeQv91n-elyXVeD8`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error(`Error fetching YouTube results for query "${query}":`, error);
        return [];
    }
};

// export const generateResult = async (prompt) => {
//     try {
//         const result = await model.generateContent(prompt);
//         console.log(result);

//         const subcategories = JSON.parse(result.response.text());
//         console.log(typeof (subcategories));
//         const youtubeResults = {};

//         for (const [emotion, categories] of Object.entries(subcategories)) {
//             youtubeResults[emotion] = {};
//             const videoPromises = categories.map(category => fetchYouTubeResults(category));
//             const videosArray = await Promise.all(videoPromises);
//             videosArray.forEach((videos, index) => {
//                 const category = categories[index];
//                 youtubeResults[emotion][category] = videos;
//             });

//         }
//         console.log(youtubeResults);
//         return youtubeResults;
//     } catch (error) {
//         console.error('Error generating result:', error);
//         return {};
//     }
// };


export const generateResult = async (emotion) => {
    try {
        const prompt = emotion.toLowerCase().trim(); // Ensure consistent input
        const result = await model.generateContent(prompt); // Generate the dynamic queries
        const queries = JSON.parse(result.response.text()).text; // Extract queries as an array
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