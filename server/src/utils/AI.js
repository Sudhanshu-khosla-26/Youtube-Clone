import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
    },
});

const emotionGenresMap = {
    happy: ["Travel Vlogs", "Comedy Skits", "Dance Performances", "Food Shows", 
           "Animal Videos", "Sports Moments", "Science Experiments", "Puzzle Videos",
           "Prank Videos", "Feel-Good Movies"],
    sad: ["Motivational Speeches", "Heartwarming Stories", "Relaxing Nature", 
         "Meditation Guides", "Poetry Readings", "Art Therapy", "ASMR Comfort",
         "Inspirational Biographies", "Emotional Documentaries", "Kindness Acts"],
    angry: ["Comedy Relief", "Action Thrillers", "Workout Motivation", 
           "Parkour Videos", "Rap Battles", "Debate Compilations", 
           "Satisfying Restorations", "Protest Footage", "Gaming Moments",
           "Destruction Catharsis"],
    neutral: ["Tech Reviews", "DIY Tutorials", "History Docs", 
            "Productivity Tips", "Space Exploration", "Language Lessons",
            "Philosophy Talks", "Cultural Exchange", "Minimalist Lifestyle",
            "Educational Content"],
    surprised: ["Magic Reveals", "Plot Twists", "Mystery Challenges", 
               "Talent Shows", "Paranormal Videos", "Future Tech", 
               "Illusion Explanations", "Extreme Challenges", 
               "Cultural Shocks", "Unexpected Reactions"]
};

const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateGenrePrompts = async (emotion, genres) => {
    const systemInstruction = `
    For "${emotion}" emotion, generate 10 YouTube search prompts for these genres: 
    ${genres.join(", ")}. 
    
    Requirements:
    1. Exactly 10 prompts per genre
    2. Include "-shorts" in every prompt
    3. Use keywords: "latest", "trending", "best of 2025"
    4. Format as JSON: { "genres": { "[Genre]": [prompts] } }`;

    try {
        const result = await model.generateContent(systemInstruction);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Prompt generation error:", error);
        return { genres: {} };
    }
};

const fetchYouTubeResults = async (query) => {
    try {
        const response = await fetch(
            `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&key=AIzaSyCKmg2SDXFvi-aks71ATTCYnnCgk2eQsCU`
        );
        return response.json();
    } catch (error) {
        console.error("YouTube API error:", error);
        return { items: [] };
    }
};

export const generateResult = async (emotion) => {
    const normalizedEmotion = emotion.toLowerCase().trim();
    
    if (!emotionGenresMap[normalizedEmotion]) {
        throw new Error("Invalid emotion specified");
    }

    try {
        // Select 4 random genres
        const selectedGenres = getRandomItems(emotionGenresMap[normalizedEmotion], 4);
        
        // Generate prompts for selected genres
        const { genres } = await generateGenrePrompts(normalizedEmotion, selectedGenres);
        
        // Select 1 random prompt per genre
        const selectedPrompts = {};
        for (const [genre, prompts] of Object.entries(genres)) {
            if (prompts.length >= 10) {
                selectedPrompts[genre] = prompts[Math.floor(Math.random() * 10)];
            }
        }

        // Fetch YouTube results
        const results = {};
        for (const [genre, prompt] of Object.entries(selectedPrompts)) {
            const data = await fetchYouTubeResults(prompt);
            results[genre] = {
                prompt: prompt,
                videos: data.items.slice(0,6) // Get top 5 results
            };
            await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
        }

        return {
            emotion: normalizedEmotion,
            recommendations: results
        };
        
    } catch (error) {
        console.error("Error in generateResult:", error);
        return { error: "Failed to generate recommendations" };
    }
};