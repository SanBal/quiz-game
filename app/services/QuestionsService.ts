import { Category } from "../model/Category";
import { Difficulty } from "../model/Difficulty";

export interface Question {
    type: "multiple";
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface TokenResponse {
    token: string;
}

export class QuestionsService {
    private token?: string;
    public questions: Question[] = []

    public async fetchQuestion(category: Category, difficulty: Difficulty): Promise<Question> {
        const maxRetries = 5;
        const baseDelay = 1000;

        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                // Fetch new questions if the list is empty
                if (this.questions.length === 0) {
                    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
                    const response = await fetch(url);

                    // Handle 429 status with a retry
                    if (response.status === 429) {
                        const delay = baseDelay * Math.pow(2, attempts);
                        console.warn(`Rate limit reached. Retrying in ${delay / 1000} seconds...`);
                        await this.sleep(delay);
                        attempts++;
                        continue;
                    }

                    if (!response.ok) {
                        throw new Error(`Failed to fetch data: ${response.statusText}`);
                    }

                    const data = await response.json();

                    if (data.response_code !== 0) {
                        throw new Error(`API returned error code: ${data.response_code}`);
                    }

                    this.questions = data.results as Question[];
                }

                return this.questions.pop()!;
            } catch (error) {
                console.error("Unexpected error:", error);
                throw error;
            }
        }

        throw new Error("Failed to fetch a question after multiple retries.");
    }

    // Helper function to delay execution
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


    public reset(): void {
        this.questions = []
    }

    private async getToken(): Promise<string> {
        const tokenUrl = 'https://opentdb.com/api_token.php?command=request';
        const response = await fetch(tokenUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }
        const data: TokenResponse = await response.json();
        this.token = data.token;
        return this.token;
    }
}
