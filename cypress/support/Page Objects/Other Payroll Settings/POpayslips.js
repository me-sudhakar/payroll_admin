
let data, payslipdata, TemplateName, found = false

before(function () {
    cy.fixture('data').then((fixtureData) => {
        data = fixtureData
    })
    cy.fixture('Payslips/payslip.json').then((payslipFixtures) => {
        payslipdata = payslipFixtures
        TemplateName = payslipdata.PayslipDetails.TemplateName //Payslip Template Name 
    })
})


class PayslipTemplateLocators {
    clickOnElement(selector) {
        cy.get(selector).click()
    }
    enterData(selector, reqData) {
        cy.get(selector).type(reqData)
    }

    /*****************Page Objects start here********************/
    clickOnAddNewButton() {
        this.clickOnElement('.ah-btn-icon')
    }
    SelectTheOrg() {
        this.clickOnElement('#org')
        this.enterData('#org .ah-single-search', payslipdata.PayslipDetails.Organisation)
        this.clickOnElement('#org .ah-break-word')
        cy.get('#org .ah-break-word').invoke('text').then((text) => {
            expect(text.trim()).to.equal(payslipdata.PayslipDetails.Organisation)
        })
    }

    SelectTheEntity() {
        cy.get('#entity').click()
        cy.get('#entity .ah-single-search').type(payslipdata.PayslipDetails.Entity)
        this.clickOnElement('#entity .ah-break-word')
        cy.get('#entity .ah-break-word').invoke('text').then((text) => {
            expect(text.trim()).to.equal(payslipdata.PayslipDetails.Entity)
        })
    }

    enterTemplateName() {
        cy.get('#template_name').type(payslipdata.PayslipDetails.TemplateName)
    }

    selectEmployeeFields() {
        const employeeDataFields = payslipdata.EmployeeFields.employeeFields
        employeeDataFields.forEach(element => {
            cy.log(element)
            cy.contains('.ah-badge-white-filter', element).click()
            cy.contains('.ah-badge-white-filter', element).invoke('text').then((text) => {
                expect(text.trim()).to.equal(element);
            })

        })
    }

    selectAttendanceTags() {
        const AttendanceTags = payslipdata.AttendanceFields.AttendanceTags
        AttendanceTags.forEach(element => {
            cy.log(element)
            cy.contains('.ah-badge-white-filter', element).click()
            cy.contains('.ah-badge-white-filter', element).invoke('text').then((text) => {
                expect(text.trim()).to.equal(element);
            })

        })
    }

