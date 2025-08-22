<!-- @format -->

# Screens Directory

This directory contains all the screen components for the application. Screens are the top-level components that represent entire pages or views in the application.

## Structure

- **LandingScreen**: The main landing/home page of the application
- **ProductDetailsScreen**: The product details page showing individual product information

## Architecture

The project follows a screen-based architecture where:

- **Screens** (`/screens`): Top-level page components that compose the UI
- **Components** (`/components`): Reusable UI components organized by atomic design principles
- **Contexts** (`/contexts`): React context providers for state management
- **Data** (`/data`): Static data and API functions
- **Types** (`/types`): TypeScript type definitions

## Benefits of Screen-Based Architecture

1. **Clear Separation**: Screens handle page-level logic while components focus on reusability
2. **Easier Navigation**: Each screen represents a distinct route/view
3. **Better Organization**: Related functionality is grouped together
4. **Scalability**: Easy to add new screens without affecting existing components
5. **Testing**: Screens can be tested independently from reusable components

## Adding New Screens

To add a new screen:

1. Create a new directory in `/screens` with the screen name
2. Create the main component file (e.g., `NewScreen.tsx`)
3. Export it from `/screens/index.ts`
4. Add the route in `App.tsx`
5. Import and use any needed components from `/components`
