export const deleteLocators = {
    jobContainer: (jobIdValue) => `//span[normalize-space()='Job ID: ${jobIdValue}']/ancestor::div[contains(@class, 'card')]`,
    openingname:'//h3',
    deleteIcon: 'role=button[name="Delete Opening"]',
    deleteDialogTitle: "h2#delete-dialog-title",
    yesButton: "button:has-text('Yes')",
    noButton: "button:has-text('No')",
    moreVertIcon: '[data-testid="MoreVertIcon"]',
    successAlert: (openingName) =>
        `//div[contains(@class, 'Toastify__toast-body')][contains(normalize-space(), 'Opening')][contains(normalize-space(), '${openingName}')][contains(normalize-space(), 'deleted')]`,
};
