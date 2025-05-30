export const editOpeningLocators = {
    moreVertIcon: '[data-testid="MoreVertIcon"]',
    editOpeningButton: "button[aria-label='Edit Opening']",
    jobOpeningTextbox: "role=textbox[name='Job Opening Name']",
    addResponsibilityButton: 'button:has-text("Add Job Responsibility")',
    responsibilityInput: 'input[name="jobRequirementsAndResponsibilities\\.4\\.value"]',
    deleteResponsibilityButton: '.flex > div > .flex > .MuiButtonBase-root',
  
    addSkillButton: 'button:has-text("Add Skill")',
    skillInput: 'input[name^="skillsGroups.0.skills"]',
    deleteSkillButton: '.bg-white > div:nth-child(2) > div > div > .MuiButtonBase-root',
    maxQuestionsSpinButton: "role=spinbutton[name='Max Number of Questions to Ask']",
    openingname:'//h3',
    updateOpeningButton: 'button:has-text("Update Opening")',
  };