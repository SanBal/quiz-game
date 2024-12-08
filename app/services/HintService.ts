import { Question } from "./QuestionsService";

const API_KEY = "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";

export const getHintFor = async (question: Question): Promise<string> => {
    const input = `Provide a hint for this question: "${question.question} in one short sentence, without saying the answer.
            Possible answers: ${question.incorrect_answers.join(", ")} and ${question.correct_answer}.`

    console.log('input', input)
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: [
                {
                role: "user",
                content: input
                }
            ]
           
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hint from API.");
    }

    const data = await response.json();
    const hint = data?.choices?.[0]?.message?.content;

    return hint || "No hint available.";
};


