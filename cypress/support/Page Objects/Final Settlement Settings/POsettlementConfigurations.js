class SettlementConfiguartions {
    clickOnAddNewButton() {
        cy.get(".ah-btn-set button").click()
    }
    EnterSettlementGrouName() {
        const compName = "New comp"
        cy.get("input[formcontrolname='settlement_group_name'").type(compName)
    }
    getSettlementGroupCode() {
        cy.get("input[formcontrolname='settlement_group_code']")
            .invoke('val') // Get the value of the input field
            .then((settlementGroupCode) => {
                cy.log(settlementGroupCode)
            });
    }
    selectSalaryComponent() {
        cy.get("#checkinduration1").click()
        cy.get(".ah-single-search input").type("Leave Encashment FS")
        cy.get(".dropdown-menu ul a").click()
    }
    
    selectOffBoardingType() {
        cy.get("#offboarding_type").click()
        const OffBoardingType = "Resignation"
        cy.get("#offboarding_type .ah-single-search input").type(OffBoardingType)
        cy.get("#offboarding_type .dropdown-menu ul a").click()
    }
    selectOffBoardingReasons(){
        if (OffBoardingType == "Retirement" || OffBoardingType == "Deceased" || OffBoardingType == "Adhoc Exit") {
            cy.log("No need Off-Boarding Reason(s)");
        }

        else
            cy.get("#multiSelect").click()

        cy.get('.ah-multi-selection .ah-checkbox-wrap label').click();
    }
    clickOnAddSlab(){
        cy.get(".ah-form-section-set .ah-form-section-options button").click()
    }
    enterSlabOrder(){
        cy.get('input[placeholder="Enter Order"]').type(1)
        cy.get(".ah-form-build-container-left .ah-card-outline .ah-card-outline-body").click()
    }

}
export default SettlementConfiguartions

