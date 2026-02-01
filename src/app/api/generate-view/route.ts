import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { generateProductView } from '@/lib/ai';
import type { ViewType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, viewType } = body as {
      productId: string;
      viewType: ViewType;
    };

    // Validate input
    if (!productId || !viewType) {
      return NextResponse.json(
        { success: false, error: 'Missing productId or viewType' },
        { status: 400 }
      );
    }

    // Get product
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate view type
    const validViewTypes: ViewType[] = ['front', 'side', 'angle-45', 'in-room', 'detail', 'top'];
    if (!validViewTypes.includes(viewType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid view type' },
        { status: 400 }
      );
    }

    // Generate the view
    const result = await generateProductView(product, viewType);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
