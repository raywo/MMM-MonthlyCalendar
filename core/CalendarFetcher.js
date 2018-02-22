"use strict";

const moment = require("moment");
const iCal = require("ical.js");
const fs = require("fs");


module.exports = class CalendarFetcher {

  /**
   *
   * @param config The configuration used for this fetcher. It has the following format:
   *        config = {
   *          calendarFile: ""
   *        }
   */
  constructor(config) {
    this.config = config;
    this.events = {};
  }


  fetchCalData() {
    let calendarFile = "modules/MMM-MonthlyCalendar/calendars/" + this.config.calendarFile;

    fs.readFile(calendarFile, "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      this.processData(data);
    });

    return this.events;
  }


  processData(data) {
    let jcalData = ICAL.parse(data);
    let component = new ICAL.Component(jcalData);
    let vevents = component.getAllSubcomponents("vevent");

    vevents.forEach((vevent) => {
      let event = new ICAL.Event(vevent);
      let iterator = event.iterator();
      let next = iterator.next();

      while (next) {
        this.insertEvent(event, next);
        next = iterator.next();
      }
    });
  }


  insertEvent(event, startDate) {
    if (event.duration.days === 1) {
      let plainEvent = CalendarFetcher.getPlainEvent(event, startDate);
      let dateKey = moment(startDate.toJSDate()).format("DD.MM.YYYY");

      if (this.events[dateKey]) {
        this.events[dateKey].push(plainEvent);
      } else {
        this.events[dateKey] = [ plainEvent ];
      }
    }
  }


  static getPlainEvent(event, startDate) {
    return {
      startDate: startDate.toJSDate(),
      location: event.location,
      summary: event.summary
    };
  }
};