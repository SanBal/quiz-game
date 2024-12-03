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
    private questions: Question[] = []

    public async fetchQuestion(category: Category, difficulty: Difficulty): Promise<Question> {
        if (this.questions.length === 0) {
            const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error(`API returned error code: ${data.response_code}`);
            }

            this.questions = data.results as Question[]
        }
        return this.questions.pop()!;
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
