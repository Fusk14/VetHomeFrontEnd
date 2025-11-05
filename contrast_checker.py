from colors_accessibility.color import Color
from colors_accessibility.accessibility_processor import AccessibilityProcessor
import sys

def check_contrast(color1_hex, color2_hex):
    try:
        color1 = Color(hex_value=color1_hex)
        color2 = Color(hex_value=color2_hex)

        processor = AccessibilityProcessor(color1, color2)

        contrast_ratio = processor.contrast_ratio()
        aa_large = processor.is_aa_level_large_text()
        aa_normal = processor.is_aa_level_normal_text()
        aaa_large = processor.is_aaa_level_large_text()
        aaa_normal = processor.is_aaa_level_normal_text()

        print(f"Color 1 (Foreground): {color1_hex}")
        print(f"Color 2 (Background): {color2_hex}")
        print(f"Contrast Ratio: {contrast_ratio:.2f}:1")
        print(f"WCAG 2.1 AA Large Text: {'Pass' if aa_large else 'Fail'}")
        print(f"WCAG 2.1 AA Normal Text: {'Pass' if aa_normal else 'Fail'}")
        print(f"WCAG 2.1 AAA Large Text: {'Pass' if aaa_large else 'Fail'}")
        print(f"WCAG 2.1 AAA Normal Text: {'Pass' if aaa_normal else 'Fail'}")

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        print("Please provide valid hex color codes (e.g., #RRGGBB or RRGGBB).", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python contrast_checker.py <hex_color1> <hex_color2>", file=sys.stderr)
        sys.exit(1)
    
    color1_hex = sys.argv[1]
    color2_hex = sys.argv[2]
    check_contrast(color1_hex, color2_hex)
