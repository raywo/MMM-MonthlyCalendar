"use strict";

Module.register("MMM-MonthlyCalendar", {

  // default values
  defaults: {
    // Module misc
    name: "MMM-MonthlyCalendar",
    hidden: false,
    updatesEvery: 120         // How often should the table be updated in s?
  },


  start: function () {

  },

  getDom: function () {
    let wrapper = document.createElement("div");
    let table = document.createElement("table");
    let tBody = document.createElement("tbody");
    let day = 1;

    for (let i = 0; i < 5; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        let dayDiv = document.createElement("div");
        dayDiv.className = "mcCalendarDay bright";
        dayDiv.innerHTML = day;
        day++;

        let eventDiv = document.createElement("div");
        eventDiv.className = "mcEvent";
        eventDiv.innerHTML = Math.random() < 0.5 ? "ProBaug" : "&nbsp;";

        let locationDiv = document.createElement("div");
        locationDiv.className = "mcLocation dimmed";
        locationDiv.innerHTML = "Wiesbaden";

        cell.appendChild(dayDiv);
        cell.appendChild(eventDiv);
        cell.appendChild(locationDiv);
        row.appendChild(cell);
      }

      tBody.appendChild(row);
    }

    table.appendChild(tBody);
    table.className = "mcTable";
    wrapper.appendChild(table);
    wrapper.className = "xsmall";

    return wrapper;
  },

  getStyles: function () {
    return [
      this.file("css/styles.css")
    ];
  }
});
