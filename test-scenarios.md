# DEMOQA Test Scenarios

## Elements Page Test Scenarios

### Text Box
#### Submit Text Box Form with Valid Data (@smoke)
1. Navigate to Elements page
2. Click on Text Box menu
3. Fill in form fields:
   - Full Name: "John Doe"
   - Email: "john.doe@example.com"
   - Current Address: "123 Current St, Test City"
   - Permanent Address: "456 Permanent Ave, Test City"
4. Click Submit button
5. Verify output contains all entered information

#### Form Validation
1. Navigate to Text Box
2. Submit empty form
3. Verify validation indicators appear
4. Submit invalid email format
5. Verify email validation error

### Check Box
#### Handle Check Box Tree Structure (@regression)
1. Navigate to Check Box page
2. Click "Expand all" button
3. Select "Downloads" checkbox
4. Verify selected items:
   - Downloads
   - Word File
   - Excel File

### Radio Button
#### Handle Radio Button Selection (@smoke)
1. Navigate to Radio Button page
2. Click "Yes" radio button
3. Verify "Yes" selection message
4. Click "Impressive" radio button
5. Verify "Impressive" selection message
6. Verify "No" radio button is disabled

### Web Tables
#### CRUD Operations (@regression)
1. Navigate to Web Tables page
2. Add new record:
   - First Name: "Jane"
   - Last Name: "Smith"
   - Email: "jane.smith@example.com"
   - Age: "28"
   - Salary: "45000"
   - Department: "HR"
3. Search for added record
4. Edit record
5. Verify edited data
6. Delete record
7. Verify record removal

### Buttons
#### Handle Different Button Clicks (@smoke)
1. Navigate to Buttons page
2. Perform double click
3. Verify double click message
4. Perform right click
5. Verify right click message
6. Perform dynamic click
7. Verify dynamic click message

### Links
#### Handle Different Types of Links (@regression)
1. Navigate to Links page
2. Click simple link
3. Verify new tab opens
4. Test API calls:
   - Created (201)
   - No Content (204)
   - Moved (301)
   - Bad Request (400)
   - Unauthorized (401)
   - Forbidden (403)
   - Not Found (404)

## Forms Page Test Scenarios

### Practice Form
#### Complete Student Registration Form (@smoke)
1. Navigate to Practice Form
2. Fill personal information:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Gender: "Male"
   - Mobile: "1234567890"
3. Set date of birth: "15 July 1990"
4. Select subjects: "Maths, English"
5. Select hobbies: "Sports, Reading"
6. Upload picture
7. Fill address:
   - Current Address: "123 Test Street, Test City"
   - State: "NCR"
   - City: "Delhi"
8. Submit form
9. Verify submission modal

#### Form Validation - Required Fields (@regression)
1. Navigate to Practice Form
2. Submit empty form
3. Verify validation on required fields:
   - First Name
   - Last Name
   - Gender
   - Mobile Number

## Alerts, Frames & Windows Test Scenarios

### Browser Windows
#### Handle New Tab (@smoke)
1. Navigate to Browser Windows
2. Click "New Tab" button
3. Verify new tab content
4. Close new tab

#### Handle New Window (@regression)
1. Navigate to Browser Windows
2. Click "New Window" button
3. Verify new window content
4. Close new window

### Alerts
#### Handle Simple Alert (@smoke)
1. Navigate to Alerts
2. Click alert button
3. Accept alert

#### Handle Timed Alert (@regression)
1. Navigate to Alerts
2. Click timed alert button
3. Wait for alert
4. Accept alert

#### Handle Confirm Alert (@smoke)
1. Navigate to Alerts
2. Click confirm button
3. Accept/Dismiss alert
4. Verify selection result

#### Handle Prompt Alert (@smoke)
1. Navigate to Alerts
2. Click prompt button
3. Enter text in prompt
4. Verify entered text

### Frames
#### Interact with Single Frame (@smoke)
1. Navigate to Frames
2. Switch to frame
3. Verify frame content
4. Switch between frames

#### Handle Nested Frames (@regression)
1. Navigate to Nested Frames
2. Switch to parent frame
3. Verify parent frame content
4. Switch to child frame
5. Verify child frame content

### Modal Dialogs
#### Handle Small Modal (@smoke)
1. Navigate to Modal Dialogs
2. Open small modal
3. Verify modal content
4. Close modal
5. Verify modal closed

#### Handle Large Modal (@regression)
1. Navigate to Modal Dialogs
2. Open large modal
3. Verify modal content
4. Close modal
5. Verify modal closed

## Widgets Page Test Scenarios

### Accordian
#### Toggle Content (@smoke)
1. Navigate to Accordian
2. Click each section
3. Verify content visibility
4. Verify content text

### Auto Complete
#### Multiple Color Selection (@smoke)
1. Navigate to Auto Complete
2. Type and select multiple colors
3. Verify selected colors
4. Remove color
5. Verify color removed

### Date Picker
#### Select Date (@smoke)
1. Navigate to Date Picker
2. Select date
3. Verify selected date format
4. Select date and time
5. Verify selected date and time

### Slider
#### Move Slider (@smoke)
1. Navigate to Slider
2. Move slider to specific value
3. Verify slider position
4. Use keyboard controls
5. Verify slider movement

### Progress Bar
#### Control Progress (@smoke)
1. Navigate to Progress Bar
2. Start progress
3. Wait for progress
4. Stop progress
5. Verify progress value
6. Reset progress
7. Verify reset state

### Tabs
#### Switch Between Tabs (@smoke)
1. Navigate to Tabs
2. Click each tab
3. Verify tab content
4. Verify disabled tab

### Tool Tips
#### Display Tooltips (@smoke)
1. Navigate to Tool Tips
2. Hover over button
3. Verify tooltip text
4. Hover over text field
5. Verify tooltip text

### Select Menu
#### Handle Different Selects (@smoke)
1. Navigate to Select Menu
2. Select from old style select
3. Select from multi select
4. Verify selections

## Interactions Page Test Scenarios

### Sortable
#### Sort List Items (@smoke)
1. Navigate to Sortable
2. Switch to list view
3. Drag and drop items
4. Verify new order
5. Switch to grid view
6. Sort grid items
7. Verify grid order

### Selectable
#### Select Multiple Items (@smoke)
1. Navigate to Selectable
2. Select multiple list items
3. Verify selections
4. Select grid items
5. Verify grid selections

### Resizable
#### Resize Box (@smoke)
1. Navigate to Resizable
2. Resize box within restrictions
3. Verify new dimensions
4. Try resize beyond limits
5. Verify size restrictions

### Droppable
#### Simple Drag and Drop (@smoke)
1. Navigate to Droppable
2. Drag element to target
3. Verify drop successful
4. Verify drop message

### Draggable
#### Free Dragging (@smoke)
1. Navigate to Draggable
2. Drag element freely
3. Verify new position
4. Test axis restriction
5. Test container bounds