import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, GenerationConfig } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async generateQuestions(
    syllabusContent: string, 
    config: GenerationConfig,
    isImage: boolean = false
  ): Promise<Question[]> {
    try {
      // Add retry logic for API calls
      const maxRetries = 3;
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await this.attemptGeneration(syllabusContent, config, isImage);
        } catch (error) {
          lastError = error as Error;
          console.warn(`Generation attempt ${attempt} failed:`, error);
          
          if (attempt < maxRetries) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      throw lastError;
    } catch (error) {
      console.error('Error generating questions:', error);
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
        } else if (error.message.includes('PERMISSION_DENIED')) {
          throw new Error('Permission denied. Please ensure your API key has the required permissions.');
        }
        throw error;
      }
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  private async attemptGeneration(
    syllabusContent: string, 
    config: GenerationConfig,
    isImage: boolean = false
  ): Promise<Question[]> {
      const prompt = config.sections.length > 0 
        ? this.buildSectionPrompt(config)
        : this.buildPrompt(config);
      
      // Always use extracted text for images (from FileProcessor)
      const fullPrompt = `${prompt}\n\nSyllabus Content:\n${syllabusContent}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      const questions = this.parseQuestions(text);
      
      if (questions.length === 0) {
        throw new Error('No valid questions were generated. Please try again.');
      }
      
      return questions;
  }

  private buildSectionPrompt(config: GenerationConfig): string {
    const totalQuestions = config.sections.reduce((sum, s) => sum + s.questionCount, 0);
    const totalMarks = config.sections.reduce((sum, s) => sum + (s.marks * s.questionCount), 0);

    let prompt = `You are an expert educator creating a comprehensive question paper with multiple sections. Generate exactly ${totalQuestions} questions for a ${config.subject} examination based on the provided syllabus content.

PAPER STRUCTURE:
- Total questions: ${totalQuestions}
- Total marks: ${totalMarks}
- Duration: ${config.duration} minutes
- Sections: ${config.sections.length}

SECTION REQUIREMENTS:
`;

    config.sections.forEach((section, index) => {
      prompt += `
${section.name}:
- Questions: ${section.questionCount}
- Marks per question: ${section.marks}
- Total section marks: ${section.marks * section.questionCount}
- Question types: ${section.questionTypes.join(', ')}
- Difficulty levels: ${section.difficulty.join(', ')}
`;
    });

    prompt += `
CRITICAL RULES:
- Generate questions EXACTLY as specified for each section
- Use ONLY the specified question types for each section
- Use ONLY the specified marks for each section
- Follow the exact question count for each section
- Cover different topics from the syllabus comprehensively
- Questions should be relevant and based on syllabus content

FOR EACH QUESTION:
1. Create relevant, clear questions directly from syllabus content
2. For multiple-choice: provide exactly 4 options with one clearly correct answer
3. For true-false: create statements that are definitively true or false
4. For short-answer: create questions requiring 2-3 sentence answers
5. For long-answer: create questions requiring detailed explanations
6. Extract topic names directly from syllabus content
7. Include section information in each question

RESPONSE FORMAT:
Return ONLY a valid JSON array. Each question must follow this exact structure:

[
  {
    "id": "q_1",
    "type": "multiple-choice",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "marks": 5,
    "difficulty": "medium",
    "topic": "Topic from syllabus",
    "section": "Section A"
  }
]

IMPORTANT:
- Return ONLY the JSON array, no additional text
- For non-multiple-choice questions, omit "options" and "correctAnswer" fields
- Include "section" field for each question
- Generate questions in section order
- Make questions challenging but fair`;

    return prompt;
  }

  private buildPrompt(config: GenerationConfig): string {
    const selectedTypes = config.questionTypes.join(', ');
    const availableMarks = config.marksDistribution.length > 0 
      ? config.marksDistribution.join(', ') 
      : '1, 2, 5, 10';

    return `You are an expert educator creating a comprehensive question paper. Generate exactly ${config.totalQuestions} questions for a ${config.subject} examination based on the provided syllabus content.

STRICT REQUIREMENTS:
- Total questions: ${config.totalQuestions}
- Total marks: ${config.totalMarks}
- Question types MUST BE ONLY: ${selectedTypes}
- Available marks per question: ${availableMarks}
- Difficulty levels: ${config.difficulty.join(', ')}
- Duration: ${config.duration} minutes

CRITICAL: Only generate questions of the specified types: ${selectedTypes}. Do NOT generate any other question types.

QUESTION DISTRIBUTION:
- Use ONLY the specified marks: ${availableMarks}
- Balance question types as specified
- Mix difficulty levels as requested
- Cover different topics from the syllabus comprehensively

FOR EACH QUESTION:
1. Create relevant, clear questions directly from syllabus content
2. ONLY create questions of these types: ${selectedTypes}
3. For multiple-choice: provide exactly 4 options with one clearly correct answer
4. For true-false: create statements that are definitively true or false
5. For short-answer: create questions requiring 2-3 sentence answers
6. For long-answer: create questions requiring detailed explanations
7. Use ONLY these mark values: ${availableMarks}
8. Match specified difficulty levels
9. Extract topic names directly from syllabus content

RESPONSE FORMAT:
Return ONLY a valid JSON array. Each question must follow this exact structure:

[
  {
    "id": "q_1",
    "type": "multiple-choice",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "marks": 5,
    "difficulty": "medium",
    "topic": "Topic from syllabus"
  }
]

IMPORTANT RULES:
- Return ONLY the JSON array, no additional text
- For non-multiple-choice questions, omit "options" and "correctAnswer" fields
- Ensure marks add up to approximately ${config.totalMarks}
- Make questions challenging but fair
- Base all content strictly on the provided syllabus`;
  }

  private parseQuestions(text: string): Question[] {
    try {
      // Clean the response text
      let cleanText = text.trim();
      
      // Remove any markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON array in the response
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in response:', cleanText);
        throw new Error('Invalid response format from AI');
      }

      const questionsData = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(questionsData)) {
        throw new Error('Response is not an array');
      }

      return questionsData.map((q: any, index: number) => ({
        id: q.id || `q_${index + 1}`,
        type: q.type || 'short-answer',
        question: q.question || 'Question not provided',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: typeof q.marks === 'number' ? q.marks : 1,
        difficulty: q.difficulty || 'medium',
        topic: q.topic || 'General'
      })).filter(q => q.question && q.question !== 'Question not provided');
    } catch (error) {
      console.error('Error parsing questions:', error);
      console.error('Raw response:', text);
      throw new Error('Failed to parse generated questions. Please try again.');
    }
  }
}