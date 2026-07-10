import type { MagicAttribute } from "@/types/grimoire";

interface AttributeGlyphProps {
  attribute: MagicAttribute;
  size?: number;
  className?: string;
}

/** Original abstract glyphs for each Magic Attribute — simple line icons, no borrowed artwork. */
function GlyphPath({ attribute }: { attribute: MagicAttribute }) {
  switch (attribute) {
    case "Anti Magic":
      // a broad, blunt greatsword — magic-cutting steel
      return (
        <>
          <path d="M12 2 14.5 4.5v10L12 17l-2.5-2.5v-10L12 2Z" />
          <path d="M7.5 17h9" />
          <path d="M12 17v5" />
        </>
      );
    case "Lightning Magic":
      return <path d="M13 2 4 14h6l-2 8 9-12h-6l2-8Z" />;
    case "Time Magic":
      return (
        <>
          <circle cx="12" cy="13" r="7" />
          <path d="M12 9v4l3 2" />
          <path d="M9 2h6M10 2v2M14 2v2" />
        </>
      );
    case "Steel Magic":
      return <path d="M12 2 4 5v6c0 5 3.4 8.7 8 9.9 4.6-1.2 8-4.9 8-9.9V5l-8-3Z" />;
    case "Wind Magic":
      return (
        <>
          <path d="M3 8h11a3 3 0 1 0-3-3" />
          <path d="M3 13h15a3 3 0 1 1-3 3" />
          <path d="M3 18h8a2.5 2.5 0 1 0-2.5-2.5" />
        </>
      );
    case "Spatial Magic":
      return (
        <>
          <path d="M12 2 21 7v10L12 22 3 17V7Z" />
          <path d="M3 7l9 5 9-5M12 12v10" />
        </>
      );
    case "Earth Magic":
      return <path d="M3 20 9 6l4 8 3-5 5 11Z" />;
    case "Dark Magic":
      return <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />;
    case "Dream Magic":
      return (
        <>
          <path d="M7 17a4.5 4.5 0 0 1-1-8.9 5.5 5.5 0 0 1 10.6-2A4.5 4.5 0 0 1 17 17H7Z" />
          <path d="M12 4v-.5M16.5 6l.5-.5M7.5 6 7 5.5" />
        </>
      );
    case "Creation Magic":
      return (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </>
      );
    case "Water Magic":
      return <path d="M12 2c4 5.5 7 9.4 7 12.8A7 7 0 1 1 5 14.8C5 11.4 8 7.5 12 2Z" />;
    case "Flame Magic":
      return <path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c1 1 2 2.5 2 4.5A5 5 0 0 1 7 15c0-5 4-8 5-13Z" />;
    case "World Tree Magic":
      return (
        <>
          <path d="M12 22V12" />
          <path d="M12 12 6 6M12 12l6-6M12 8 8 4M12 8l4-4" />
          <path d="M8 22h8" />
        </>
      );
  }
}

export function AttributeGlyph({ attribute, size = 24, className }: AttributeGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <GlyphPath attribute={attribute} />
    </svg>
  );
}
