///<reference types="cypress"/>
import TaxSubSectionsPageObjects from "../../../support/Page Objects/Tax Settings PageObjects/POtaxSubSections.js";
describe('Tax sub Section test suite', () => {
    let data, TaxSubSections, TaxData = []
    const filePath = 'cypress/fixtures/excelData/exceldata.xlsx'
    const sheetName = 'TaxSubSections'

    before(() => {
        cy.fixture('data').then((fixtureData) => {
            data = fixtureData
        })
        cy.readSheetData(filePath, sheetName).then((excelData) => {
            TaxData = excelData
            TaxData.forEach((element, index) => {
                cy.log(`📌Data at row ${index + 1}:`)
                Object.entries(element).forEach(([key, value]) => {
                    cy.log(`${key}: ${value}`)
                })
                console.table(element)
            })
        })

    })
    beforeEach(() => {
        cy.viewport(1920, 1080); // Standard Full HD screen size
        // cy.LoginToAdmin()
        cy.NavigateToPayrollModule()
        cy.get('.ah-btn-link').contains(data.requiredModule.subModule27).click()
    })

    it('Verify the functionality of the Add new Tax Sub Section', function () {
        cy.wrap(TaxData).each(eachTaxSubSectionInput => {
            TaxSubSections = new TaxSubSectionsPageObjects(eachTaxSubSectionInput)
            cy.log(TaxSubSections.FormulaBuilder, "%%%%%%%%%%%%%%%%%")
            cy.NavigateToRegion(TaxSubSections.Regions, { timeout: 60000 });
            cy.intercept('OPTIONS', '/fetch/allTaxSections').as('getTaxsections');
            cy.wait('@getTaxsections', { timeout: 60000 })
                .its('response.statusCode')
                .should('eq', 204);
            cy.clickOnAddNew().wait(3000)
            cy.get('.ah-form-container-lg').should('have.class', 'ah-form-container-lg');
            TaxSubSections.validateTheFinancialYear()
            TaxSubSections.selectTaxSection()
            TaxSubSections.enterSubSectionName()
            TaxSubSections.enterSubSectionDescription()
            TaxSubSections.selectSectionType()
            TaxSubSections.selectInputSource()
            TaxSubSections.selectTheCalculationMetod()
            TaxSubSections.selectLimitationType()
            TaxSubSections.enterSubSectionLimit()
            TaxSubSections.selectConsideforTP3()
            TaxSubSections.clickOnSubmit()
            TaxSubSections.clickOnCancel()
        })
    })
    it.skip('Verify the functionality of the View Details in the Tax Sub Sections', function () {
        cy.wrap(TaxData).each(eachTaxSubSectionInput => {
            TaxSubSections = new TaxSubSectionsPageObjects(eachTaxSubSectionInput)
            cy.NavigateToRegion(TaxSubSections.Regions, { timeout: 60000 })
            cy.log(TaxSubSections.SubSectionName, 1, "@@@@@@@@@@@@")
            cy.ViewDetails(TaxSubSections.SubSectionName, 1)



        })

    })
})