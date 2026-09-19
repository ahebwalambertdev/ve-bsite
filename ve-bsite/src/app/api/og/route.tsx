import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic Open Graph Image Generator (§20.2)
 * Renders high-contrast 1200x630px social cards in the official 4-tone palette.
 * Supports ?title= and ?category= search params.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Fashion, Found in Kampala';
    const category = searchParams.get('category') || 'Verified Fashion Marketplace';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FFFAF6', // snow
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: '#252525', // carbon-black
                  letterSpacing: '-2px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Ve
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#7C8B74', // dusty-olive
                  backgroundColor: '#DDE3D8', // soft-linen
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {category}
              </div>
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#252525',
                opacity: 0.6,
              }}
            >
              ve.ug
            </div>
          </div>

          {/* Main Title Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '900px',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#252525',
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer Ribbon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #DDE3D8',
              paddingTop: '32px',
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: '#252525',
                opacity: 0.75,
              }}
            >
              Try-On on Your Phone · Protected Payments · Fast Doorstep Delivery
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#7C8B74',
                letterSpacing: '0.5px',
              }}
            >
              Kampala, Uganda
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
