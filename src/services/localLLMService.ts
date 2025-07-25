import { Question, GenerationConfig } from '../types';
import nlp from 'compromise'; // Add at the top if using a lightweight NLP library

export class LocalLLMService {
  constructor() {
    // Instant ready - no initialization needed
  }

  async initialize(): Promise<void> {
    // Remove duplicate isReady and isLoading methods
  }

  async generateQuestions(
    syllabusContent: string,
    config: GenerationConfig,
    isImage: boolean = false
  ): Promise<Question[]> {
    if (isImage) {
      throw new Error('Local AI does not support image processing. Please use Cloud API for image files.');
    }

    if (!syllabusContent || syllabusContent.trim().length === 0) {
      throw new Error('Please provide syllabus content to generate questions.');
    }

    try {
      // Validate configuration
      this.validateConfig(config);
      
      // Extract meaningful content from syllabus
      const extractedContent = this.extractMeaningfulContent(syllabusContent);
      
      // Generate questions based on configuration
      const questions = config.sections.length > 0 
        ? this.generateSectionWiseQuestions(extractedContent, config)
        : this.generateSimpleQuestions(extractedContent, config);
      
      if (questions.length === 0) {
        throw new Error('No questions could be generated. Please check your configuration and try again.');
      }
      
      return questions;
    } catch (error) {
      console.error('Error generating questions with local AI:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate questions with Local AI. Please try again.');
    }
  }

  private validateConfig(config: GenerationConfig): void {
    if (config.sections.length > 0) {
      // Section-wise validation
      if (config.sections.some(s => s.questionTypes.length === 0)) {
        throw new Error('Please select at least one question type for each section.');
      }
      if (config.sections.some(s => s.difficulty.length === 0)) {
        throw new Error('Please select at least one difficulty level for each section.');
      }
      if (config.sections.some(s => s.questionCount <= 0)) {
        throw new Error('Please set a valid number of questions for each section.');
      }
      if (config.sections.some(s => s.marks <= 0)) {
        throw new Error('Please set valid marks for each section.');
      }
    } else {
      // Simple mode validation
      if (!config.questionTypes || config.questionTypes.length === 0) {
        throw new Error('Please select at least one question type.');
      }
      if (!config.difficulty || config.difficulty.length === 0) {
        throw new Error('Please select at least one difficulty level.');
      }
      if (!config.marksDistribution || config.marksDistribution.length === 0) {
        throw new Error('Please select at least one marks option.');
      }
      if (!config.totalQuestions || Number(config.totalQuestions) <= 0) {
        throw new Error('Please set a valid number of total questions.');
      }
    }
  }

  private extractMeaningfulContent(syllabusContent: string): {
    topics: string[];
    concepts: string[];
    skills: string[];
    technologies: string[];
    keyPoints: string[];
    names: string[];
    places: string[];
    definitions: string[];
  } {
    const content = syllabusContent.toLowerCase();
    const sentences = syllabusContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = syllabusContent.split(/\W+/).filter(w => w.length > 2);
    
    // Extract specific entities from content
    const topics = this.extractTopics(syllabusContent);
    const concepts = this.extractConcepts(sentences);
    const skills = this.extractSkills(content);
    const technologies = this.extractTechnologies(content);
    const keyPoints = this.extractKeyPoints(sentences);
    const names = this.extractNames(syllabusContent);
    const places = this.extractPlaces(content);
    const definitions = this.extractDefinitions(sentences);

    return {
      topics,
      concepts,
      skills,
      technologies,
      keyPoints,
      names,
      places,
      definitions
    };
  }

