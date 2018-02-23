const Page = require('./page');

class HomePage extends Page {
  constructor() {
    super();
  }

  /**
  * ACTIONS
  */
  open() {
    super.open();
  }

  isSectionOptionVisible(section) {
    browser.waitForVisible(`.section-title=${section}`, 5000);
  }

  isSectionDescriptionVisible(section) {
    return !!this.getCardForSection(section);
  }

  getTextLinkFromSection(section) {
    const cardSection = this.getCardForSection(section);
    if (cardSection) {
      return cardSection.element('.section-action-text').getText();
    }
    return null;
  }

  getCardForSection(section) {
    browser.waitForVisible(`.section`, 5000);
    const sections = browser.elements('.section').value;
    for(let currentSection of sections) {
      if (currentSection.element('.section-title').getText() === section) {
        return currentSection;
      }
    }
    return null;
  }

  isSectionActiveAtMenu(section) {
    browser.waitForVisible(`.menu`, 5000);
    const activeItem = browser.element('.menu .active div div');
    return activeItem.getText().includes(section);
  }
}

module.exports = new HomePage();