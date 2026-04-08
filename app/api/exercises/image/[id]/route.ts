import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Falta la API Key en el servidor' }, { status: 500 });
  }

  try {
    // Official ExerciseDB Image Streaming Endpoint
    const url = `https://exercisedb.p.rapidapi.com/image?exerciseId=${id}&resolution=360`;
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey.replace(/[\r\n]/g, ''),
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error(`ExerciseDB Image Proxy Error: ${response.status} ${response.statusText}`);
      return new NextResponse(null, { status: response.status });
    }

    // Stream the GIF back to the client
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      }
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return new NextResponse(null, { status: 500 });
  }
}
