export interface Question {
    question: string;
    options: string[];
    correctAnswer: number; // index
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    image: string;
    questions: Question[];
}

export const quizzes: Quiz[] = [
    {
        id: "earthquake-safety",
        title: "Earthquake Safety",
        description: "Test your knowledge on what to do before, during, and after an earthquake.",
        image: "/disaster/Earthquake.jpg",
        questions: [
            {
                question: "What is the best action to take during an earthquake?",
                options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in a doorway", "Call 911"],
                correctAnswer: 1
            },
            {
                question: "Which of these should be secured to prevent falling?",
                options: ["Bookcases", "Pillows", "Rugs", "Curtains"],
                correctAnswer: 0
            },
            {
                question: "When should you return home after an evacuation?",
                options: ["As soon as shaking stops", "When authorities say it is safe", "When you feel like it", "At night"],
                correctAnswer: 1
            }
        ]
    },
    {
        id: "flood-preparedness",
        title: "Flood Preparedness",
        description: "Are you ready for a flood? Check your understanding of essential flood safety tips.",
        image: "/disaster/Flood.jpg",
        questions: [
            {
                question: "What does 'Turn Around, Don't Drown!' refer to?",
                options: ["Swimming lessons", "Driving or walking through floodwaters", "Drinking tap water", "Boating safety"],
                correctAnswer: 1
            },
            {
                question: "Where should you go if there is a flash flood warning?",
                options: ["The basement", "Higher ground", "The roof", "A bridge"],
                correctAnswer: 1
            },
            {
                question: "What is a major risk after a flood recedes?",
                options: ["Excessive dust", "Mold and contaminated water", "Strong winds", "Heat wave"],
                correctAnswer: 1
            }
        ]
    },
    {
        id: "general-emergency",
        title: "General Emergency Kit",
        description: "Do you know what should be in your emergency supply kit?",
        image: "https://images.unsplash.com/photo-1549463972-e56592237937?q=80&w=1964&auto=format&fit=crop", // using generic image or one of the others
        questions: [
            {
                question: "How much water should you store per person per day?",
                options: ["1 cup", "1 gallon", "1 liter", "5 gallons"],
                correctAnswer: 1
            },
            {
                question: "Which item is essential for receiving emergency alerts?",
                options: ["Television", "Battery-powered or hand-crank radio", "Laptop", "Game console"],
                correctAnswer: 1
            },
            {
                question: "How often should you check and refresh your kit?",
                options: ["Every week", "Every 6 months to a year", "Never", "Every 5 years"],
                correctAnswer: 1
            }
        ]
    }
];
