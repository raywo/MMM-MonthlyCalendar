"use strict";

const moment = require("moment");
const ICAL = require("ical.js");
const request = require("request-promise-native");


module.exports = class MCCalendarFetcher {

  /**
   *
   * @param url The url this fetcher is responsible for.
   */
  constructor(url) {
    this.url = url;
    this.events = {};
  }


  fetchCalData(fetchID, calendarPriority) {
    this.events = {};

    return request(this.url)
      .then((data) => {
        this.processData(data, calendarPriority);

        return {
          fetchID: fetchID,
          events: this.events
        };
      })
      .catch((err) => {
        throw err;
      });
  }


  processData(data, calendarPriority) {
    let jcalData = ICAL.parse(data);
    let component = new ICAL.Component(jcalData);
    let vevents = component.getAllSubcomponents("vevent");

    vevents.forEach((vevent) => {
      let event = new ICAL.Event(vevent);
      let iterator = event.iterator();
      let next = iterator.next();

      while (next) {
        this.insertEvent(event, next, calendarPriority);
        next = iterator.next();
      }
    });
  }


  insertEvent(event, startDate, calendarPriority) {
    if (event.duration.days === 1) {
      let plainEvent = MCCalendarFetcher.getPlainEvent(event, startDate, calendarPriority);
      let dateKey = moment(startDate.toJSDate()).format("DD.MM.YYYY");

      if (this.events[dateKey]) {
        this.events[dateKey].push(plainEvent);
      } else {
        this.events[dateKey] = [plainEvent];
      }
    }
  }


  static getPlainEvent(event, startDate, calendarPriority) {
    return {
      calendarPriority: calendarPriority,
      startDate: startDate.toJSDate(),
      location: event.location,
      summary: event.summary
    };
  }
};