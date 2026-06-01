/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className = "h-12", light = false }: LogoProps) {
  const primaryColor = light ? "#fdfaf6" : "#2e7d32"; // Elegant organic leaf green
  const accentColor = light ? "#8fbc94" : "#1b5e20";  // Darker shade of green for contrast
  const textColor = light ? "#fdfaf6" : "#1a1a1a";     // Black / Charcoal for "NATURAL PRODUCTS"

  return (
    <div className={`inline-flex flex-col items-center select-none justify-center ${className}`}>
      <svg
        viewBox="0 0 340 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Elegant Twin Leaf Icon sits beautifully on top of the 'IZA' */}
        <g transform="translate(192, 10)">
          {/* Light green leaf on the left */}
          <path
            d="M5 25C12 12 25 5 25 5C25 5 18 19 8 28C5 25 5 25 5 25Z"
            fill={light ? "#8fbc94" : "#81c784"}
          />
          <path
            d="M5 25C15 15 32 8 32 8C32 8 22 25 8 32C6 30 5 25 5 25Z"
            fill={light ? "#a5d6a7" : "#4caf50"}
            opacity="0.85"
          />
          
          {/* Darker green leaf on the right */}
          <path
            d="M3 26C-3 16 -2 3 -2 3C-2 3 6 12 11 22C7 25 3 26 3 26Z"
            fill={accentColor}
          />
          <path
            d="M3 26C-5 13 -13 5 -13 5C-13 5 -4 18 5 25C5 25 3 26 3 26Z"
            fill={primaryColor}
          />
        </g>

        {/* Text Area for RAYIZA'S */}
        <text
          x="12"
          y="78"
          fill={primaryColor}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: "900",
            fontSize: "66px",
            letterSpacing: "0.06em",
          }}
        >
          RAYIZA’S
        </text>

        {/* Text Area for NATURAL PRODUCTS */}
        <text
          x="94"
          y="104"
          fill={textColor}
          style={{
            fontFamily: "'Quicksand', 'Inter', sans-serif",
            fontWeight: "800",
            fontSize: "14.5px",
            letterSpacing: "0.22em",
          }}
        >
          NATURAL PRODUCTS
        </text>
      </svg>
    </div>
  );
}
