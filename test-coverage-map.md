# Test Coverage Map

This document maps test scenarios to their implementations in the test suite.

## Smoke Tests
All smoke tests are implemented in `tests/smoke/smoke.spec.js`

## Elements Page Tests
- **Text Box Tests**: `tests/elements.spec.js`
  - Submit Form: `should submit text box form with valid data @smoke`
  - Validation: `should validate form fields @regression`

- **Check Box Tests**: `tests/elements.spec.js`
  - Tree Structure: `should handle check box tree structure @regression`

- **Radio Button Tests**: `tests/elements.spec.js`
  - Selection: `should handle radio button selection @smoke`

- **Web Tables Tests**: `tests/elements.spec.js`
  - CRUD Operations: `should perform CRUD operations on web table @regression`

- **Buttons Tests**: `tests/elements.spec.js`
  - Click Types: `should handle different button clicks @smoke`

- **Links Tests**: `tests/elements.spec.js`
  - Link Types: `should handle different types of links @regression`

## Forms Page Tests
Located in `tests/forms.spec.js`
- **Practice Form**:
  - Complete Form: `Complete Student Registration Form @smoke`
  - Required Fields: `Form Validation - Required Fields @regression`
  - Mobile Validation: `Mobile Number Validation @regression`
  - Email Validation: `Email Format Validation @regression`
  - Subject Selection: `Subject Auto-Complete Functionality @smoke`
  - Date Selection: `Date Picker Functionality @regression`
  - State-City Selection: `State and City Dependent Dropdowns @smoke`

## Alerts, Frames & Windows Tests
Located in `tests/alerts-frames-windows.spec.js`
- **Browser Windows**:
  - New Tab: `should handle new tab @smoke`
  - New Window: `should handle new window @regression`

- **Alerts**:
  - Simple Alert: `should handle simple alert @smoke`
  - Timed Alert: `should handle timed alert @regression`
  - Confirm Alert: `should handle confirm alert - Accept @smoke`
  - Prompt Alert: `should handle prompt alert @smoke`

- **Frames**:
  - Single Frame: `should interact with single frame @smoke`
  - Nested Frames: `should handle nested frames @regression`

- **Modal Dialogs**:
  - Small Modal: `should handle small modal @smoke`
  - Large Modal: `should handle large modal @regression`

## Widgets Page Tests
Located in `tests/widgets.spec.js`
- **Accordian**: `should toggle and verify content of all sections @smoke`
- **Auto Complete**: `should handle multiple color selection @smoke`
- **Date Picker**: `should select date @smoke`
- **Slider**: `should move slider to specific value @smoke`
- **Progress Bar**: `should start and stop progress @smoke`
- **Tabs**: `should switch between tabs @smoke`
- **Tool Tips**: `should display tooltip on hover @smoke`
- **Select Menu**: `should handle old style select @smoke`

## Interactions Page Tests
Located in `tests/interactions.spec.js`
- **Sortable**: `should sort list items @smoke`
- **Selectable**: `should select multiple list items @smoke`
- **Resizable**: `should resize box with restrictions @smoke`
- **Droppable**: `should handle simple drag and drop @smoke`
- **Draggable**: `should drag element freely @smoke`

## Test Data
Test data for all scenarios is managed in `testdata/TestData.js`

## Page Objects
- `pages/ElementsPage.js`
- `pages/FormsPage.js`
- `pages/AlertsFramesWindowsPage.js`
- `pages/WidgetsPage.js`
- `pages/InteractionsPage.js`
- `pages/HomePage.js`
- `pages/BasePage.js`

## Running Tests
```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run specific features
npm run test:elements
npm run test:forms
npm run test:alerts
npm run test:widgets
npm run test:interactions
```