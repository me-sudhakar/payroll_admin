class PageCodes {
    getModuleName() {
        return cy.get('.ah-title')
      }
  
    getEntity() {
      return cy.get('.ah-sublvl-list-set-item');
    }
          
    getSubModule() {
      return cy.get('.ah-btn-link')
    }
  
    getEmployeeIDSearch() {
      return cy.get('#column-search-input');
    }
    getEmployeeIDcolumnSearch() {
        return cy.get('.ah-column-search-results .ah-column-search-main-title')
      }
  
    getSearchButton() {
      return cy.get('.is-search');
    }
    responseLocation() {
        return ('.table-responsive table tbody tr td:nth-child(2)')
      }
    getEmployeeIDresponse() {
      return cy.get('.table-responsive table tbody tr td:nth-child(2)');
    }
  
    getPayCycleItems() {
      return cy.get('.owl-item');
    }
  }
  
  export default PageCodes
  