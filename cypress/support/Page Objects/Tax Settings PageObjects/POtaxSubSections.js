let data
before(() => {
    cy.fixture('data').then((fixtureData) => {
        data = fixtureData
    })
})

class TaxSubSectionsPageObjects {
    constructor(eachTaxSubSectionInput = {}) {
        Object.assign(this, {
            Organizations: eachTaxSubSectionInput.Organisation || "",
            entity: eachTaxSubSectionInput.Entity || "",
            Regions: eachTaxSubSectionInput.Regions || "",
            EffectiveFrom: eachTaxSubSectionInput.EffectiveFrom || "",
            Section: eachTaxSubSectionInput.Section || "",
            SubSectionName: eachTaxSubSectionInput.SubSectionName || "",
            SubSectionDescription: eachTaxSubSectionInput.SubSectionDescription || "",
            SectionType: eachTaxSubSectionInput.SectionType || "",
            InputSource: eachTaxSubSectionInput.InputSource || "",
            CalculationMethod: eachTaxSubSectionInput.CalculationMethod || "",
            Percentage: eachTaxSubSectionInput.Percentage || "",
            LimitationType: eachTaxSubSectionInput.LimitationType || "",
            SubSectionLimit: eachTaxSubSectionInput.SubSectionLimit || "",
            ConsiderforTP3: eachTaxSubSectionInput.ConsiderforTP3 || "",
            LinkedToCode: eachTaxSubSectionInput.LinkedToCode || "",
            SalaryComponent: eachTaxSubSectionInput.SalaryComponent || "",
            AllowProofs: eachTaxSubSectionInput.AllowProofs || "",
            FormulaBuilder: eachTaxSubSectionInput.FormulaBuilder || "",

        })
        cy.log("Constructor Data:", JSON.stringify(eachTaxSubSectionInput));
        console.log("Constructor Data:", JSON.stringify(eachTaxSubSectionInput));
    }

    clickOnElement(selector) {
        cy.get(selector).click()
    }
    enterData(selector, reqData) {
        cy.get(selector).type(reqData)
    }
    // naviagteToEntity() {
    //     cy.NavigateToEntity(this.Organizations, this.entity)
    //     return;
    // }
    // validateTheOrganisation() {
    //     cy.log(this.Organizations)
    //     cy.xpath(`(//div//a[@id="checkinduration1"])[1]`).wait(3000).should('be.visible')//Org name drop down
    //         .invoke('text').then((text) => {
    //             expect(text.trim()).to.equal(this.Organizations)
    //         })
    // }
    // validateTheEntity() {
    //     cy.xpath(`(//div//a[@id="checkinduration1"])[2]`)//Entity name drop down
    //         .invoke('text').then((text) => {
    //             expect(text.trim()).to.equal(this.entity)
    //         })
    // }
    validateTheFinancialYear() {
        /*  /getCurrentFinYear */
        cy.xpath(`//input[@id="financial_year"]`)
            .invoke('val').then((text) => {
                expect(text.trim()).to.equal(this.EffectiveFrom)
            })
    }
    selectTaxSection() {
        cy.get(`#section-type`).click().then(() => {
            cy.get('#section-type .dropdown-menu').should('be.visible')
        })
        cy.get('#section-type .ah-break-word').each(($el, index) => {
            const text = $el.text().trim()
            if (text === String(this.Section)) {
                cy.log(`✅ Row : ${index + 1} :- "${text}" :Tax Section matches with the "${this.Section.trim()}" clicking on it`)
                cy.wrap($el).click()
                    .then(() => {
                        expect(String(text)).to.contain(this.Section.trim())
                    })
            }
        })

    }
    enterSubSectionName() {
        cy.xpath(`(//div//input[@id="sub-section-name"])[1]`)
            .type(this.SubSectionName)
    }
    enterSubSectionDescription() {
        cy.xpath(`(//div//input[@id="sub-section-name"])[2]`)
            .type(this.SubSectionDescription)
    }

    selectSectionType() {
        cy.xpath(`//label[@for="${this.SectionType === "Income" ? "radioNPY1" : "radioNPN1"}"]`).click();
    }

