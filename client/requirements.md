## Packages
react-markdown | Rendering formatted chat responses from AI
framer-motion | Smooth message entry animations and UI transitions
date-fns | Formatting timestamps for chat messages
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

Integration assumptions:
- Auth is handled via Replit Auth (/api/login, /api/logout)
- Images/Avatars use initials or generic icons
- NDA downloads will use browser native features (Print to PDF) or simple text blobs
