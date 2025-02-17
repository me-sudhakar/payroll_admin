///<reference types="cypress"/>
import DashboardData from "../../../support/Page Objects/loginPage.js";
import PayslipTemplateLocators from "../../../support/Page Objects/Other Payroll Settings/POpayslips.js";
describe('Payslips', () => {
  let data//, payslipdata
  before(function () {
    cy.fixture('data').then((fixtureData) => {
      data = fixtureData
    })
    // cy.fixture('Payslips/payslip.json').then((payslipFixtures) => {
    //   payslipdata = payslipFixtures
    // })
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  const page = new DashboardData()
  const paySlipTemplate = new PayslipTemplateLocators()
  it('Verify the functionality of Add New button in Payslip Templates', function () {
   
    cy.NavigateToPayrollModule()
    page.getSubModule().contains(data.requiredModule.subModule13).click().wait(3000)
    /* to get the template from the table response
    // cy.get('tbody tr').wait(3000).each(($row, index) => {
    //   cy.wrap($row).find('td:nth-child(1)').invoke('text').then((text) => {
    //     const colText = text.trim()
    //     if (colText === payslipdata.PayslipDetails.TemplateName) {
    //       expect(colText, `Match Found at Row:"${index + 1}"`).to.equal(payslipdata.PayslipDetails.TemplateName)
    //       //cy.log(`Row ${index + 1}: ${colText}`)
    //     }
    //     else {
    //       cy.log(`Match not found at Row:"${index + 1}" moving to next row`)
    //     }
    //   })
    // })

    // cy.get('tbody tr').each(($row, index) => {
    //   // Get the text from the first cell of the current row
    //   cy.wrap($row).find(':nth-child(1) td:nth-child(1)').invoke('text').then((text) => {
    //     // Trim any extra whitespace from the text
    //     const rowText = text.trim();

    //     // Compare with the expected text
    //     if (rowText === payslipdata.PayslipDetails.TemplateName) {
    //       cy.log(`Row ${index + 1}: ${rowText}`);
    //       cy.log('Text matched');
    //     } else {
    //       cy.log('###########');
    //     }
    //   });
    // });
    //*/

    paySlipTemplate.clickOnAddNewButton()
    paySlipTemplate.SelectTheOrg()
    paySlipTemplate.SelectTheEntity()
    paySlipTemplate.enterTemplateName()
    paySlipTemplate.selectEmployeeFields()
    paySlipTemplate.selectAttendanceTags()
    paySlipTemplate.SelectLeaveDetails()
    paySlipTemplate.SelectTaxDeatails()
    paySlipTemplate.SelectAllowances()
    paySlipTemplate.SelectBenefits()
    paySlipTemplate.SelectDeductions()
    paySlipTemplate.ShowMasterDatainAllowances()
    paySlipTemplate.selectPageSize()
    paySlipTemplate.HeaderAndFooter()
    paySlipTemplate.clickOnFinalSubmitButton()
    paySlipTemplate.successfullMessage()

  })

  it.only('Verify the functionality of View Details in Payslip Templates', function () {
    cy.NavigateToPayrollModule()
    page.getSubModule().contains(data.requiredModule.subModule13).click().wait(1000)
    cy.get(':nth-child(1) > .ah-sublvl-list > :nth-child(2) > .ah-sublvl-list-set-item').click()
    cy.wait(3000)
    paySlipTemplate.ViewDetails()

  })
})



