const { defineConfig } = require("cypress");
const path = require("path");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

module.exports = defineConfig({

  e2e: {
    specPattern: "cypress/e2e/**/*.js",
    defaultCommandTimeout: 60000,
    requestTimeout:30000,
    pageLoadTimeout:100000,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
