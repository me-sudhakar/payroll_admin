let data
//let TaxSectionData = []
// const filePath = "cypress/fixtures/excelData/exceldata.xlsx"
// const sheetName = "TaxSections"
before(() => {
    cy.fixture('data').then((fixtureData) => {
        data = fixtureData
    })
    // cy.readSheetData(filePath, sheetName).then((excelData) => {
    //     TaxSectionData = excelData
    //     //cy.log(JSON.stringify(TaxData))
    // })
})
class TaxSectionsPageObjects {
    constructor(eachTaxSectionInput = {}) {
        this.Organizations = eachTaxSectionInput.Organizations || "";
        this.Regions = eachTaxSectionInput.Regions || "";
        this.entity = eachTaxSectionInput.entity || "";
        this.EffectiveFrom = eachTaxSectionInput.EffectiveFrom || "";
        this.SectionName = eachTaxSectionInput.SectionName || "";
        this.Limit = eachTaxSectionInput.Limit || "";
        this.LenderDetails = eachTaxSectionInput.LenderDetails || "";
    }
    headerTitle() {
        return cy.get('.title').invoke('text').then((text) => {
            return text.trim()
        })
    }
    clickOnElement(selector) {
        cy.get(selector).click()
    }
    enterData(selector, reqData) {
        cy.get(selector).type(reqData)
    }
    /*Naviagte To entity
    // navigatingToEntity() {
    //     cy.NavigateToEntity(this.Organizations, this.entity)
    //     return;
    // }
    // validateTheOrganisation() {
    //     cy.log(this.Organizations)
    //     cy.xpath(`(//div[@class="ah-info-content-data"]//div//a[@id="checkinduration1"])[1]`)
    //         .invoke('text').then((text) => {
    //             cy.log(text)
    //             expect(text.trim()).to.equal(this.Organizations)
    //         })
    // }
*/
    validateTheRegionDetails() {
        this.headerTitle().then((HeaderName) => {
            cy.xpath(`//div[@class="val-text region-value"]`).invoke('text').then((text) => {
                const region = text.trim()
                cy.get('.region-label').invoke('text').then((text) => {
                    const label = text.trim()
                    expect(region, label + ` Details in the ` + HeaderName + " side overlay").to.equal(this.Regions)
                })
            })
        })

    }
    //Validating the Entity
    // validateTheEntity() {
    //     cy.xpath(`(//div[@class="ah-info-content-data"]//div//a[@id="checkinduration1"])[2]`)
    //         .invoke('text').then((text) => {
    //             cy.log(text)
    //             cy.log(this.entity)
    //             expect(text.trim()).to.equal(this.entity)
    //         })
    // }
    validateTheFinancialYear() {
        this.headerTitle().then((HeaderName) => {
            cy.xpath(`//input[@id="financial_year"]`).invoke('val').then((text) => {
                const FY = text.trim();
                cy.xpath('(//label[@class="form-label ah-sm field-required"])[1]').invoke('text').then((text) => {
                    const label = text.trim()
                    expect(FY, label + " Details in the " + HeaderName).to.equal(this.EffectiveFrom)
                })
            })
        })
    }
    enterTaxSectionName() {
        //  cy.xpath(`(//label[@class="form-label ah-sm field-required"])[2]`).invoke('text').then((text) => {
        //const label = text.trim()
        //expect(FY, label + " Details in the " + HeaderName).to.equal(this.EffectiveFrom)
        //})
        cy.SelectByInputField('Enter Section Name', this.SectionName)
    }
    enterTaxSectionLimit() {
        cy.SelectByInputField('Enter Limit', this.Limit)
    }
    selectLenderDetails() {
        if (this.LenderDetails === "Yes") {
            cy.xpath(`//label[@for="lender_details"]`).click()
        }
    }
    clickOnCancel() {
        cy.xpath(`//button[@id="request-cancel-btn"]`).click().wait(3000)
    }
    clickOnSubmit() {
        // Register the confirmation handler BEFORE clicking the button
        let confirmationText = " Are you sure, you want to add this tax section ? "
        // Click the button that triggers the pop-up
        cy.get('#request-cancel-modify').click();
        cy.xpath(`//div[@id="addconfirm"]//div[@class="modal-dialog modal-dialog-centered"]//div[@class="modal-content"]`)
            .should('be.visible')
            .then(() => {
                cy.xpath(`//div[@id="addconfirm"]//div[@class="ah-confirm-info"]`).invoke('text').then((text) => {
                    if (text.trim() === confirmationText.trim()) {
                        cy.xpath(`//button[@id="request-cancel"]`).click()
                    } else {
                        cy.xpath(`//button[@id="request-cancel-confirm"]`).click()
                    }
                })
            })
    }

    /**************************************View Details - Action Drop down***********************************/

    ViewDetails() {
        return cy.ViewDetails(this.SectionName,0)
    }
    //section Details header
    sectionDetails() {
        return cy.get(".ah-info-content-title").invoke('text').then((text) => {
            return text.trim()
        })
    }
    verifySectionName() {
        this.sectionDetails()
            .then((HeaderName) => {
                cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-text"])[1]`)
                    .invoke('text').then((text) => {//name of the section
                        const label = text.trim()
                        cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-label"])[1]`).invoke('text')
                            .then((text) => {// name of the header i.e., "section name" 
                                const header = text.trim()
                                expect(label, `"` + header + `"` + " details in the " + HeaderName + `header of "View Details overlay`).to.equal(this.SectionName)
                            })
                    })
            })
    }

    verifyLimit() {
        this.sectionDetails()
            .then((HeaderName) => {
                cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-text"])[2]`)
                    .invoke('text').then((text) => {
                        const actualValue = parseFloat(text.trim().replace(/,/g, ''));
                        //const label = text.trim()
                        cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-label"])[2]`)
                            .invoke('text').then((text) => {
                                const header = text.trim()
                                const expectedValue = parseFloat(this.Limit === '' || this.Limit === 0 ? '0' : String(this.Limit))
                                expect(actualValue, `"` + header + `"` + " details in the " + HeaderName + ` header of "View Details overlay`).to.equal(expectedValue)
                            })
                    })
            })
    }
    verifyLenderDetails() {
        this.sectionDetails()
            .then((HeaderName) => {
                cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-text"])[6]`).invoke('text').then((text) => {//name of the section
                    const label = text.trim()
                    cy.xpath(`(//div[@class="ah-overlay-view-left"]//div[@class="val-label"])[6]`).invoke('text').then((text) => {// name of the header i.e., "section name" 
                        const header = text.trim()
                        expect(label, `"` + header + `"` + " details in the " + HeaderName + `header of "View Details overlay`).to.equal(this.LenderDetails)
                    })
                })
            })
    }
    clickOnCross() {
        cy.log(`✅${this.SectionName} is validated successfully`)
        cy.get(".close-action .fa-times").click()
    }

}

export default TaxSectionsPageObjects