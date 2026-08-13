import './Icon.css';
import { ICONS } from './icons';

/**
 * Shared line-art icon.
 *
 * variant="badge" (default) — white rounded-square card with a gold border,
 * matching the reference icon pack. Use for feature/category/service icons.
 * variant="bare" — just the stroked glyph, no card. Use inline with text
 * (contact rows, small list bullets, etc).
 */
export default function Icon({ name, variant = 'badge', size, className = '', style }) {
    const glyph = ICONS[name];
    if (!glyph) return null;

    const mergedStyle = size ? { width: size, height: size, ...style } : style;

    const svg = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {glyph}
        </svg>
    );

    if (variant === 'bare') {
        return (
            <span className={`icon-glyph ${className}`} style={mergedStyle}>
                {svg}
            </span>
        );
    }

    return (
        <span className={`icon-badge ${className}`} style={mergedStyle}>
            <span className="icon-glyph">{svg}</span>
        </span>
    );
}
