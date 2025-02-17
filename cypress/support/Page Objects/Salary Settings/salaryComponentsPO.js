class SalaryComponentsPageObjects {
    constructor(salCompData = {}) {
        Object.assign(this, {
            Regions: salCompData.Regions || ""
        })
        cy.log("Constructor Data:", JSON.stringify(salCompData));
        console.log("Constructor Data:", JSON.stringify(salCompData));
    }
    // cy.xpath('//div[contains(@class, "ah-title") and contains(text(), "Add Salary Component")]').should('contains', ' Add Salary Component ')
    //Component Details
    componentName() {
        cy.get('#comp_name').type(item.ComponentName)
    }
    remcode() {
        cy.get('#comp_code').type((item.ComponentCode))
        // cy.get('#disp_name').invoke('text').then((text) => {
        //     text = text.trim()
        //     expect(text).to.be.equal(item.ComponentName)
        // })
        cy.get('#comp_order').type(item.ComponentOrder)

        //selecting link to module 
        cy.get(`app-common-search-single-select[formcontrolname="module_type"]`).click()
            .find('.ah-break-word').each(($el) => {
                if ($el.text().trim() === item.LinkToModule) {
                    cy.wrap($el).click()
                }
            })
        cy.log("@@@@@@@@@@@@@")
        //selecting the Component Calculation Type
        if (item.LinkToModule === 'Attendance') {
            cy.xpath(`//app-common-search-single-select[@id='leave-cat1']//i[@class='far fa-times']`).click()
        }
        cy.xpath(`(//app-common-search-single-select[@id='leave-cat1'])[1]`).click().within(() => {
            cy.log("!!!!!!!!!!!")
            cy.get('.ah-break-word').each(($el) => {
                if ($el.text().trim() === item.ComponentCalculationType) {
                    cy.wrap($el).click()
                }
            })
        })
        cy.log('$$$$$$$$$')

        //selecting the ComponentType 

        if (item.LinkToModule != 'Attendance' && item.ComponentCalculationType != 'Statutory Deduction') {
            cy.get('app-common-search-single-select[formcontrolname="comptype_value"]').click().within(() => {
                cy.log('%%%%%%%%%%%%%')
                cy.get('.ah-break-word').each(($el) => {
                    if ($el.text().trim() === item.ComponentType) {
                        cy.wrap($el).click()
                    }
                })
            })
        }

        //selecting Tax Exemeption Yes or not
        if (item.LinkToModule === 'Payroll' && item.ComponentCalculationType === 'Other Deduction') {
            item.TaxExemption === 'Yes' ?
                cy.get('#radioTAY1').check({ force: true }) :
                cy.get('#radioTAN1').check({ force: true })
        }

        //selecting Taxable Yes or not
        // if (item.LinkToModule === 'Payroll' && item.ComponentCalculationType === 'Allowance'
        // ) {
        if (item.LinkToModule === 'Payroll' && item.ComponentCalculationType === 'Allowance') {
            (item.TaxableComponent === 'Yes') ?
                cy.get('#radioTAY').check({ force: true }) :
                cy.get('#radioTAN').check({ force: true })
        }// && 


        if (item.LinkToModule === 'Payroll' && item.ComponentCalculationType === 'Statutory Deduction') {
            item.ComponentIsPartOf === 'Employee Contribution' ?
                cy.get('#radioEmY').check({ force: true }) :
                cy.get('#radioEmN').check({ force: true })
        }


        //Allow partial tax deduction
        if (item.LinkToModule === 'Payroll' &&
            item.ComponentCalculationType === 'Allowance' &&
            item.TaxableComponent === 'Yes'
        ) {
            item.AllowPartialTaxDeduction === 'Yes' ?
                cy.get('#radioPDY').check({ force: true }) :
                cy.get('#radioPDN').check({ force: true })
        }

        //Part of Master Salary
        if (item.LinkToModule === 'Payroll') {
            item.PartOfMasterSalary === 'Yes' ?
                cy.get('#radioNPY').check({ force: true }) :
                cy.get('#radioNPN').check({ force: true })
        }

        //Part of Earnings/Deductions
        if (item.LinkToModule != 'Attendance') {
            item.PartofEarningsOrDeductions === 'Yes' ?
                cy.get('#radioPY').check({ force: true }) :
                cy.get('#radioPN').check({ force: true })
        }

        //selecting Prorate upon Attendance
        cy.log("💹💹💹💹selecting Prorate upon Attendance")
        if (item.LinkToModule != 'Attendance' && item.ComponentType != 'Variable') {
            if (item.ProrateuponAttendance === 'Yes') {
                cy.get('#radioas').check({ force: true }).then(() => {
                    cy.get("#leave-cat-prorate-type").click().within(() => {
                        cy.get('.ah-break-word').each(($el) => {
                            if ($el.text().trim() === item.ProrateType) {
                                cy.wrap($el).click()
                            }
                        })
                    })
                })
            } else {
                cy.log("selecting Prorate upon Attendance as NO")
                cy.get('#radioFL').check({ force: true });
            }
        }

        // cy.xpath(`//div[contains(@class, 'ah-form-section-heading') and contains(text(), 'Payment Parameters')]`).as('PaymentParameters')
        //cy.xpath(`//a[contains(@id, 'checkinduration1') and contains(text(), 'Select Payment Type')]`).click()

        //selecting Payment Type
        cy.log(`👀👀👀👀 Payment type`)

        cy.get('app-common-search-single-select[formcontrolname="component_type"]')
            .invoke('text')
            .then((text) => {
                if (text.trim() === 'Statutory Deduction') {
                    cy.get('.ah-break-word').each(($el) => {
                        if ($el.text().trim() === item.PaymentType) {
                            cy.wrap($el).click()
                        }
                    })
                }
            })



        //Round Off Type 
        cy.xpath(`//a[contains(@id, 'checkinduration1') and contains(text(), 'Select Round Off Type')]`).click();
        cy.xpath(`//a[contains(@id, 'checkinduration1')]/parent::div//span[@class="ah-break-word"]`)
            .should('be.visible')
            .each(($el) => {
                if ($el.text().trim() === item.RoundOffType) {
                    cy.wrap($el).click()
                    return false
                }
            })


        //Arrear Calculation 
        item.ArrearCalculation === 'Yes' ?
            cy.get('#radioNPq').check({ force: true }) :
            cy.get('#radioNP1').check({ force: true })


        //View In Report
        item.ViewInReport === 'Yes' ?
            cy.get('#radioVIR').check({ force: true }) :
            cy.get('#radioVIR1').check({ force: true })

        // cy.pause()
        cy.get('.ah-form-card-footer-right #request-cancel-modify').should('not.be.disabled')

        cy.get('.ah-form-card-footer-right > #request-cancel-btn').click().wait(2000)
    }

}

export default SalaryComponentsPageObjects