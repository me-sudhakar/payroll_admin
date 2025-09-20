///<reference types="cypress"/>
import TaxSectionsPageObjects from "../../../support/Page Objects/Tax Settings PageObjects/POtaxSections.js";
describe("Tax Section test suite", () => {
  let TaxSections,
    TaxData = [];
  const filePath = "cypress/fixtures/excelData/exceldata.xlsx";
  const sheetName = "TaxSections";
  before(() => {
    cy.readSheetData(filePath, sheetName).then((excelData) => {
      TaxData = excelData;
    });
    TaxData.forEach((element, index) => {
      cy.log(`Data at row ${index + 1}:`);
      Object.entries(element).forEach(([key, value]) => {
        cy.log(`${key}: ${value}`);
      });
      console.table(element);
    });
  });
  beforeEach(() => {
    cy.NavigateToPayrollModule();
    cy.get(".ah-btn-link").contains("Tax Sections").click();
  });

  it("Verify the functionality of Add new Tax Section", function () {
    cy.wrap(TaxData).each((eachTaxSectionInput) => {
      TaxSections = new TaxSectionsPageObjects(eachTaxSectionInput);
      cy.log(`Adding Tax Section : ${TaxSections.SectionName}`);
      cy.NavigateToRegion(TaxSections.Regions).wait(3000);
      cy.clickOnAddNew().wait(2000);
      TaxSections.validateTheRegionDetails();
      TaxSections.validateTheFinancialYear();
      TaxSections.enterTaxSectionName();
      TaxSections.enterTaxSectionLimit();
      TaxSections.selectLenderDetails();
      //TaxSections.clickOnCancel()
      TaxSections.clickOnSubmit();
    });
  });

  it("Verify the functionality of View Details in Tax Sections", () => {
    cy.wrap(TaxData).each((eachTaxSectionInput) => {
      TaxSections = new TaxSectionsPageObjects(eachTaxSectionInput);
      cy.log(`Validating Tax Section : ${TaxSections.SectionName}`);
      cy.searchField(TaxSections.SectionName, "Section Name");
      TaxSections.ViewDetails();
      TaxSections.validateTheRegionDetails();
      TaxSections.verifySectionName();
      TaxSections.verifyLimit();
      TaxSections.verifyLenderDetails();
      TaxSections.clickOnCross();
    });
  });
});
