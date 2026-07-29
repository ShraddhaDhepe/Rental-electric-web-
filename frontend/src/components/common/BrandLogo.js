import React from 'react'

// Full horizontal logo — shows RE icon badge only (no text)
export const BrandLogo = ({ size = 'md', showTagline = false }) => {
  const scales = { sm: 0.65, md: 1, lg: 1.4 }
  const s = scales[size] || 1
  const fontSize = Math.round(18 * s)
  const boxH = Math.round(44 * s)
  const boxW = Math.round(56 * s)

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
      {/* RE badge */}
      <div style={{
        width: boxW,
        height: boxH,
        background: '#E8201A',
        borderRadius: Math.round(8 * s),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(232,32,26,0.35)',
        gap: 0,
        letterSpacing: '-2px'
      }}>
        <span style={{
          fontFamily: '"Arial Black", Arial, sans-serif',
          fontWeight: 900,
          fontSize: fontSize,
          color: 'white',
          lineHeight: 1,
          letterSpacing: 0
        }}>R</span>
        <span style={{
          fontFamily: '"Arial Black", Arial, sans-serif',
          fontWeight: 900,
          fontSize: fontSize,
          color: '#FFD700',
          lineHeight: 1,
          letterSpacing: 0
        }}>E</span>
      </div>

      {showTagline && (
        <div style={{
          fontFamily: 'Arial, sans-serif',
          fontWeight: 400,
          fontSize: Math.round(9 * s),
          color: '#444',
          letterSpacing: Math.round(2 * s),
          marginTop: Math.round(4 * s),
          alignSelf: 'center'
        }}>
          RENT SMART. OWN LESS.
        </div>
      )}
    </div>
  )
}

// Inline RE icon — for small spaces
export const BrandIcon = ({ size = 32 }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'baseline',
    lineHeight: 1
  }}>
    <span style={{
      fontFamily: '"Arial Black", Arial, sans-serif',
      fontWeight: 900,
      fontSize: size,
      color: '#E8201A',
      lineHeight: 1
    }}>R</span>
    <span style={{
      fontFamily: '"Arial Black", Arial, sans-serif',
      fontWeight: 900,
      fontSize: size,
      color: '#FFD700',
      lineHeight: 1,
    }}>E</span>
  </div>
)

export default BrandLogo
