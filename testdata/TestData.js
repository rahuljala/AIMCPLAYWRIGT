export class TestData {
    static getPersonalInfo() {
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            gender: 'Male',
            mobile: '1234567890'
        };
    }

    static getDateOfBirth() {
        return {
            day: '15',
            month: '6',
            year: '1990'
        };
    }

    static getSubjects() {
        return ['Maths', 'English', 'Computer Science'];
    }

    static getHobbies() {
        return ['Sports', 'Reading', 'Music'];
    }

    static getAddress() {
        return {
            current: '123 Test Street, Test City',
            state: 'NCR',
            city: 'Delhi'
        };
    }

    static getTableRecord() {
        return {
            firstName: 'Jane',
            lastName: 'Smith',
            age: 28,
            email: 'jane.smith@example.com',
            salary: 45000,
            department: 'HR'
        };
    }

    static getTextBoxData() {
        return {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            currentAddress: '123 Current St, Test City',
            permanentAddress: '456 Permanent Ave, Test City'
        };
    }

    static getUploadFilePath() {
        return './testdata/sample.jpg';
    }

    static getColors() {
        return ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'White', 'Orange'];
    }

    static getMenuItems() {
        return ['Main Item 1', 'Main Item 2', 'Sub Item 1', 'Sub Item 2', 'SUB SUB List'];
    }

    static getDynamicProperties() {
        return {
            enableAfterSeconds: 5,
            colorChangeClass: 'text-danger',
            visibleAfterSeconds: 5
        };
    }

    static getInteractionData() {
        return {
            sortableItems: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
            selectableItems: ['Cras justo odio', 'Dapibus ac facilisis in', 'Morbi leo risus'],
            gridItems: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
            resizableStartSize: { width: 200, height: 200 },
            resizableEndSize: { width: 400, height: 400 },
            dragDropText: 'Drag me'
        };
    }
}