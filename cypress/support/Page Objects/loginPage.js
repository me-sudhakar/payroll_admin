class DashboardData {

    getModuleName() {
        return cy.get('.ah-title')
    }
    getSubModule() {
        return cy.get('.ah-btn-link')
    }
    getEntity() {
        return cy.get('.ah-sublvl-list-set-item');
    }

}
export default DashboardData