  private extractTopics(content: string): string[] {
    // Use compromise to extract noun phrases and most frequent terms
    let topics: string[] = [];
    try {
      const doc = nlp(content);
      topics = doc.nouns().out('array');
    } catch (e) {
      // fallback to old logic if compromise is not available
      const sentences = content.split(/[.!?]+/);
      const fallbackTopics = [];
      sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        if (trimmed.length > 10 && trimmed.length < 150) {
          const importantPhrases = trimmed.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
          if (importantPhrases) {
            importantPhrases.forEach(phrase => {
              if (phrase.length > 5 && phrase.length < 50) {
                fallbackTopics.push(phrase);
              }
            });
          }
        }
      });
      topics = fallbackTopics;
    }
    // Frequency count and filter
    const freq: Record<string, number> = {};
    topics.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([t]) => t);
    return [...new Set(sorted)].slice(0, 20);
  }

  private extractConcepts(sentences: string[]): string[] {
    // Use noun phrases and verbs for more variety
    let concepts: string[] = [];
    try {
      const joined = sentences.join('. ');
      const doc = nlp(joined);
      concepts = doc.nouns().out('array').concat(doc.verbs().out('array'));
    } catch (e) {
      // fallback to old logic
      const conceptKeywords = [
        'concept', 'principle', 'theory', 'method', 'approach', 'technique',
        'process', 'system', 'framework', 'model', 'algorithm', 'strategy'
      ];
      sentences.forEach(sentence => {
        conceptKeywords.forEach(keyword => {
          if (sentence.toLowerCase().includes(keyword)) {
            const parts = sentence.split(/[,;]/);
            parts.forEach(part => {
              const trimmed = part.trim();
              if (trimmed.length > 10 && trimmed.length < 100) {
                concepts.push(trimmed);
              }
            });
          }
        });
      });
    }
    // Remove duplicates and filter
    return [...new Set(concepts)].filter(c => c.length > 3 && c.length < 50).slice(0, 15);
  }

  private extractSkills(content: string): string[] {
    const skills = [];
    const skillPatterns = [
      /skills?\s*:? 0/gi,
      /abilities?\s*:? 0/gi,
      /competenc(?:y|ies)\s*:? 0/gi,
      /can\s+([^.!?]+)/gi,
      /able\s+to\s+([^.!?]+)/gi,
      /learn\s+to\s+([^.!?]+)/gi
    ];
    
    skillPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const skill = match[1].trim();
        if (skill.length > 5 && skill.length < 100) {
          skills.push(skill);
        }
      }
    });
    
    return [...new Set(skills)].slice(0, 10);
  }

  private extractTechnologies(content: string): string[] {
    const technologies = [];
    const techKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql',
      'database', 'api', 'framework', 'library', 'tool', 'software', 'platform',
      'technology', 'programming', 'development', 'web', 'mobile', 'cloud'
    ];
    
    const words = content.toLowerCase().split(/\W+/);
    words.forEach(word => {
      if (techKeywords.includes(word) || word.length > 3) {
        const originalWord = content.match(new RegExp(`\\b${word}\\b`, 'i'));
        if (originalWord) {
          technologies.push(originalWord[0]);
        }
      }
    });
    
    return [...new Set(technologies)].slice(0, 15);
  }

  private extractKeyPoints(sentences: string[]): string[] {
    const keyPoints = [];
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 200) {
        // Look for sentences with important indicators
        if (/\b(important|key|main|primary|essential|fundamental|critical|significant)\b/i.test(trimmed)) {
          keyPoints.push(trimmed);
        }
        // Look for definition-like sentences
        if (/\bis\s+(?:a|an|the)\b/i.test(trimmed) || /\brefers?\s+to\b/i.test(trimmed)) {
          keyPoints.push(trimmed);
        }
      }
    });
    
    return [...new Set(keyPoints)].slice(0, 12);
  }

  private extractNames(content: string): string[] {
    const names = [];
    // Extract proper nouns that could be names
    const nameMatches = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (nameMatches) {
      nameMatches.forEach(name => {
        if (name.length > 3 && name.length < 50 && !/^(The|This|That|When|Where|What|How|Why)$/.test(name)) {
          names.push(name);
        }
      });
    }
    return [...new Set(names)].slice(0, 10);
  }

  private extractPlaces(content: string): string[] {
    const places = [];
    const placeKeywords = ['university', 'college', 'school', 'institute', 'center', 'department', 'city', 'country', 'region'];
    
    placeKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\s+${keyword})\\b`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        places.push(match[1]);
      }
    });
    
    return [...new Set(places)].slice(0, 8);
  }

  private extractDefinitions(sentences: string[]): string[] {
    const definitions = [];
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      // Look for definition patterns
      if (/\bis\s+defined\s+as\b/i.test(trimmed) || 
          /\bmeans\b/i.test(trimmed) || 
          /\brefers\s+to\b/i.test(trimmed) ||
          /\bis\s+(?:a|an|the)\s+(?:process|method|technique|system|approach)\b/i.test(trimmed)) {
        if (trimmed.length > 15 && trimmed.length < 200) {
          definitions.push(trimmed);
        }
      }
    });
    
    return [...new Set(definitions)].slice(0, 10);
  }

  private generateSectionWiseQuestions(extractedContent: any, config: GenerationConfig): Question[] {
    const questions: Question[] = [];
    const usedContents = new Set<string>();
    config.sections.forEach((section, sectionIndex) => {
      let availableContent = [
        ...extractedContent.topics,
        ...extractedContent.concepts,
        ...extractedContent.skills,
        ...extractedContent.technologies,
        ...extractedContent.keyPoints,
        ...extractedContent.names,
        ...extractedContent.places,
        ...extractedContent.definitions
      ].filter(item => item && item.length > 3);
      availableContent = availableContent.sort(() => Math.random() - 0.5);
      for (let i = 0; i < section.questionCount; i++) {
        // Pick a unique content if possible
        let content = availableContent.find(c => !usedContents.has(c));
        if (!content) break;
        usedContents.add(content);
        const question = this.createMeaningfulQuestion(
          section.questionTypes[i % section.questionTypes.length],
          section.difficulty[i % section.difficulty.length],
          Number(section.marks),
          { ...extractedContent, topics: [content] },
          section.name,
          questions.length + 1
        );
        // Ensure question text is unique
        if (!questions.some(q => q.question === question.question)) {
          questions.push(question);
        }
      }
    });
    return questions;
  }

  private generateSimpleQuestions(extractedContent: any, config: GenerationConfig): Question[] {
    const questions: Question[] = [];
    const usedContents = new Set<string>();
    let availableContent = [
      ...extractedContent.topics,
      ...extractedContent.concepts,
      ...extractedContent.skills,
      ...extractedContent.technologies,
      ...extractedContent.keyPoints,
      ...extractedContent.names,
      ...extractedContent.places,
      ...extractedContent.definitions
    ].filter(item => item && item.length > 3);
    availableContent = availableContent.sort(() => Math.random() - 0.5);
    const totalQuestions = Number(config.totalQuestions) || 10;
    let i = 0;
    while (questions.length < totalQuestions) {
      // Use unique content first, then allow repeats
      let content = availableContent[i % availableContent.length];
      const question = this.createMeaningfulQuestion(
        config.questionTypes[questions.length % config.questionTypes.length],
        config.difficulty[questions.length % config.difficulty.length],
        Number(config.marksDistribution[questions.length % config.marksDistribution.length]),
        { ...extractedContent, topics: [content] },
        undefined,
        questions.length + 1
      );
      // Only filter out exact duplicates
      if (!questions.some(q => q.question === question.question)) {
        questions.push(question);
      } else if (availableContent.length < totalQuestions) {
        // If not enough unique, allow repeats
        questions.push(question);
      }
      i++;
    }
    return questions;
  }

  private createMeaningfulQuestion(
    type: string,
    difficulty: string,
    marks: number,
    extractedContent: any,
    section?: string,
    questionNumber: number = 1
  ): Question {
    const questionText = this.generateMeaningfulQuestionText(
      type, 
      difficulty, 
      extractedContent, 
      questionNumber
    );
    
    const baseQuestion: Question = {
      id: `q_${questionNumber}`,
      type: type as any,
      question: questionText,
      marks: marks,
      difficulty: difficulty as any,
      topic: this.selectRelevantTopic(extractedContent)
    };

    if (section) {
      baseQuestion.section = section;
    }

    // Add options for multiple choice questions
    if (type === 'multiple-choice') {
      const options = this.generateMeaningfulOptions(questionText, extractedContent);
      baseQuestion.options = options;
      baseQuestion.correctAnswer = options[0]; // First option is correct
    }

    return baseQuestion;
  }

  private generateMeaningfulQuestionText(
    type: string, 
    difficulty: string, 
    extractedContent: any,
    questionNumber: number
  ): string {
    const { topics, concepts, skills, technologies, keyPoints, names, places, definitions } = extractedContent;
    // Shuffle extracted content for more variety
    let availableContent = [
      ...topics,
      ...concepts,
      ...skills,
      ...technologies,
      ...keyPoints,
      ...names,
      ...places,
      ...definitions
    ].filter(item => item && item.length > 3);
    availableContent = availableContent.sort(() => Math.random() - 0.5);
    if (availableContent.length === 0) {
      return this.getFallbackQuestion(type, difficulty);
    }
    const selectedContent = availableContent[questionNumber % availableContent.length];
    // Add more templates and shuffle
    const templates = {
      'multiple-choice': {
        easy: [
          `What is ${selectedContent}?`,
          `Which of the following best describes ${selectedContent}?`,
          `${selectedContent} is primarily used for:`,
          `The main purpose of ${selectedContent} is to:`,
          `In the context of the syllabus, ${selectedContent} refers to:`,
          `Which statement about ${selectedContent} is correct?`,
          `Select the best definition of ${selectedContent}.`,
          `Which of these is most related to ${selectedContent}?`
        ],
        medium: [
          `How does ${selectedContent} contribute to the overall understanding of the subject?`,
          `What are the key applications of ${selectedContent} in practice?`,
          `Which principle best explains the functionality of ${selectedContent}?`,
          `What distinguishes ${selectedContent} from similar concepts?`,
          `In what scenarios would you apply ${selectedContent}?`,
          `Why is ${selectedContent} important in this context?`,
          `What is a real-world example of ${selectedContent}?`
        ],
        hard: [
          `Analyze the relationship between ${selectedContent} and other key concepts in the syllabus.`,
          `What are the critical challenges associated with implementing ${selectedContent}?`,
          `How would you evaluate the effectiveness of ${selectedContent} in advanced applications?`,
          `What are the theoretical foundations underlying ${selectedContent}?`,
          `Under what conditions would ${selectedContent} be most beneficial?`,
          `Discuss the limitations of ${selectedContent}.`,
          `How could ${selectedContent} be improved or extended?`
        ]
      },
      'short-answer': {
        easy: [
          `Define ${selectedContent} and explain its basic purpose.`,
          `List three key characteristics of ${selectedContent}.`,
          `Explain the importance of ${selectedContent} in the given context.`,
          `Describe the main features of ${selectedContent}.`,
          `What role does ${selectedContent} play in the subject matter?`,
          `Summarize the main idea of ${selectedContent}.`,
          `What is the function of ${selectedContent}?`
        ],
        medium: [
          `Explain how ${selectedContent} is applied in real-world scenarios.`,
          `Discuss the advantages and limitations of ${selectedContent}.`,
          `Compare ${selectedContent} with related concepts from the syllabus.`,
          `Analyze the significance of ${selectedContent} in modern applications.`,
          `Evaluate the impact of ${selectedContent} on current practices.`,
          `How does ${selectedContent} differ from similar ideas?`,
          `What are the consequences of ${selectedContent}?`
        ],
        hard: [
          `Analyze the relationship between ${selectedContent} and other key concepts in the syllabus.`,
          `What are the critical challenges associated with implementing ${selectedContent}?`,
          `How would you evaluate the effectiveness of ${selectedContent} in advanced applications?`,
          `What are the theoretical foundations underlying ${selectedContent}?`,
          `Under what conditions would ${selectedContent} be most beneficial?`,
          `Discuss the limitations of ${selectedContent}.`,
          `How could ${selectedContent} be improved or extended?`
        ]
      }
    };

    const questionTemplates = templates[type];
    if (!questionTemplates) {
      return this.getFallbackQuestion(type, difficulty);
    }

    const difficultyTemplates = questionTemplates[difficulty];
    if (!difficultyTemplates) {
      return this.getFallbackQuestion(type, difficulty);
    }

    const selectedTemplate = difficultyTemplates[questionNumber % difficultyTemplates.length];
    return selectedTemplate.replace('${selectedContent}', selectedContent);
  }

  private getFallbackQuestion(type: string, difficulty: string): string {
    const fallbackTemplates = {
      'multiple-choice': {
        easy: [
          'What is a concept?',
          'Which of the following is a skill?',
          'What is a technology?',
          'What is a key point?',
          'Which of these is a name?',
          'What is a place?',
          'What is a definition?'
        ],
        medium: [
          'How does a concept contribute to the overall understanding?',
          'What are the key applications of a skill?',
          'Which principle best explains a functionality?',
          'What distinguishes a concept from a similar one?',
          'In what scenarios would you apply a concept?',
          'Why is a concept important?',
          'What is a real-world example of a concept?'
        ],
        hard: [
          'Analyze the relationship between a concept and other key concepts.',
          'What are the critical challenges associated with implementing a concept?',
          'How would you evaluate the effectiveness of a concept in advanced applications?',
          'What are the theoretical foundations underlying a concept?',
          'Under what conditions would a concept be most beneficial?',
          'Discuss the limitations of a concept.',
          'How could a concept be improved or extended?'
        ]
      },
      'short-answer': {
        easy: [
          'Define a concept and explain its basic purpose.',
          'List three key characteristics of a skill.',
          'Explain the importance of a skill in the given context.',
          'Describe the main features of a technology.',
          'What role does a skill play in the subject matter?',
          'Summarize the main idea of a concept.',
          'What is the function of a technology?'
        ],
        medium: [
          'Explain how a concept is applied in real-world scenarios.',
          'Discuss the advantages and limitations of a concept.',
          'Compare a concept with related concepts from the syllabus.',
          'Analyze the significance of a concept in modern applications.',
          'Evaluate the impact of a concept on current practices.',
          'How does a concept differ from similar ideas?',
          'What are the consequences of a concept?'
        ],
        hard: [
          'Analyze the relationship between a concept and other key concepts.',
          'What are the critical challenges associated with implementing a concept?',
          'How would you evaluate the effectiveness of a concept in advanced applications?',
          'What are the theoretical foundations underlying a concept?',
          'Under what conditions would a concept be most beneficial?',
          'Discuss the limitations of a concept.',
          'How could a concept be improved or extended?'
        ]
      }
    };

    const questionTemplates = fallbackTemplates[type];
    if (!questionTemplates) {
      return `Question type "${type}" not found.`;
    }

    const difficultyTemplates = questionTemplates[difficulty];
    if (!difficultyTemplates) {
      return `Difficulty level "${difficulty}" not found for question type "${type}".`;
    }

    const selectedTemplate = difficultyTemplates[0]; // Fallback to the first template if number is out of bounds
    return selectedTemplate;
  }

  private generateMeaningfulOptions(questionText: string, extractedContent: any): string[] {
    const { topics, concepts, skills, technologies, keyPoints, names, places, definitions } = extractedContent;
    let availableOptions = [
      ...topics,
      ...concepts,
      ...skills,
      ...technologies,
      ...keyPoints,
      ...names,
      ...places,
      ...definitions
    ].filter(item => item && item.length > 3);
    availableOptions = availableOptions.sort(() => Math.random() - 0.5);
    return availableOptions.slice(0, 4); // Generate 4 options
  }

  private selectRelevantTopic(extractedContent: any): string {
    const { topics, concepts, skills, technologies, keyPoints, names, places, definitions } = extractedContent;
    let availableTopics = [
      ...topics,
      ...concepts,
      ...skills,
      ...technologies,
      ...keyPoints,
      ...names,
      ...places,
      ...definitions
    ].filter(item => item && item.length > 3);
    availableTopics = availableTopics.sort(() => Math.random() - 0.5);
    return availableTopics[0]; // Select the first available topic
  }
}