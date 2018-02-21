"use strict";

Module.register("MMM-MonthlyCalendar", {

  // default values
  defaults: {
    // Module misc
    name: "MMM-MonthlyCalendar",
    hidden: false,
    updatesEvery: 120,         // How often should the table be updated in s?

    // user definable
    weeksInFuture: 10
  },


  start: function () {

  },

  getDom: function () {
    let domBuilder = new DomBuilder(this.config, this.translate);

    return domBuilder.getDom();
  },

  getScripts: function () {
    return [
      this.file("core/DomBuilder.js"),
      "moment.js"
    ];
  },

  getStyles: function () {
    return [
      this.file("css/styles.css")
    ];
  }
});
