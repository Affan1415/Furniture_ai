import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  Product,
  ViewType,
  ViewConfig,
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationOptions,
} from '@/types';

// View configurations with prompt modifiers
export const VIEW_CONFIGS: Record<ViewType, ViewConfig> = {
  front: {
    type: 'front',
    label: 'Front View',
    description: 'Direct front-facing view',
    promptModifier: 'straight-on front view, centered composition',
  },
  side: {
    type: 'side',
    label: 'Side View',
    description: 'Profile side view',
    promptModifier: 'profile side view, showing depth and proportions',
  },
  'angle-45': {
    type: 'angle-45',
    label: '45° Angle',
    description: 'Three-quarter angle view',
    promptModifier: '45-degree angle view, three-quarter perspective showing form and depth',
  },
  'in-room': {
    type: 'in-room',
    label: 'In Room',
    description: 'Lifestyle context view',
    promptModifier: 'placed in a modern, well-lit living space with complementary decor',
  },
  detail: {
    type: 'detail',
    label: 'Detail',
    description: 'Close-up material detail',
    promptModifier: 'close-up detail shot showcasing material texture and craftsmanship',
  },
  top: {
    type: 'top',
    label: 'Top View',
    description: 'Bird\'s eye view',
    promptModifier: 'top-down birds eye view, showing overall shape and footprint',
  },
};

/**
 * Generates a parameterized prompt for AI image generation
 * This is the core prompt engineering function
 */
export function generatePrompt(
  product: Product,
  viewType: ViewType,
  options: AIGenerationOptions = {}
): string {
  const viewConfig = VIEW_CONFIGS[viewType];
  const { lighting = 'studio', background = 'minimal', quality = 'high' } = options;

  const lightingDescriptions: Record<string, string> = {
    studio: 'professional studio lighting with soft shadows',
    natural: 'natural daylight with gentle ambient illumination',
    dramatic: 'dramatic directional lighting with defined shadows',
    soft: 'soft diffused lighting with minimal shadows',
  };

  const backgroundDescriptions: Record<string, string> = {
    minimal: 'clean, minimal white/light gray background',
    white: 'pure white seamless background',
    room: 'modern interior room setting with neutral walls',
    lifestyle: 'styled lifestyle setting with complementary furniture and decor',
  };

  const qualityModifiers: Record<string, string> = {
    standard: '4K resolution',
    high: '8K resolution, highly detailed',
    ultra: '8K resolution, photorealistic, ultra-detailed, ray-traced lighting',
  };

  // Build the comprehensive prompt
  const prompt = `
Generate a high-quality, photorealistic ${viewConfig.label.toLowerCase()} of this furniture piece.

PRODUCT DETAILS:
- Name: ${product.name}
- Category: ${product.category}
- Material: ${product.material || 'as shown in reference image'}
- Dimensions: ${product.dimensions || 'maintain original proportions'}

VIEW SPECIFICATIONS:
${viewConfig.promptModifier}

VISUAL REQUIREMENTS:
- Lighting: ${lightingDescriptions[lighting]}
- Background: ${viewType === 'in-room' ? backgroundDescriptions.lifestyle : backgroundDescriptions[background]}
- Quality: ${qualityModifiers[quality]}

CRITICAL PRESERVATION:
- Maintain exact material textures and finishes from the reference
- Preserve precise color accuracy and tones
- Keep proportions and dimensions accurate
- Ensure realistic shadows and reflections
- Match the design language and style exactly

OUTPUT:
Photorealistic product photography quality, suitable for e-commerce and marketing materials.
`.trim();

  return prompt;
}

/**
 * AI Service Class for image generation
 * Abstraction layer for Gemini or other vision models
 */
class AIService {
  private client: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-2.0-flash-exp'; // Supports image generation

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return this.client !== null;
  }

  /**
   * Generate a new view of a product using AI
   */
  async generateView(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const { product, viewType, options = {} } = request;
    const startTime = Date.now();

    // Generate the prompt
    const prompt = generatePrompt(product, viewType, options);

    // If no API key, return mock data for development
    if (!this.client) {
      return this.getMockResponse(product, viewType, prompt, startTime);
    }

    try {
      const model = this.client.getGenerativeModel({ model: this.modelName });

      // For image generation, we would use Imagen or similar
      // Gemini Vision can understand images but generation requires specific models
      // This shows the integration pattern - actual generation would use Imagen API

      // Fetch and encode the base image
      const imageResponse = await fetch(product.baseImage);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mimeType = 'image/jpeg';

      // Use Gemini to analyze and guide generation
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        prompt,
      ]);

      const response = await result.response;
      // The response text contains AI analysis - log for debugging
      console.log('AI analysis:', response.text());

      // In production, this would call an image generation API
      // and return the generated image URL
      return {
        success: true,
        imageUrl: product.baseImage, // Placeholder - would be generated image
        metadata: {
          model: this.modelName,
          generationTime: Date.now() - startTime,
          promptUsed: prompt,
        },
      };
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate all standard views for a product
   */
  async generateAllViews(
    product: Product,
    views: ViewType[] = ['front', 'side', 'angle-45', 'in-room']
  ): Promise<Map<ViewType, AIGenerationResponse>> {
    const results = new Map<ViewType, AIGenerationResponse>();

    // Generate views in parallel for efficiency
    const promises = views.map(async (viewType) => {
      const response = await this.generateView({ product, viewType });
      return { viewType, response };
    });

    const responses = await Promise.all(promises);
    responses.forEach(({ viewType, response }) => {
      results.set(viewType, response);
    });

    return results;
  }

  /**
   * Mock response for development without API key
   */
  private getMockResponse(
    product: Product,
    viewType: ViewType,
    prompt: string,
    startTime: number
  ): AIGenerationResponse {
    // Simulate API delay
    const mockDelay = Math.random() * 500 + 200;

    return {
      success: true,
      imageUrl: product.baseImage, // Use base image as placeholder
      metadata: {
        model: 'mock-model',
        generationTime: Date.now() - startTime + mockDelay,
        promptUsed: prompt,
      },
    };
  }
}

// Singleton instance
export const aiService = new AIService();

/**
 * Server action for generating views
 * Can be called from client components
 */
export async function generateProductView(
  product: Product,
  viewType: ViewType,
  options?: AIGenerationOptions
): Promise<AIGenerationResponse> {
  return aiService.generateView({ product, viewType, options });
}

/**
 * Batch generate views for multiple products
 * Useful for pre-generating catalog views
 */
export async function batchGenerateViews(
  products: Product[],
  views: ViewType[] = ['front', 'side', 'angle-45', 'in-room']
): Promise<Map<string, Map<ViewType, AIGenerationResponse>>> {
  const results = new Map<string, Map<ViewType, AIGenerationResponse>>();

  // Process products sequentially to avoid rate limits
  for (const product of products) {
    const productViews = await aiService.generateAllViews(product, views);
    results.set(product.id, productViews);
  }

  return results;
}
