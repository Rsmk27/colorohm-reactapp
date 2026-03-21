# ColorOhm Mobile (Expo + React Native)

ColorOhm is a dark-themed resistor color code calculator for Android/iOS built with Expo, TypeScript, NativeWind, Reanimated, and Expo Router.

## Features

- Decode: resistor band colors to resistance value
- Encode: resistance value to resistor bands (4/5 band)
- Full reference chart (digit, multiplier, tolerance, ppm)
- Sticky reference table header row
- Haptics on key interactions
- Animated resistor visual and band transitions
- Copy and share results

## Tech Stack

- Expo SDK 51+
- React Native + TypeScript
- Expo Router
- NativeWind (Tailwind for RN)
- Reanimated + Gesture Handler
- @gorhom/bottom-sheet

## Setup

```bash
npm install
npx expo start
```

Run on device/emulator:

- Android: press a in Expo CLI or run npm run android
- iOS: run npm run ios (macOS required for simulator)

## Tests

```bash
npm run test
```

The test suite validates:

- Decode logic in utils/resistorCalc.ts
- Encode logic in utils/encodeResistor.ts
- Resistance formatting in utils/formatResistance.ts

## Branding Assets

Branded assets are generated in assets/ using the script below:

```bash
node scripts/generate-assets.mjs
```

This writes icon, splash image, adaptive icon layers, and favicon in the dark + amber ColorOhm visual style.

## Structure

- app/(tabs)/decode.tsx: Color -> Value calculator
- app/(tabs)/encode.tsx: Value -> Color encoder
- app/(tabs)/reference.tsx: Color chart and reading guide
- app/(tabs)/about.tsx: About and links
- components/: shared UI components
- constants/: theme and resistor band metadata
- utils/: decode/encode/format logic
- tests/: unit tests for core calculations

## Branding Notes

The app is hard-locked to dark mode and uses ColorOhm amber accent styling for cards, actions, and highlights.
