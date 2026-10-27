import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #050b14 0%, #083344 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5ff',
          borderRadius: 8,
          border: '1px solid rgba(0, 229, 255, 0.5)',
        }}
      >
        🎭
      </div>
    ),
    {
      ...size,
    }
  );
}
