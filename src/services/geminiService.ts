import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExpenseData {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
}

interface GeminiResponse {
  success: boolean;
  data?: ExpenseData;
  error?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    // Initialize will be called when API key is set
  }

  initialize(apiKey: string) {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      return false;
    }
  }

  async parseExpenseFromText(transcript: string): Promise<GeminiResponse> {
    if (!this.model) {
      return {
        success: false,
        error: 'Gemini AI not initialized. Please set your API key.'
      };
    }

    try {
      const prompt = `
        Parse the following voice input and extract expense information. Return a JSON object with the following structure:
        {
          "amount": number (extract numeric amount, if not found return null),
          "category": string (choose from: "Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other" - if not clear, choose "Other"),
          "description": string (brief description of the expense),
          "date": string (if mentioned, format as YYYY-MM-DD, otherwise return today's date: "${new Date().toISOString().split('T')[0]}")
        }

        Voice input: "${transcript}"

        Rules:
        1. Only return valid JSON, no additional text
        2. If amount is not clear, set it to null
        3. Always provide a description based on the input
        4. Choose the most appropriate category
        5. If date is not mentioned, use today's date

        Example inputs and outputs:
        Input: "I spent 25 dollars on lunch today"
        Output: {"amount": 25, "category": "Food & Dining", "description": "lunch", "date": "${new Date().toISOString().split('T')[0]}"}

        Input: "bought coffee for 5 bucks"
        Output: {"amount": 5, "category": "Food & Dining", "description": "coffee", "date": "${new Date().toISOString().split('T')[0]}"}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse the JSON response
      try {
        const parsedData = JSON.parse(text.trim());
        
        // Validate the parsed data
        if (typeof parsedData === 'object' && parsedData !== null) {
          return {
            success: true,
            data: {
              amount: parsedData.amount ? Number(parsedData.amount) : undefined,
              category: parsedData.category || 'Other',
              description: parsedData.description || transcript,
              date: parsedData.date || new Date().toISOString().split('T')[0]
            }
          };
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract information manually
        return this.fallbackParsing(transcript);
      }
    } catch (error) {
      console.error('Gemini AI error:', error);
      return {
        success: false,
        error: `Failed to process voice input: ${error}`
      };
    }
  }

  private fallbackParsing(transcript: string): GeminiResponse {
    // Simple fallback parsing logic
    const lowerText = transcript.toLowerCase();
    
    // Try to extract amount using regex
    const amountMatch = lowerText.match(/(\d+(?:\.\d{2})?)\s*(?:dollars?|bucks?|\$|usd)?/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

    // Simple category detection
    let category = 'Other';
    if (lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') || 
        lowerText.includes('breakfast') || lowerText.includes('coffee') || lowerText.includes('restaurant')) {
      category = 'Food & Dining';
    } else if (lowerText.includes('gas') || lowerText.includes('uber') || lowerText.includes('taxi') || 
               lowerText.includes('bus') || lowerText.includes('train')) {
      category = 'Transportation';
    } else if (lowerText.includes('shopping') || lowerText.includes('clothes') || lowerText.includes('buy')) {
      category = 'Shopping';
    } else if (lowerText.includes('movie') || lowerText.includes('game') || lowerText.includes('entertainment')) {
      category = 'Entertainment';
    }

    return {
      success: true,
      data: {
        amount,
        category,
        description: transcript,
        date: new Date().toISOString().split('T')[0]
      }
    };
  }
  isInitialized(): boolean {
    return this.model !== null;
  }

  async parseBudgetFromText(transcript: string): Promise<{
    success: boolean;
    data?: {
      title?: string;
      type?: 'Trip' | 'Event';
      items?: Array<{
        name: string;
        category: string;
        planned: number;
        notes?: string;
      }>;
    };
    error?: string;
  }> {
    if (!this.model) {
      return {
        success: false,
        error: 'Gemini AI not initialized. Please set your API key.'
      };
    }

    try {
      const prompt = `
        Parse the following voice input and extract budget/event information. Return a JSON object with the following structure:
        {
          "title": string (event/trip name, if not found return "Voice Budget"),
          "type": string ("Trip" or "Event" - determine from context),
          "items": [
            {
              "name": string (item name),
              "category": string (choose from: "Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other"),
              "planned": number (estimated cost),
              "notes": string (optional additional info)
            }
          ]
        }

        Voice input: "${transcript}"

        Rules:
        1. Only return valid JSON, no additional text
        2. Extract multiple budget items if mentioned
        3. If it's about a trip/vacation, set type to "Trip", otherwise "Event"
        4. Estimate reasonable costs if amounts not specified
        5. Group similar items together

        Example inputs and outputs:
        Input: "Plan a weekend trip to Paris, need hotel for 200, food budget 150, and transportation 100"
        Output: {"title": "Weekend Trip to Paris", "type": "Trip", "items": [{"name": "Hotel", "category": "Travel", "planned": 200, "notes": "weekend stay"}, {"name": "Food", "category": "Food & Dining", "planned": 150, "notes": "dining budget"}, {"name": "Transportation", "category": "Transportation", "planned": 100, "notes": "travel costs"}]}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const parsedData = JSON.parse(text.trim());
        
        if (typeof parsedData === 'object' && parsedData !== null) {
          return {
            success: true,
            data: {
              title: parsedData.title || 'Voice Budget',
              type: parsedData.type === 'Trip' ? 'Trip' : 'Event',
              items: Array.isArray(parsedData.items) ? parsedData.items.map((item: any) => ({
                name: item.name || 'Budget Item',
                category: item.category || 'Other',
                planned: Number(item.planned) || 0,
                notes: item.notes || ''
              })) : []
            }
          };
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        return this.fallbackBudgetParsing(transcript);
      }
    } catch (error) {
      console.error('Gemini AI error:', error);
      return {
        success: false,
        error: `Failed to process voice input: ${error}`
      };
    }
  }

  private fallbackBudgetParsing(transcript: string): {
    success: boolean;
    data?: {
      title?: string;
      type?: 'Trip' | 'Event';
      items?: Array<{
        name: string;
        category: string;
        planned: number;
        notes?: string;
      }>;
    };
    error?: string;
  } {
    const lowerText = transcript.toLowerCase();
    
    // Determine type
    const isTrip = lowerText.includes('trip') || lowerText.includes('vacation') || 
                   lowerText.includes('travel') || lowerText.includes('visit');
    
    // Extract title
    const title = isTrip ? 'Voice Trip Budget' : 'Voice Event Budget';
    
    // Try to extract amounts and items
    const items: Array<{name: string; category: string; planned: number; notes?: string}> = [];
    
    // Simple pattern matching for common budget items
    const patterns = [
      { pattern: /hotel|accommodation|stay/i, category: 'Travel', name: 'Hotel' },
      { pattern: /food|restaurant|dining|meal/i, category: 'Food & Dining', name: 'Food' },
      { pattern: /transport|flight|bus|train|taxi|uber/i, category: 'Transportation', name: 'Transportation' },
      { pattern: /entertainment|show|movie|activity/i, category: 'Entertainment', name: 'Entertainment' }
    ];
    
    patterns.forEach(({ pattern, category, name }) => {
      if (pattern.test(transcript)) {
        const amountMatch = transcript.match(new RegExp(`${pattern.source}.*?(\\d+)`, 'i'));
        const amount = amountMatch ? parseInt(amountMatch[1]) : 50; // Default amount
        items.push({
          name,
          category,
          planned: amount,
          notes: 'From voice input'
        });
      }
    });
    
    // If no specific items found, create a general budget item
    if (items.length === 0) {
      const generalAmount = transcript.match(/(\d+)/);
      items.push({
        name: 'Budget Item',
        category: 'Other',
        planned: generalAmount ? parseInt(generalAmount[1]) : 100,
        notes: transcript
      });
    }

    return {
      success: true,
      data: {
        title,
        type: isTrip ? 'Trip' : 'Event',
        items
      }
    };
  }
}

export const geminiService = new GeminiService();
