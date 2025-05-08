import { BasePage } from './BasePage';

export class InteractionsPage extends BasePage {
    constructor(page) {
        super(page);
        // Menu items
        this.sortableMenu = '.element-group:has-text("Interactions") >> text=Sortable';
        this.selectableMenu = '.element-group:has-text("Interactions") >> text=Selectable';
        this.resizableMenu = '.element-group:has-text("Interactions") >> text=Resizable';
        this.droppableMenu = '.element-group:has-text("Interactions") >> text=Droppable';
        this.draggableMenu = '.element-group:has-text("Interactions") >> text=Dragabble';

        // Sortable elements
        this.listTab = '#demo-tab-list';
        this.gridTab = '#demo-tab-grid';
        this.sortableItems = '.list-group-item';
        this.gridItems = '.grid-container .list-group-item';

        // Selectable elements
        this.selectableList = '#verticalListContainer';
        this.selectableGrid = '#gridContainer';
        this.listItems = '#verticalListContainer li';
        this.gridItems = '#gridContainer li';

        // Resizable elements
        this.resizableBox = '#resizableBoxWithRestriction';
        this.resizeHandle = '#resizableBoxWithRestriction .react-resizable-handle';

        // Droppable elements
        this.simpleTab = '#droppableExample-tab-simple';
        this.acceptTab = '#droppableExample-tab-accept';
        this.preventTab = '#droppableExample-tab-preventPropogation';
        this.revertTab = '#droppableExample-tab-revertable';
        this.draggable = '#dragBox';
        this.droppable = '#droppable';

        // Draggable elements
        this.dragBox = '#dragBox';
        this.axisRestrictedTab = '#draggableExample-tab-axisRestriction';
        this.containerRestrictedTab = '#draggableExample-tab-containerRestriction';
    }

    // Navigation methods
    async navigateToSortable() {
        await this.clickElement(this.sortableMenu);
    }

    async navigateToSelectable() {
        await this.clickElement(this.selectableMenu);
    }

    async navigateToResizable() {
        await this.clickElement(this.resizableMenu);
    }

    async navigateToDroppable() {
        await this.clickElement(this.droppableMenu);
    }

    async navigateToDraggable() {
        await this.clickElement(this.draggableMenu);
    }

    // Sortable methods
    async switchToListView() {
        await this.clickElement(this.listTab);
    }

    async switchToGridView() {
        await this.clickElement(this.gridTab);
    }

    async dragAndDropItem(sourceIndex, targetIndex) {
        const items = await this.page.$$(this.sortableItems);
        const sourceItem = items[sourceIndex];
        const targetItem = items[targetIndex];
        
        await sourceItem.dragTo(targetItem);
    }

    // Selectable methods
    async selectListItems(indexes) {
        for (const index of indexes) {
            const items = await this.page.$$(this.listItems);
            await items[index].click();
        }
    }

    async selectGridItems(indexes) {
        for (const index of indexes) {
            const items = await this.page.$$(this.gridItems);
            await items[index].click();
        }
    }

    // Resizable methods
    async resizeBox(deltaX, deltaY) {
        const handle = await this.page.$(this.resizeHandle);
        const box = await this.page.$(this.resizableBox);
        
        const boxBounding = await box.boundingBox();
        const handleBounding = await handle.boundingBox();
        
        await this.page.mouse.move(
            handleBounding.x + handleBounding.width / 2,
            handleBounding.y + handleBounding.height / 2
        );
        await this.page.mouse.down();
        await this.page.mouse.move(
            handleBounding.x + deltaX,
            handleBounding.y + deltaY
        );
        await this.page.mouse.up();
    }

    // Droppable methods
    async dragToDroppable() {
        const draggable = await this.page.$(this.draggable);
        const droppable = await this.page.$(this.droppable);
        await draggable.dragTo(droppable);
    }

    async switchToAcceptTab() {
        await this.clickElement(this.acceptTab);
    }

    async switchToPreventTab() {
        await this.clickElement(this.preventTab);
    }

    async switchToRevertTab() {
        await this.clickElement(this.revertTab);
    }

    // Draggable methods
    async dragByOffset(x, y) {
        const dragBox = await this.page.$(this.dragBox);
        const box = await dragBox.boundingBox();
        
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(box.x + x, box.y + y);
        await this.page.mouse.up();
    }

    async switchToAxisRestrictedTab() {
        await this.clickElement(this.axisRestrictedTab);
    }

    async switchToContainerRestrictedTab() {
        await this.clickElement(this.containerRestrictedTab);
    }
}