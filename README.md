<!-- @format -->

# Wearlo

A modern e-commerce frontend application built with React, TypeScript, and Tailwind CSS.

## Architecture

This project follows a **screen-based architecture** that provides clear separation between page-level components and reusable UI components.

### Directory Structure

```
src/
├── screens/           # Screen components (pages/views)
│   ├── LandingScreen/
│   ├── ProductDetailsScreen/
│   └── index.ts
├── components/        # Reusable UI components
│   ├── atoms/        # Basic building blocks (Button, Typography, Icon)
│   ├── molecules/    # Simple component combinations
│   ├── organisms/    # Complex component combinations
│   └── templates/    # Layout templates
├── contexts/         # React context providers
├── data/            # Static data and API functions
├── types/           # TypeScript type definitions
└── App.tsx          # Main application component
```

### Key Benefits

- **Screens**: Handle page-level logic and composition
- **Components**: Focus on reusability and maintainability
- **Clear Separation**: Easy to understand what belongs where
- **Scalability**: Simple to add new screens and features

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React Icons