    selectInputSource() {
        if (this.InputSource === "User") {
            cy.xpath(`//label[@for="radioISY"]`).click()
        } else if (this.InputSource === "Automatic") {
            cy.xpath(`//label[@for="radioISA"]`).click()
        } else if (this.InputSource === "Component") {
            cy.xpath(`//label[@for="radioISC"]`).click()
            cy.get('#salary-component').click()
            // selecting the required component from the Configure Component drop down  
            cy.get('#salary-component .ah-break-word').each(($el, index) => {
                const text = $el.text().trim()
                if (text === this.SalaryComponent) {
                    cy.log(`✅ Row ${index + 1}:- "${text}" is matched with the "${this.SalaryComponent}" clicking on it.`)
                    cy.wrap($el).click().then(() => {
                        expect(`${text}`).to.equal(this.SalaryComponent)
                        if (this.AllowProofs === "Yes") {
                            cy.get('[for="leave_category"]').invoke('text').then((text) => {
                                const label = text.trim()
                                cy.get('#allow_proof')
                                    .check({ force: true })
                                    .then(($checkbox) => {
                                        expect($checkbox.is(':checked'), `Checkbox should be checked for: "${label}"`).to.be.true
                                    })
                            })
                        }
                    })
                } else {
                    cy.log(`❌ Row ${index + 1}:- "${text}" is not matched with the "${this.SalaryComponent}" moving to next row.`)

                }
            })
        } //click on config Field and selecting the linked to component code
        else {
            cy.xpath(`//label[@for="radioICF"]`).click()
            cy.get('#checkinduration').click()
            cy.xpath(`//a[@class="dropdown-item ah-text-wrap"]`) // drop down list 
                .each(($el, index) => {
                    const text = $el.text().trim()
                    if (text === this.LinkedToCode) {
                        cy.log(`✅ Row : ${index + 1} :- "${text}" is matched with the "${this.LinkedToCode}" clicking on it.`)
                        cy.wrap($el).click().then(() => {
                            expect(`${text}`).to.equal(this.LinkedToCode)
                        })
                    } else {
                        cy.log(`❌ Row : ${index + 1} :- "${text}" is not matched with the "${this.LinkedToCode}" moving to next.`)

                    }
                })
        }
    }
    selectTheCalculationMetod() {
        if (this.CalculationMethod === "Fixed") {
            cy.xpath(`//label[@for="radioNPY"]`).click()
        } else
            cy.xpath(`//label[@for="radioNPN"]`).click().then(() => {
                cy.xpath(`//input[@placeholder='Enter Percentage']`).type(Number(this.Percentage))
            })
    }

    selectLimitationType() {
        if (this.LimitationType === "Fixed") {
            cy.xpath(`//label[@for="radioNPY2"]`).click()
        } else
            cy.xpath(`//label[@for="radioNPN2"]`).click()
    }

    selectConsideforTP3() {
        if (this.ConsiderforTP3 === "Yes") {
            cy.xpath(`//label[@for="radioTp3Y"]`).click()
        } else
            cy.xpath(`//label[@for="radioTp3N"]`).click()
    }
    enterSubSectionLimit() {
        cy.xpath(`//input[@placeholder='Enter Sub Section Limit']`).type(Number(this.SubSectionLimit))
    }
    /*
        // cy.xpath(`//a[@id="checkinduration"]`)// Select Code to Link 
        // cy.xpath(`//a[@class="dropdown-item ah-text-wrap"]`)//drop down list 
    
    
        // //Let Out Property
        // cy.xpath(`//div[@class="ah-checkbox-wrap"]`)
    
        // //HRA Component
        // cy.xpath(`//label[@for="hraY"]`)//Yes
        // cy.xpath(`//label[@for="hraN"`)//No
    
        // //if HRA == NO
        // // Configure Component
        // cy.xpath(`(//div//a[@id="checkinduration1"])[4]`)
    */
    clickOnCancel() {
        cy.xpath(`//button[@id="request-cancel-btn"]`).click().wait(3000)
    }
    // clickOnSubmit() {
    //     cy.get('#request-cancel-modify').click();
    //     cy.get('#addConfirm .modal-content').should('be.visible');
    //     cy.contains('#addConfirm .modal-content button', 'Confirm').click();
    //     cy.get('#addConfirm .modal-content #request-close').click()
    // }
    clickOnSubmit() {
        cy.get('#request-cancel-modify').click()
        cy.get('#addConfirm .modal-content').should('be.visible');
        cy.get('.ah-confirm-info')
            // .invoke('text').then((text)=>{
            //     cy.log("===",text.trim())
            // })
            .eq(2).should('have.text', 'Are you sure, you want to add this tax sub section?')
        // cy.contains('#addConfirm .modal-content button', 'Confirm').click();
        // cy.get('#addConfirm .modal-content #request-close').click()
        cy.contains('.ah-access-info').eq(2).should('have.text', 'Tax sub section has been added successfully!')

    }


}

export default TaxSubSectionsPageObjects








