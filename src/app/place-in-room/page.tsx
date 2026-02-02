import { PlaceInRoomForm } from '@/components';

export const metadata = {
  title: 'Place in Room',
  description:
    'Select a furniture piece from our collection and upload a room image. AI will generate a photorealistic scene showing how the furniture looks in your space.',
};

export default function PlaceInRoomPage() {
  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-stone-900">
            Place furniture in your room
          </h1>
          <p className="mt-3 text-lg text-stone-600">
            Choose a furniture piece from our collection and upload a photo of your room or space.
            Our AI will generate a single photorealistic image (1024×1024) showing
            how the furniture would look in your space—with natural placement,
            lighting, and perspective.
          </p>
        </div>
        <PlaceInRoomForm />
      </div>
    </div>
  );
}
