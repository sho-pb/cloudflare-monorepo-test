export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ status: process.env.NEXT_PUBLIC_TEST || '悲報' });
}
