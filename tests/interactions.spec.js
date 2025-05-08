import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InteractionsPage } from '../pages/InteractionsPage';
import { TestData } from '../testdata/TestData';

test.describe('Interactions Page Features', () => {
    let homePage;
    let interactionsPage;
    const interactionData = TestData.getInteractionData();

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        interactionsPage = new InteractionsPage(page);
        await page.goto('/');
        await homePage.clickOnInteractionsCard();
    });

    test.describe('Sortable', () => {
        test('should sort list items @smoke', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            await interactionsPage.switchToListView();

            // Get initial order
            const items = page.locator('.list-group-item');
            const initialTexts = await items.allTextContents();

            // Perform drag and drop
            await interactionsPage.dragAndDropItem(0, 2);

            // Verify new order
            const newTexts = await items.allTextContents();
            expect(newTexts[2]).toBe(initialTexts[0]);
        });

        test('should sort grid items @regression', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            await interactionsPage.switchToGridView();

            const gridItems = page.locator('.grid-container .list-group-item');
            await expect(gridItems).toHaveCount(9);

            // Record initial positions
            const initialPositions = await gridItems.all();
            const firstItem = initialPositions[0];
            const fourthItem = initialPositions[3];

            // Perform grid sort
            await firstItem.dragTo(fourthItem);

            // Verify order changed
            const newItems = await gridItems.all();
            expect(await newItems[3].textContent()).toBe(await firstItem.textContent());
        });

        test('should maintain item count after sorting @regression', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            
            // Check list view
            await interactionsPage.switchToListView();
            await expect(page.locator('.list-group-item')).toHaveCount(6);
            
            // Check grid view
            await interactionsPage.switchToGridView();
            await expect(page.locator('.grid-container .list-group-item')).toHaveCount(9);
        });
    });

    test.describe('Selectable', () => {
        test('should select multiple list items @smoke', async ({ page }) => {
            await interactionsPage.navigateToSelectable();
            const indexes = [0, 2];
            await interactionsPage.selectListItems(indexes);

            // Verify selections
            for (const index of indexes) {
                await expect(page.locator(interactionsPage.listItems).nth(index))
                    .toHaveClass(/active/);
            }
        });

        test('should select multiple grid items @regression', async ({ page }) => {
            await interactionsPage.navigateToSelectable();
            const indexes = [0, 4, 8];
            await interactionsPage.selectGridItems(indexes);

            // Verify selections using enhanced verification
            for (const index of indexes) {
                await expect(page.locator(interactionsPage.gridItems).nth(index))
                    .toHaveClass(/active/);
            }
        });

        test('should toggle selection state @regression', async ({ page }) => {
            await interactionsPage.navigateToSelectable();
            
            // Select and unselect first item
            await interactionsPage.selectListItems([0]);
            await expect(page.locator(interactionsPage.listItems).first())
                .toHaveClass(/active/);
            
            await interactionsPage.selectListItems([0]);
            await expect(page.locator(interactionsPage.listItems).first())
                .not.toHaveClass(/active/);
        });
    });

    test.describe('Resizable', () => {
        test('should resize box with restrictions @smoke', async ({ page }) => {
            await interactionsPage.navigateToResizable();

            const box = page.locator(interactionsPage.resizableBox);
            const initialBox = await box.boundingBox();

            // Resize within restrictions
            await interactionsPage.resizeBox(50, 50);

            const newBox = await box.boundingBox();
            expect(newBox.width).toBeGreaterThan(initialBox.width);
            expect(newBox.height).toBeGreaterThan(initialBox.height);
            expect(newBox.width).toBeLessThanOrEqual(500); // Max width restriction
            expect(newBox.height).toBeLessThanOrEqual(300); // Max height restriction
        });

        test('should respect minimum size restrictions @regression', async ({ page }) => {
            await interactionsPage.navigateToResizable();

            const box = page.locator(interactionsPage.resizableBox);

            // Try to resize smaller than minimum
            await interactionsPage.resizeBox(-200, -200);

            const newBox = await box.boundingBox();
            expect(newBox.width).toBeGreaterThanOrEqual(150); // Min width
            expect(newBox.height).toBeGreaterThanOrEqual(150); // Min height
        });
    });

    test.describe('Droppable', () => {
        test('should handle simple drag and drop @smoke', async ({ page }) => {
            await interactionsPage.navigateToDroppable();
            await interactionsPage.dragToDroppable();

            // Verify drop was successful using enhanced verification
            await expect(page.locator(interactionsPage.droppable))
                .toHaveClass(/ui-state-highlight/);
            await expect(page.locator(interactionsPage.droppable))
                .toContainText('Dropped!');
        });

        test('should handle accept condition @regression', async ({ page }) => {
            await interactionsPage.navigateToDroppable();
            await interactionsPage.switchToAcceptTab();

            // Try with acceptable element
            await page.dragAndDrop('#acceptable', '#droppable');
            await expect(page.locator('#droppable'))
                .toHaveClass(/ui-state-highlight/);

            // Try with non-acceptable element
            await page.dragAndDrop('#notAcceptable', '#droppable');
            await expect(page.locator('#droppable'))
                .not.toHaveClass(/ui-state-highlight/);
        });

        test('should prevent propagation as configured @regression', async ({ page }) => {
            await interactionsPage.navigateToDroppable();
            await interactionsPage.switchToPreventTab();

            // Drag to outer droppable
            await page.dragAndDrop('#dragBox', '#notGreedyDropBox');
            await expect(page.locator('#notGreedyDropBox'))
                .toHaveClass(/ui-state-highlight/);

            // Drag to inner droppable
            await page.dragAndDrop('#dragBox', '#notGreedyInnerDropBox');
            await expect(page.locator('#notGreedyInnerDropBox'))
                .toHaveClass(/ui-state-highlight/);
            await expect(page.locator('#notGreedyDropBox'))
                .not.toHaveClass(/ui-state-highlight/);
        });
    });

    test.describe('Draggable', () => {
        test('should drag element freely @smoke', async ({ page }) => {
            await interactionsPage.navigateToDraggable();
            
            const dragBox = page.locator(interactionsPage.dragBox);
            const initialPos = await dragBox.boundingBox();

            // Drag to new position
            await interactionsPage.dragByOffset(100, 100);

            const newPos = await dragBox.boundingBox();
            expect(newPos.x).toBeGreaterThan(initialPos.x);
            expect(newPos.y).toBeGreaterThan(initialPos.y);
        });

        test('should respect axis restriction @regression', async ({ page }) => {
            await interactionsPage.navigateToDraggable();
            await interactionsPage.switchToAxisRestrictedTab();

            // Test X-axis restricted element
            const xRestrictedBox = page.locator('#restrictedX');
            const initialPos = await xRestrictedBox.boundingBox();

            await page.dragAndDrop('#restrictedX', '#dragBox', {
                targetPosition: { x: 100, y: 100 }
            });

            const newPos = await xRestrictedBox.boundingBox();
            expect(newPos.x).toBeGreaterThan(initialPos.x);
            expect(newPos.y).toBe(initialPos.y);
        });

        test('should respect container bounds @regression', async ({ page }) => {
            await interactionsPage.navigateToDraggable();
            await interactionsPage.switchToContainerRestrictedTab();

            const containerBox = page.locator('.draggable-container');
            const dragBox = page.locator('#containmentWrapper');

            const containerBounds = await containerBox.boundingBox();
            const initialDragBounds = await dragBox.boundingBox();

            // Attempt to drag outside container
            await page.mouse.move(
                initialDragBounds.x + initialDragBounds.width / 2,
                initialDragBounds.y + initialDragBounds.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(
                containerBounds.x + containerBounds.width + 100,
                containerBounds.y + containerBounds.height + 100
            );
            await page.mouse.up();

            const finalDragBounds = await dragBox.boundingBox();
            expect(finalDragBounds.right).toBeLessThanOrEqual(containerBounds.right);
            expect(finalDragBounds.bottom).toBeLessThanOrEqual(containerBounds.bottom);
        });
    });
});