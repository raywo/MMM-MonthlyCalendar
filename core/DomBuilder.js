"use strict";

class DomBuilder {
  constructor(config, translate) {
    this.config = config;
    this.translate = translate;

    this.month = 3;

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

    for (let i = 0; i < 5; i++) {
      let row = this.getCalendarRow(i);
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


  getCalendarRow(weekInMonth) {
    let startOfMonth = moment().month(this.month - 1).startOf("month");
    let endOfMonth = moment().month(this.month - 1).endOf("month");
    let monthStartsAtDay = startOfMonth.weekday();
    let lastDayOfMonth = endOfMonth.date();

    let row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
      let cell = document.createElement("td");
      let dayDiv = document.createElement("div");
      dayDiv.className = "mcCalendarDay bright";

      let currentDay = i + weekInMonth * 7;
      let normalizedDay = currentDay - monthStartsAtDay + 1;

      if (currentDay >= monthStartsAtDay && normalizedDay <= lastDayOfMonth) {
        dayDiv.innerHTML = normalizedDay;
        cell.appendChild(dayDiv);

        let date = startOfMonth.clone().add(normalizedDay - 1, "days");
        cell.appendChild(this.getEventsForDay(date));
      }

      row.appendChild(cell);
    }

    return row;
  }


  getEventsForDay(date) {
    let result = document.createElement("div");

    let eventDiv = document.createElement("div");
    eventDiv.className = "mcEvent";
    eventDiv.innerHTML = this.getEventName(date);

    let locationDiv = document.createElement("div");
    locationDiv.className = "mcLocation dimmed";
    locationDiv.innerHTML = this.getEventLocation(date);

    result.appendChild(eventDiv);
    result.appendChild(locationDiv);

    return result;
  }


  getEventName(date) {
    let dateKey = date.format("DD.MM.YYYY");

    if (this.events[dateKey]) {
      return this.events[dateKey].name;
    } else {
      return "&nbsp;";
    }
  }


  getEventLocation(date) {
    let dateKey = date.format("DD.MM.YYYY");

    if (this.events[dateKey]) {
      return this.events[dateKey].location;
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