///<reference types="cypress"/>
import DashboardData from "../../../support/Page Objects/loginPage.js";
import SettlementConfiguartions from "../../../support/Page Objects/Final Settlement Settings/POsettlementConfigurations.js"
describe('Payslips', () => {
    let settlementConfiguration
    before(() => {
        cy.fixture('settlementConfiguration').then((fixtureData) => {
            settlementConfiguration = fixtureData
        })

    })
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    const page = new DashboardData()
    const settlementConfiguartions = new SettlementConfiguartions()
//     it('Settlement Configurations', function () {
//         cy.NavigateToPayrollModule()
//         page.getSubModule().contains(settlementConfiguration.requiredModule.subModuleName).click()
//        // cy.ClickOnLink('Actions')

// //         //For adding Settlement Configuration---AA
// //         //.ah-empty-state-acions a---AA
// //         cy.get(".ah-btn-set button").click()
// //         const compName = "New comp"
// //         cy.get("input[formcontrolname='settlement_group_name'").type(compName)
// //         cy.get("input[formcontrolname='settlement_group_code']")
// //             .invoke('val') // Get the value of the input field
// //             .then((settlementGroupCode) => {
// //                 cy.log(settlementGroupCode)
// //             });

// //         cy.get("#checkinduration1").click()
// //         cy.get(".ah-single-search input").type("Leave Encashment FS")
// //         cy.get(".dropdown-menu ul a").click()

// //         cy.get("#offboarding_type").click()
// //         const OffBoardingType = "Resignation"
// //         cy.get("#offboarding_type .ah-single-search input").type(OffBoardingType)
// //         cy.get("#offboarding_type .dropdown-menu ul a").click()

// //         if (OffBoardingType == "Retirement" || OffBoardingType == "Deceased" || OffBoardingType == "Adhoc Exit") {
// //             cy.log("No need Off-Boarding Reason(s)");
// //         }

// //         else
// //             cy.get("#multiSelect").click()

// //         cy.get('.ah-multi-selection .ah-checkbox-wrap label').click();

// // /*
// //         //for clicking on select all 
// //         //.dropdown-menu .ah-checkbox-wrap label[for="ah-mselect-m4ro0a5ep-all"]

// //         //for selecting from off boarding options
// //         //.dropdown-menu .dropdown-item .ah-checkbox-wrap span

// //         //For adding slabs

// //         cy.get(".ah-form-section-set .ah-form-section-options button").click()
// //         // for configure slab
// // */
// //         cy.get('input[placeholder="Enter Order"]').type(1)

// //           //For adding slabs

// //           cy.get(".ah-form-section-set .ah-form-section-options button").click()
// //           // for configure slab
  
// //           cy.get('input[placeholder="Enter Order"]').type(1)
  
  
// //           cy.get(".ah-form-build-container-left .ah-card-outline .ah-card-outline-body").click()
  
// //           cy.get(".ah-tabs-to-dropdown #checkinduration1").click()
  
  
  
  
// //           // to click on round off 
// //           cy.get("#round-off").click()
// //           let requiredroundoff = "Nearest Ten"
// //           cy.get("#round-off .dropdown-menu ul li a").each(($element, index, $list) => {
  
// //               const roundofftype = $element.text().trim()
// //               cy.log(roundofftype, 'roundofftype')
// //               if (roundofftype === requiredroundoff) {
// //                   // cy.wait(2000)
// //                   cy.wrap($element).click()
// //               }
// //               else {
// //                   cy.log("undefined")
// //               }
// //           })
  
// //           const calculationType = "percentage";
  
// //           if (calculationType === "fixed") {
// //               // Assert the radio button is checked
// //               cy.get('input[id="radio07"]').should('be.checked');
  
// //               // Define minimum and maximum values
// //               const minimumValue = 10000;
// //               const maxValue = 10000000000000;
  
// //               // Type values into the fields
// //               cy.get('input[placeholder="Enter Minimum Value"]').type(minimumValue);
// //               cy.get('input[placeholder="Enter Maximum Value"]').type(maxValue);
  
// //               // Check if either value exceeds 1,000,000,000
// //               if (minimumValue > 1000000000 || maxValue > 1000000000) {
// //                   cy.get(".ah-form-build-container-left .row").contains("Value cannot be more than 1000000000");
// //                   cy.log("Please enter value less than 1000000000 for either min or max fields");
// //               } else {
// //                   cy.log("Everything is fine at step 1");
// //               }
  
// //               // Check if minimum value is greater than maximum value
// //               if (minimumValue > maxValue) {
// //                   cy.get(".ah-form-build-container-left .row").contains("Max Value cannot be less than min value.");
// //                   cy.log("Please enter max value greater than min value");
// //               } else {
// //                   cy.log("Everything is fine at step 2");
// //               }
// //           } else {
// //               // Handle case for other calculation types
// //               cy.get('label[for="radio08"]').click();
// //           }
  
  





//     })

    it('Settlement Configurations with page Objects', function () {
        cy.NavigateToPayrollModule()
        page.getSubModule().contains(settlementConfiguration.requiredModule.subModule39).click()
        settlementConfiguartions.clickOnAddNewButton()
        //settlementConfiguartions.EnterSettlementGrouName()
        cy.SelectByInputField("Enter Settlement Group Name","dummy")
        settlementConfiguartions.getSettlementGroupCode()
        cy.selectByID('salary_component')
        settlementConfiguartions.selectSalaryComponent()
        settlementConfiguartions.selectOffBoardingType()
        settlementConfiguartions.selectOffBoardingReasons()
        settlementConfiguartions.clickOnAddSlab()
        settlementConfiguartions.enterSlabOrder()
    })
})
