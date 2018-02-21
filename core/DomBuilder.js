"use strict";

class DomBuilder {
  constructor(config, translate) {
    this.config = config;
    this.translate = translate;

    this.events = this.generateFakeData();
  }


  getDom() {
    let wrapper = document.createElement("div");
    let table = document.createElement("table");

    table.appendChild(this.getTableHeader());
    table.appendChild(this.getTableBody());
    table.className = "mcTable";

    wrapper.appendChild(table);
    wrapper.className = "xsmall";

    return wrapper;
  }


  getTableHeader() {
    let tHead = document.createElement("thead");
    tHead.appendChild(this.getWeekdaysRow());

    return tHead;
  }


  getTableBody() {
    let tBody = document.createElement("tbody");

    let today = moment();

    for (let i = 0; i < this.config.weeksInFuture; i++) {
      let referenceDay = today.clone().add(7 * i, "days");
      let startDate = referenceDay.clone().startOf("week");

      let row = this.getCalendarRow(startDate);
      tBody.appendChild(row);
    }

    return tBody;
  }


  getWeekdaysRow() {
    let row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
      let weekdayName = moment().weekday(i).format("dd");
      let cell = document.createElement("th");
      cell.className = "mcHeaderWeekday bright";
      cell.innerHTML = weekdayName;

      row.appendChild(cell);
    }

    return row;
  }


  getCalendarRow(startDate) {
    let row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
      let cell = document.createElement("td");
      let currentDate = startDate.clone().add(i, "days");
      let dayDiv = this.getDayDiv(currentDate);

      cell.appendChild(dayDiv);
      cell.appendChild(this.getEventsForDay(currentDate));

      row.appendChild(cell);
    }

    return row;
  }


  getDayDiv(date) {
    let dayDiv = document.createElement("div");
    dayDiv.className = "mcCalendarDay";

    let today = moment();
    let startOfMonth = date.clone().startOf("month");

    let day = date.isSame(startOfMonth, "day") ? date.format("DD. MMM") : date.format("D");
    let cssClass = date.isBefore(today, "day") ? " dimmed" : " bright";

    dayDiv.className += cssClass;

    if (date.isSame(today, "day")) {
      let daySpan = document.createElement("span");
      daySpan.className = " mcToday";
      daySpan.innerHTML = day;
      dayDiv.appendChild(daySpan);

    } else {
      dayDiv.innerHTML = day;
    }

    return dayDiv;
  }


  getEventsForDay(date) {
    let result = document.createElement("div");

    let eventDiv = document.createElement("div");
    eventDiv.className = "mcEvent";
    eventDiv.innerHTML = this.getEventInfo(date, "name");

    let locationDiv = document.createElement("div");
    locationDiv.className = "mcLocation dimmed";
    locationDiv.innerHTML = this.getEventInfo(date, "location");

    result.appendChild(eventDiv);
    result.appendChild(locationDiv);

    return result;
  }


  getEventInfo(date, key) {
    let dateKey = date.format("DD.MM.YYYY");

    if (this.events[dateKey]) {
      return this.events[dateKey][key];
    } else {
      return "&nbsp;";
    }
  }


  // TODO: remove
  generateFakeData() {
    return {
      "05.03.2018": {
        name: "??ProBAUG",
        location: "Wiesbaden"
      },
      "06.03.2018": {
        name: "??ProBAUG",
        location: "Wiesbaden"
      },
      "07.03.2018": {
        name: "??ProBAUG",
        location: "Wiesbaden"
      },

      "19.03.2018": {
        name: "??agile Softwareentwicklung",
        location: "Wuppertal"
      },
      "20.03.2018": {
        name: "??agile Softwareentwicklung",
        location: "Wuppertal"
      }
    };
  }
}