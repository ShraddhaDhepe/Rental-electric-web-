import React from 'react'

// Full horizontal logo — use in navbar, footer, auth pages
export const BrandLogo = ({ size = 'md', showTagline = false }) => {
  const scales = { sm: 0.65, md: 1, lg: 1.4 }
  const s = scales[size] || 1

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
      {/* RE icon + brand name on one row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(6 * s) }}>
        {/* RE icon */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          lineHeight: 1,
          letterSpacing: '-2px'
        }}>
          <span style={{
            fontFamily: '"Arial Black", Arial, sans-serif',
            fontWeight: 900,
            fontSize: Math.round(36 * s),
            color: '#E8201A',
            lineHeight: 1
          }}>R</span>
          <span style={{
            fontFamily: '"Arial Black", Arial, sans-serif',
            fontWeight: 900,
            fontSize: Math.round(36 * s),
            color: '#F5B800',
            lineHeight: 1,
            marginLeft: Math.round(-4 * s)
          }}>E</span>
        </div>

        {/* Brand text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 800,
              fontSize: Math.round(18 * s),
              color: '#E8201A',
              letterSpacing: '-0.3px'
            }}>rents</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 800,
              fontSize: Math.round(18 * s),
              color: '#F5B800',
              letterSpacing: '-0.3px'
            }}>electronics</span>
            <span style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 800,
              fontSize: Math.round(13 * s),
              color: '#E8201A',
              letterSpacing: '-0.2px'
            }}>.com</span>
          </div>
          {/* Red underline */}
          <div style={{
            height: Math.round(2 * s),
            background: '#E8201A',
            borderRadius: 1,
            marginTop: Math.round(1 * s)
          }} />
        </div>
      </div>

      {/* Tagline */}
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

// Square RE icon only — for small spaces / favicon reference
export const BrandIcon = ({ size = 32 }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'baseline',
    letterSpacing: '-2px',
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
      color: '#F5B800',
      lineHeight: 1,
      marginLeft: size * -0.1
    }}>E</span>
  </div>
)

export default BrandLogo
