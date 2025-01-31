import { useState } from 'react';

const MoodBox = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [videopage, setVideopage] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const fetchMoodResult = async (mood) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "prompt": `${mood}`
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:8000/api/v1/ai/get-result", requestOptions)
                .then((response) => response.json())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
            // Handle the response data as needed
        } catch (error) {
            console.error('Error fetching mood result:', error);
        }
    };

    const logMood = (mood) => {
        setVideopage(true);
        console.log(mood);
        fetchMoodResult(mood);
    };


    return (
        isOpen && (
            videopage === false ?
                <div className={`flex h-screen w-screen flex-col items-center justify-center absolute z-50 inset-0 bg-black bg-opacity-50`}>
                    <div className="w-[30vw] h-[30vh] bg-white flex items-center justify-center flex-col rounded-lg shadow-lg relative">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-black">X</button>
                        <h1 className="text-3xl text-black">What's your mood?</h1>
                        <div className="flex gap-2.5 mt-2.5">
                            <span role="img" aria-label="happy" className="text-4xl cursor-pointer" title="Happy" onClick={() => logMood('Happy')}>😊</span>
                            <span role="img" aria-label="sad" className="text-4xl cursor-pointer" title="Sad" onClick={() => logMood('Sad')}>😢</span>
                            <span role="img" aria-label="angry" className="text-4xl cursor-pointer" title="Angry" onClick={() => logMood('Angry')}>😠</span>
                            <span role="img" aria-label="surprised" className="text-4xl cursor-pointer" title="Surprised" onClick={() => logMood('Surprised')}>😲</span>
                            <span role="img" aria-label="neutral" className="text-4xl cursor-pointer" title="Neutral" onClick={() => logMood('Neutral')}>😐</span>
                        </div>
                    </div>
                </div>
                :
                <div className="h-screen w-screen flex items-center justify-center bg-white absolute top-0 left-0 right-0 bottom-0 mt-[56px]">
                    <span className="">
                        comedy video
                    </span>
                </div>
        )
    );
}

export default MoodBox;
