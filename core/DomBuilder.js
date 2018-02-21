"use strict";

class DomBuilder {
  constructor(config, translate) {
    this.config = config;
    this.translate = translate;

    this.month = 3;
  }


  getDom() {
    let wrapper = document.createElement("div");
    let table = document.createElement("table");
    let tHead = document.createElement("thead");
    let tBody = document.createElement("tbody");
    let day = 1;

    tHead.appendChild(this.getWeekdaysRow());

    for (let i = 0; i < 5; i++) {
      let row = this.getCalendarRow(i);
      tBody.appendChild(row);
    }

    table.appendChild(tHead);
    table.appendChild(tBody);
    table.className = "mcTable";
    wrapper.appendChild(table);
    wrapper.className = "xsmall";

    this.getCalendarRow();

    return wrapper;
  }


  getWeekdaysRow() {
    let row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
      let weekday = moment().weekday(i).format("dd");
      let cell = document.createElement("th");
      cell.className = "mcHeaderWeekday bright";
      cell.innerHTML = weekday;

      row.appendChild(cell);
    }

    return row;
  }


  getCalendarRow(weekInMonth) {
    let startOfMonth = moment().month(this.month - 1).startOf("month");
    let endOfMonth = moment().month(this.month - 1).endOf("month");
    let startDay = startOfMonth.weekday();
    let endDay = endOfMonth.date();

    let row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
      let cell = document.createElement("td");
      let dayDiv = document.createElement("div");
      dayDiv.className = "mcCalendarDay bright";

      let normalizedDay = i + weekInMonth * 7;

      if (normalizedDay >= startDay && normalizedDay - startDay < endDay) {
        dayDiv.innerHTML = normalizedDay - startDay + 1;
        cell.appendChild(dayDiv);
      }

      let eventDiv = document.createElement("div");
      eventDiv.className = "mcEvent";
      eventDiv.innerHTML = Math.random() < 0.5 ? "ProBaug" : "&nbsp;";

      let locationDiv = document.createElement("div");
      locationDiv.className = "mcLocation dimmed";
      locationDiv.innerHTML = "Wiesbaden";

      cell.appendChild(eventDiv);
      cell.appendChild(locationDiv);
      row.appendChild(cell);
    }

    return row;
  }
}