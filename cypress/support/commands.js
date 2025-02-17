// /*// ***********************************************
// // This example commands.js shows you how to
// // create various custom commands and overwrite
// // existing commands.
// //
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands
// // ***********************************************
// //
// //
// // -- This is a parent command --
// // Cypress.Commands.add('login', (email, password) => { ... })
// //
// //
// // -- This is a child command --
// // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
// //
// //
// // -- This is a dual command --
//   // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//   //
// //
// // -- This will overwrite an existing command --
// // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... }

// // cypress/support/commands.js*/

/**********************************************************************************************************************************************************************/
//To login into Admin
Cypress.Commands.add('LoginToAdmin', () => {
  const filePath = 'cypress/fixtures/excelData/exceldata.xlsx'
  const sheetName = 'Login'
  cy.readSheetData(filePath, sheetName).then((excelData) => {
    const LoginData = excelData[0]
    cy.log(LoginData.url)
    cy.visit(LoginData.url)
    cy.log("➡️logging into the " + LoginData.url)
    cy.xpath('//input[@id="username"]').type(LoginData.username)
    cy.get('#password').type(LoginData.password)
    cy.get('.ah-login-btn').click()
    cy.log("Succesfully logged into the Admin Settings")
  })
})


/**********************************************************************************************************************************************************************/
Cypress.Commands.add('clickOnAddNew', () => {
  cy.xpath("//button[@class='ah-btn ah-btn-icon']").click()
})

/**********************************************************************************************************************************************************************/
//TO Navigate to Payroll
Cypress.Commands.add('NavigateToPayrollModule', () => {
  return cy.LoginToAdmin().then(() => {
    cy.get('.ah-title').contains("Payroll Management").click()
    cy.log("💹Navigating to the Payroll Management module")
  })
  /*
  // cy.fixture('data').then((data) => {
  //   const url = data.login.url
  //   const username = data.login.userName
  //   const password = data.login.password
  //   //cy.visit(Cypress.env('url'));
  //   cy.visit(url)
  //   cy.xpath('//input[@id="username"]').type(username)
  //   cy.get('#password').type(password)
  //   cy.get('.ah-login-btn').click()
  //   cy.get('.ah-title').contains("Payroll Management").click()
  // });
*/
});
/**********************************************************************************************************************************************************************/

//To Select and validate element from Dropdown field 
Cypress.Commands.add('dropdown', (placeHolder, locator, option) => {
  cy.get('a').contains(placeHolder).click()
  cy.get(locator).contains(option).click()
})
/**********************************************************************************************************************************************************************/

//To select an element by placeholder 
Cypress.Commands.add('SelectByInputField', (plcHolder, enterName) => {
  const valueToType = enterName || '0'
  cy.get('input[placeholder="' + plcHolder + '"]').type(valueToType)
})
/**********************************************************************************************************************************************************************/

//To read the Excel sheet 
Cypress.Commands.add('readExcelData', (filePath, sheetName) => {
  const XLSX = require('xlsx')
  return cy.readFile(filePath, 'binary').then((content) => {
    try {
      const workbook = XLSX.read(content, { type: 'binary' })
      const worksheet = workbook.Sheets[sheetName];
      if (!workbook) throw new Error(`Sheet"${sheetName}" not found,Please check!`);
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      return data;
    }
    catch (error) {
      throw new Error(`Error reading Excel File: ${error.message}`)
    }
  })
})
/**********************************************************************************************************************************************************************/

//TO read data from the Excel sheet
Cypress.Commands.add('readSheetData', (filePath, sheetName) => {
  return cy.readExcelData(filePath, sheetName).then((data) => {
    const keys = data[0]
    const array = []
    for (let i = 1; i < data.length; i++) {
      const obj = {}
      data[i].forEach((value, index) => {
        obj[keys[index]] = value;
      });
      array.push(obj)
    }
    return array
  })
})
/**********************************************************************************************************************************************************************/

//To navigate to the respective Entity
// Cypress.Commands.add('NavigateToEntity', (organisationName, entityName) => {
//   cy.get(".ah-lvl-list-set .ah-lvl-list-set-item").each(($org) => {
//     const orgName = $org.text().trim();
//     if (!orgName === organisationName.trim()) {
//       cy.log("org not found")
//       throw new Error("Org not found")
//     } else {
//       cy.wrap($org).invoke('text').then((text) => {
//         expect(text.trim()).to.equal(organisationName.trim())
//       })
//       cy.wrap($org).next(".ah-sublvl-list")
//         .find(".ah-sublvl-list-set-item").each(($entity) => {
//           const entity = $entity.text().trim();
//           if (entity === entityName) {
//             cy.wrap($entity).click()
//             expect(entity).to.equal(entityName.trim())
//             cy.log("Organization:" + orgName + " And " + '\n' + "Entity:" + entity)
//             return false;
//           }
//         })
//       return false;
//     }
//   }
//     //}
//   )
// })

/**********************************************************************************************************************************************************************/
// Navigate to the respective region
Cypress.Commands.add('NavigateToRegion', (regionName) => {  
  cy.get('.ah-lvl-list-set').each(($eachItem, index) => {
    const region = $eachItem.text().trim();
    if (region === regionName.trim()) {
      cy.wrap($eachItem).should('be.visible').click({ force: true })
      cy.log(`✅ Row ${index + 1}: Matched "${regionName}" with "${region}". Clicking on it.`)
        .then(() => {
          expect(region, `Extracted region "${region}" should match input region "${regionName}"`)
            .to.equal(regionName.trim());
        })
      return false;
    } else {
      cy.log(`❌ Row ${index + 1}: "${regionName}" did not match "${region}". Moving to the next row.`);
    }
  });
});


/**********************************************************************************************************************************************************************/
// clicking on View Details
Cypress.Commands.add("ViewDetails", (recordName,colIndex) => {
  let found = false 
  cy.wait(5000)
  cy.xpath('//tbody//tr').should('exist').each(($row, index) => {
    if (found) return false;
   // cy.wrap($row).find(`td:eq(${colIndex})`).invoke('text').then((text)
    cy.wrap($row).find(`td:eq(${colIndex})`).invoke('text').then((text) => {
      const colText = text.trim();
      if (colText === recordName) {
        cy.log(`✅ Match Found at Row ${index + 1}: ${colText}`);
        expect(colText, `Match Found at Row: ${index + 1}`).to.equal(recordName);
        cy.wrap($row)
          .find('.ah-table-action').click();
        cy.wrap($row)
          .find('.ah-table-action .dropdown-menu-right .dropdown-item')
          .should('be.visible')
          .contains('View Details')
          .click();
        found = true;
      } else {
        cy.log(`❌ ${recordName}: No Match at Row ${index + 1}, moving to next row...`);
      }
    });
  });
})

/**********************************************************************************************************************************************************************/
//Common Page level Functonlities

//Search field
Cypress.Commands.add("searchField", (searchInput, columnName) => {
  cy.xpath(`//input[@id="column-search-input"]`).type(searchInput).then(() => {
    cy.xpath(`//ul[@id="ah-column-search"]//span[@class="ah-column-search-main-title"]`)
      .each(($el, index) => {
        const text = $el.text().trim()
        cy.log(`Checking: ${text} at index ${index + 1}`)
        if (text === columnName) {
          cy.wrap($el).click()
          cy.log("✅ Found and clicked! on the " + text)
          cy.get('.fa-check').click()
          return false
        }
        else {
          cy.log(text + " ❌ not found")
        }
      })
  });
});