    SelectLeaveDetails() {
        const LeaveDetails = payslipdata.LeaveDetails.leaveToggle
        const leaveTags = payslipdata.LeaveDetails.leaveTags
        const selectAllLeaveTypes = payslipdata.LeaveDetails.selectAll
        cy.log(LeaveDetails)
        if (LeaveDetails === 'Yes') {
            cy.get('label[for="LeaveDetails"]').click()
            cy.get('#LeaveDetails').should('be.checked').then(() => {
                cy.log('Leave Details are selected')
            })
            cy.get('.ah-alert-text').invoke('text').then((text) => {
                if (text.includes('Choose')) {
                    cy.wrap(text.trim())
                        .should('contain', 'Click "Choose" to select the required leave type(s) to display on the pay slip.');
                    this.clickOnElement('.ah-alert-basic .ah-btn')
                    //selecting the leaves
                    leaveTags.forEach((leaveType) => {
                        cy.log(`Leave Type Name : ${leaveType}`)
                        if (selectAllLeaveTypes === 'Yes') {
                            cy.get('.ah-selection-strip :nth-child(3)').click()   //will Click On Select All 
                        } else
                            cy.get('.ah-overflow-y .ah-checkbox-wrap').each(($el) => {
                                const text = $el.find('label').text().trim()
                                if (text === leaveType) {
                                    cy.log(`Selected Leave Type: ${text}`)
                                    cy.wrap($el).find('input[type="checkbox"]').check({ force: true })
                                    expect(text).to.equal(leaveType)
                                }
                            })
                    })
                    // Get the count and compare it with the selected leave types 
                    cy.get('.count').invoke('text').then((text) => {
                        let count = text.split(" ")
                        cy.log(count[0])
                        cy.get('.ah-overflow-y .ah-checkbox-wrap input[type="checkbox"]:checked')
                            .then((selectedCheckBoxes) => {
                                const selectedLeaves = selectedCheckBoxes.length
                                const formattedCount = `0${selectedLeaves}`
                                cy.log(`Total Leaves Selected: ${formattedCount}`);
                                expect(formattedCount).to.equal(count[0])
                            });
                    })
                    this.clickOnElement('#configLeaveStructure .modal-content .modal-footer #request-cancel')
                } else {
                    cy.wrap(text.trim())
                        .should('contain', 'Click "Modify" to select the required leave type(s) to display on the pay slip.');
                    this.clickOnElement('.ah-alert-basic .ah-btn')
                }
            });

        } else {
            cy.log('Leave Details are not configured, Please check the inputs provided')
        }
    }
    clickOnCancel() {
        cy.get('#close_selection').click({ force: true })
    }
    clickOnCancelButton() {
        this.clickOnElement('#configLeaveStructure .modal-content .modal-footer #request-cancel-confirm')
    }
    getTheSelectedLeaveTags() {
        const leaveTags = payslipdata.LeaveDetails.leaveTags
        leaveTags.forEach((leaveType) => {
            cy.get('.filter-strip .ah-badge-white-filter').each(($el) => {
                cy.wrap($el).invoke('text').then((text) => {
                    text = text.trim()
                    if (leaveTags.includes(text)) {
                        cy.log(`Selected Leave Tag: ${text}`)
                    } else
                        cy.wrap($el).find('.fa-times').click()
                })
            })
        })
    }
    SelectTaxDeatails() {
        // clickOnTaxDetailsToggle() {
        const taxDetails = payslipdata.TaxDetails.TaxDetails
        if (taxDetails === 'Yes') {
            cy.get('label[for="taxDetails"]').click()
            //cy.get('label[for="taxDetails"]').should('be.checked')
            cy.get('#taxDetails').should('be.checked').then(() => {
                cy.log('TAX Details are selected')
            })
        } else {
            cy.log('TAX Details are not configured, Please check the inputs provided')
        }
        //const taxDetails = payslipdata.TaxDetails.TaxDetails
        const YTDTaxDetails = payslipdata.TaxDetails.YTDTaxDetails
        if (taxDetails === 'Yes' & YTDTaxDetails === 'Yes') {
            //cy.get('label[for="ytds"]').click()
            cy.get('#ytds').check({ force: true }).should('be.checked')
            cy.log("YTD Tax Details are selected ")
        } else {
            cy.get('#ytdno').check({ force: true }).should('be.checked')
            cy.log("YTD Tax Details are not selected")
        }
        const hraTaxDetails = payslipdata.TaxDetails.TaxDetails
        // const taxDetails = payslipdata.TaxDetails.HRATaxDetails
        if (taxDetails === 'Yes' & hraTaxDetails === 'Yes') {
            cy.get('#hras').check({ force: true }).should('be.checked')
            cy.log("HRA Tax Details are selected ")
        } else {
            cy.get('#hrano').check({ force: true }).should('be.checked')
            cy.log("HRA Tax Details are not selected ")
        }
    }
    allowancesCount() {
        cy.get('.ah-form-section-set .ah-card-outline .ah-title').eq(0).invoke('text')
            .then((text) => {
                cy.log(text)
                cy.get('.ah-form-section-set .ah-card-outline .ah-title .ah-count-badge').eq(0).invoke('text')
                    .then((count) => {
                        cy.log(text + ":" + count)
                    })
            })
    }
    SelectAllowances() {
        const allowanceToggle = payslipdata.SalaryStructure.Allowances.SwitchAllowanceToggle
        const YTDallowance = payslipdata.SalaryStructure.Allowances.AllowanceYTD
        const selectAlltheAllowances = payslipdata.SalaryStructure.Allowances.SelectAlltheAllowances
        const reqAllowances = payslipdata.SalaryStructure.Allowances.ReqAllowances
        if (allowanceToggle === "Yes") {
            cy.get('.ah-form-section-set .ah-card-outline').eq(0).find('#switchBenefits_0')
                .click({ force: true }).should('be.checked')
            cy.log("You've selected the Allowance Toggle switch")
            //Selecting YTD in Allowances
            if (YTDallowance === 'Yes') {
                cy.get('#ytd_0').check({ force: true }).should('be.checked')
                cy.log('YTD checkbox is selected in Allowances ')
            }
            else {
                cy.log("Allowance YTD was not selelcted")
            }
            //Selecting the Required Allowances
            if (selectAlltheAllowances === 'Yes') {
                cy.get('#benefits_0').check({ force: true }).should('be.checked')
                cy.log("You've selected all the Allowance")
            } else {
                reqAllowances.forEach((reqAllowances) => {
                    cy.log(`requiredAllowances : ${reqAllowances}`)
                    cy.get('.ah-card-outline-body .ah-check-list-container .ah-checkbox-wrap label[for^="benefits_0"]')
                        .each(($el) => {
                            const text = $el.text().trim()
                            if (text === String(reqAllowances)) {
                                cy.log(`"${text}":"${reqAllowances}"`)
                                //cy.log(`Found: ${text}`)
                                cy.wrap($el).click().should('contain.text', String(reqAllowances))
                            }
                        })
                })
            }
        }
        else {
            cy.log("Allowance toggle is not selected, Please check the inputs provided")
        }
    }
    SelectBenefits() {
        const YTDbenefits = payslipdata.SalaryStructure.Benefits.BenefitsYTD
        const BenefitsToggle = payslipdata.SalaryStructure.Benefits.SwitchBenefitsToggle
        const selectAlltheBenefits = payslipdata.SalaryStructure.Benefits.SelectAlltheBenefits
        const requiredBenefits = payslipdata.SalaryStructure.Benefits.reqBenefits
        //Switching the Benefits Toggle 
        if (BenefitsToggle === "Yes") {
            cy.get('#switchBenefits_1').click({ force: true }).should('be.checked')
            cy.log("You've selected the Benefits Toggle switch")
            //Selecting YTD 
            if (YTDbenefits === 'Yes') {
                cy.get('#ytd_1').check({ force: true })
                cy.log('YTD checkbox is selected in Benefits')
            }
            else {
                cy.log("Benefits YTD was not selelcted")
            }

            if (selectAlltheBenefits === 'Yes') {
                cy.get('#benefits_1').check({ force: true }).should('be.checked')
            } else
                requiredBenefits.forEach((reqBenefit) => {
                    cy.log('label[for^="benefits_1"]').each(($el) => {
                        const text = $el.text().trim()
                        if (text === String(reqBenefit)) {
                            cy.log(`Found: ${text}`)
                            cy.wrap($el).click().should('contain.text', String(reqBenefit))
                        }
                    })
                })

        } else {
            cy.log("Benefits toggle is not selected, Please check the inputs provided")
        }

    }
    SelectDeductions() {
        const DedToggle = payslipdata.SalaryStructure.Deductions.SwitchDeductionsToggle
        const YTDdeductions = payslipdata.SalaryStructure.Deductions.DeductionsYTD
        const selectAlltheDeductions = payslipdata.SalaryStructure.Deductions.SelectAlltheDeductions
        const reqDeductions = payslipdata.SalaryStructure.Deductions.reqDeductions
        if (DedToggle === "yes") {
            cy.get('#switchBenefits_2').click({ force: true }).should('be.checked')
            cy.log("You've selected the Deductions Toggle switch")

            //Selecting YTD in Deductions
            if (YTDdeductions === 'Yes') {
                cy.get('#ytd_2').check({ force: true })
            }
            else {
                cy.log("Deductions YTD was not selelcted")
                // cy.get('#ytd_2').check({ force: true })
            }
            if (selectAlltheDeductions === 'Yes') {
                cy.get('#benefits_2').check({ force: true }).should('be.checked')
            } else {
                reqDeductions.forEach((reqDeductions) => {
                    cy.log(`requiredAllowances : ${reqDeductions}`)
                    cy.get('.ah-card-outline-body .ah-check-list-container .ah-checkbox-wrap label[for^="benefits_2"]').each(($el) => {
                        const text = $el.text().trim()
                        if (text === String(reqDeductions)) {
                            cy.log(`Found: ${text}`)
                            cy.wrap($el).click().should('contain.text', String(reqDeductions))
                            //cy.get(`#${$el.attr('for')}`).should('be.checked')
                        }
                    })
                })
            }
        } else {
            cy.log("Deductions toggle is not selected, Please check the inputs provided")
        }
    }
    ShowMasterDatainAllowances() {
        const masterAllowanceToggle = payslipdata.ShowMasterDatainAllowances
        cy.get('#ytd_0').then(($checkbox) => {
            if (!$checkbox.is(':checked') && (masterAllowanceToggle === "Yes")) {
                // If not checked, click the master data allowance label
                cy.get(`label[for='masterDataAllowance']`).click();
            } else {
                // Log if it is already checked
                cy.log("AS 'YTD' is already selected in allowance, so master allowances cannot be selected");
            }
        })
    }
    selectPageSize() {
        const PageSize = payslipdata.PageSize
        if (PageSize === "A4") {
            cy.get(`img[src='/assets/images/page-A4.png']`).click()
        } else if (PageSize === "A5") {
            cy.get(`img[src='/assets/images/page-A5.png']`).click()
        } else {
            cy.log("Given page size is not available")
        }
    }
    HeaderAndFooter() {
        cy.get('.ah-card-header .ah-switch-text ').invoke('text').then((text) => {
            cy.log(text)
            cy.get('#payslipHeaderLabel').should('be.checked')
        })
    }
    clickOnFinalSubmitButton() {
        cy.get('.ah-form-card-footer-right .ah-btn').click()
        cy.get('#submitTemp .modal-dialog .modal-content .ah-confirm-info').invoke('text').then((text) => {
            const trimmedText = text.trim()
            cy.log(trimmedText)
            expect(text.trim()).to.equal('Are you sure, you want to add this Template?');
            if (trimmedText.includes('Are you sure, you want to add this Template?')) {
                cy.log('Matches with the text: Clicking on Confirm')
                cy.get('#submitTemp .modal-dialog .modal-content .modal-footer .ah-btn').wait(2000).click()
            }
            else {
                cy.log('Does not Matches with the text: Clicking on Cancel')
                cy.get('#submitTemp .modal-dialog .modal-content .modal-footer #request-cancel-confirm').click()
            }
        })
        // cy.get('#submitTemp .modal-dialog .modal-content .modal-footer #request-cancel').click()

    }
    successfullMessage() {
        TemplateName = payslipdata.PayslipDetails.TemplateName
        cy.wait(2000)
        cy.get('#submitTemp .modal-dialog .modal-content .modal-body .ah-access-content .ah-access-info').invoke('text')
            .then((text) => {
                const trimmedText = text.trim();
                if (trimmedText === 'Failed to add template.') {
                    cy.get('#toastr-container .toastr-message').should('be.visible').invoke('text').then((text) => {
                        cy.log(text + ". Please Change the Template Name.")
                        cy.get('#submitTemp .modal-dialog .modal-content .modal-body .ah-access-content #request-submit-close')
                            .wait(5000).click()
                        throw new Error('Payslip template creation failed.\n' + text + ". Please change the Template Name.")
                    })
                } else if (trimmedText === 'Template added successfully.') {
                    cy.log(trimmedText)
                    //clikcing on the confirm button
                    cy.get('#submitTemp .modal-dialog .modal-content .modal-body .ah-access-content #request-submit-close')
                        .wait(5000).click()
                    // const newTemplateName = TemplateName
                    cy.get('.ah-table tbody tr').each(($row) => {
                        cy.wrap($row).find('td').eq(0).invoke('text').then((text) => {
                            const ExtarctedTemplateName = text.trim()
                            if (ExtarctedTemplateName === TemplateName) {
                                expect(ExtarctedTemplateName, `Template "${ExtarctedTemplateName}" does not match`).to.equal(TemplateName)
                            } else {
                                cy.log(`Template "${ExtarctedTemplateName}" does not match the new template.`)
                            }
                        });
                    });
                }
            })
    }
    ViewDetails() {
        let found = true
        cy.get('tbody tr').wait(3000).each(($row, index) => {
            cy.wrap($row).find('td:nth-child(1)').invoke('text').then((text) => {
                if (!found) return
                const colText = text.trim()
                if (colText === payslipdata.PayslipDetails.TemplateName) {
                    cy.log(`Row ${index + 1}: ${colText}`)
                    expect(colText, `Match Found at Row:"${index + 1}"`).to.equal(payslipdata.PayslipDetails.TemplateName)
                    cy.wrap($row).find('.ah-table-action').click()
                    cy.wrap($row).find('.ah-table-action').find('.dropdown-menu-right .dropdown-item').contains('View Details').click()
                    cy.get('.title-details .title').invoke('text').then((text) => {
                        expect('have.text', text).to.equal(TemplateName)
                    })
                    found = false
                }
                else {
                    cy.log(`Match not found at Row:"${index + 1}" moving to next row`)
                }
            })
        })
    }

}

export default PayslipTemplateLocators




