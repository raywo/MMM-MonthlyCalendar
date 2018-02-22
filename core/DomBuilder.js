"use strict";

class DomBuilder {
  constructor(config, translate) {
    this.config = config;
    this.translate = translate;

    this.events = {};
  }


  getDom(events) {
    this.events = events;

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
    eventDiv.innerHTML = this.getEventInfo(date, "summary");

    let locationDiv = document.createElement("div");
    locationDiv.className = "mcLocation dimmed";
    locationDiv.innerHTML = this.getEventInfo(date, "location");

    result.appendChild(eventDiv);
    result.appendChild(locationDiv);

    return result;
  }


  /**
   * Gets events contents for an event on `date`.
   * If there are more than one events for this day the first is chosen and returned.
   *
   * @param date The date on which to look for an event.
   * @param key The info to return. Possible values are `summary`, `location` and `startDate`
   * @returns {*} The requested info or `"&nbsp;"` if no events exists on the given date.
   */
  getEventInfo(date, key) {
    let dateKey = date.format("DD.MM.YYYY");

    if (this.events[dateKey]) {
      let event = this.events[dateKey][0];
      return event[key];
    } else {
      return "&nbsp;";
    }
  }
}