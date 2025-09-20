///<reference types="cypress"/>
import PageCodes from '../support/pageObjects/PayCycles';
describe('Payroll management', function () {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent default error handling
  });
  const page = new PageCodes()
  let data
  // Getting Fixtures from data.json
  before(function () {
    cy.fixture('data').then((fixtureData) => {
      data = fixtureData
    })
  })

  it('Test case-1 Finding the Employee in different PayCycles', function () {
    cy.NavigateToPayrollModule()
    page.getSubModule().contains(data.requiredModule.subModuleName).click()
    cy.wait(5000);
    page.getEntity().contains(data.org.entity).click();
    cy.wait(5000);
    // Search for employee ID
    page.getEmployeeIDSearch().type(data.org.employeeID);
    page.getEmployeeIDcolumnSearch().contains('Employee ID').click();
    page.getSearchButton().click()
    cy.wait(8000);
    let matchFound = false;
    if (matchFound) return; // Exit if match is found
    page.getPayCycleItems().each(($el, index) => {
      page.getPayCycleItems().eq(index).then(($el) => {
        cy.wrap($el).invoke('text').then((PayCycleName) => {
          cy.log(`Pay Cycle Name: ${PayCycleName} : ${index}`)
        });
        cy.get('body').then(($body) => {
          if ($body.find(page.responseLocation()).length > 0) {
            page.getEmployeeIDresponse().invoke('text').then((text) => {
              const searchedEmpID = text.trim();
              if (searchedEmpID === data.org.employeeID) {
                cy.log(`Extracted Employee ID matches: ${searchedEmpID}`, $el.text());
                matchFound = true; // Set matchFound to true and stop iteration
                return;
              } else {
                cy.log(`Extracted Employee ID does not match: ${searchedEmpID}`, $el.text())
              }
            });
          } else {
            cy.log('Employee ID not found moving to the next Paycycle.')
            //cy.log(`${index-1},'%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'`)
            cy.wrap($el).click()
            cy.wait(6000)
          }
        });
      });
    });
  });
});

