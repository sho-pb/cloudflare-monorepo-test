export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('logging from api/status/route.ts');

  return Response.json({ status: process.env.NEXT_PUBLIC_TEST || '悲報' });
}
