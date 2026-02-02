import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const XAI_CHAT_BASE = 'https://api.x.ai/v1';

const FURNITURE_DESCRIPTION_PROMPT = `You are describing a furniture piece so an image model can draw it exactly in another image. Look at this image and describe ONLY what you see. Be very specific:
- Exact type (e.g. "gray fabric 3-seater L-shaped sectional sofa", "oak wood coffee table with four legs", "white bookshelf with 5 shelves").
- Exact colors (e.g. "navy blue", "light oak", "matte black").
- Material and finish (e.g. fabric/leather/wood/metal, glossy/matte).
- Shape, proportions, and any distinctive details (armrests, legs, drawers, cushions).
- Style if clear (modern, mid-century, rustic, etc.).
Output ONLY this description. No preamble. The image model will add this exact piece to a room—so the description must be precise enough to draw it correctly.`;

function buildEditPrompt(furnitureDescription: string): string {
  return `TASK: Add ONE piece of furniture to the room in this image. The furniture you add MUST be exactly as described below—no other furniture, no generic or random items.

FURNITURE TO ADD (add only this, and make it look exactly like this description):
${furnitureDescription}

RULES: Keep the room exactly as it is. Do not change the room. Place the described furniture naturally on the floor in a sensible spot. The added furniture must look exactly like the description above—same type, same colors, same style. Do not add a different piece of furniture. No floating, no clipping.`;
}

function validateImageFile(file: File, fieldName: string): { ok: true } | { ok: false; error: string } {
  if (!file.size) {
    return { ok: false, error: `${fieldName} is empty.` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: `${fieldName} must be 10MB or less.` };
  }
  const type = file.type?.toLowerCase();
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return { ok: false, error: `${fieldName} must be PNG, JPG, JPEG, or WEBP.` };
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'XAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const furnitureProductId = formData.get('furnitureProductId') as string | null;
    const roomImage = formData.get('roomImage') as File | null;

    if (!roomImage) {
      return NextResponse.json(
        { success: false, error: 'Room image is required.' },
        { status: 400 }
      );
    }

    if (!furnitureProductId?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please select a furniture piece from our collection.' },
        { status: 400 }
      );
    }

    const product = getProduct(furnitureProductId.trim());
    if (!product?.baseImage) {
      return NextResponse.json(
        { success: false, error: 'Selected furniture is not available.' },
        { status: 400 }
      );
    }

    const roomValidation = validateImageFile(roomImage, 'Room image');
    if (!roomValidation.ok) {
      return NextResponse.json(
        { success: false, error: roomValidation.error },
        { status: 400 }
      );
    }

    // Fetch furniture image from product's baseImage URL
    const furnitureRes = await fetch(product.baseImage);
    if (!furnitureRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not load the selected furniture image.' },
        { status: 400 }
      );
    }
    const furnitureBuffer = await furnitureRes.arrayBuffer();
    const furnitureContentType = furnitureRes.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg';
    const furnitureB64 = Buffer.from(furnitureBuffer).toString('base64');
    const furnitureDataUrl = `data:${furnitureContentType};base64,${furnitureB64}`;

    const roomBuffer = await roomImage.arrayBuffer();
    const roomType = roomImage.type || 'image/jpeg';
    const roomB64 = Buffer.from(roomBuffer).toString('base64');
    const roomDataUrl = `data:${roomType};base64,${roomB64}`;

    // Step 1: Describe the furniture from the user's furniture image
    const chatRes = await fetch(`${XAI_CHAT_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4',
        stream: false,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: FURNITURE_DESCRIPTION_PROMPT },
              { type: 'image_url', image_url: { url: furnitureDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      console.error('xAI chat error:', chatRes.status, errText);
      let message = `Furniture description failed: ${chatRes.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) message = errJson.error.message;
      } catch {
        // use default
      }
      return NextResponse.json(
        { success: false, error: message },
        { status: 502 }
      );
    }

    const chatData = (await chatRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const furnitureDescription =
      chatData.choices?.[0]?.message?.content?.trim() ||
      'The furniture piece from the user image';

    // Step 2: Edit ONLY the user's ROOM image — add furniture into it (xAI edit accepts one image)
    // Sending the room as the single image forces the output to be based on THEIR room, not random
    const editRes = await fetch(`${XAI_CHAT_BASE}/images/edits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-imagine-image',
        image: { url: roomDataUrl },
        prompt: buildEditPrompt(furnitureDescription),
      }),
    });

    if (!editRes.ok) {
      const errText = await editRes.text();
      console.error('xAI image edit error:', editRes.status, errText);
      let message = `Image generation failed: ${editRes.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) message = errJson.error.message;
      } catch {
        // use default
      }
      return NextResponse.json(
        { success: false, error: message },
        { status: 502 }
      );
    }

    const editResult = (await editRes.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };

    const first = editResult.data?.[0];
    if (!first) {
      return NextResponse.json(
        { success: false, error: 'No image was generated.' },
        { status: 502 }
      );
    }

    const base64 = first.b64_json;
    const url = first.url;
    const mimeType = 'image/png';

    if (base64) {
      return NextResponse.json({
        success: true,
        image: base64,
        mimeType,
        dataUrl: `data:${mimeType};base64,${base64}`,
        url: url ?? undefined,
      });
    }

    if (url) {
      return NextResponse.json({
        success: true,
        url,
        dataUrl: url,
        mimeType,
      });
    }

    return NextResponse.json(
      { success: false, error: 'No image data or URL in response.' },
      { status: 502 }
    );
  } catch (error) {
    console.error('Visualize-furniture API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
