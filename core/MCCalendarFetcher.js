"use strict";

const moment = require("moment");
const ICAL = require("ical.js");
const request = require("request-promise-native");


module.exports = class MCCalendarFetcher {

  /**
   *
   * @param config The configuration used for this fetcher. It has the following format:
   *        config = {
   *          calendars: [
   *            {
   *              url: ""
   *            },
   *            {
   *              url: ""
   *            }
   *          ]
   *        }
   */
  constructor(config) {
    this.config = config;
    this.events = {};
  }


  fetchCalData() {
    let calendars = this.config.calendars;

    calendars.forEach((calendar) => {
      calendar.fetched = false;
      console.log(calendar);

      request(calendar.url)
        .then((data) => {
          this.processData(data);
          calendar.fetched = true;
        })
        .catch((err) => {
          calendar.fetched = true;
          calendar.error = err.message;

          console.log(err.message);
        });

    });

    while (!this.allRequestsCompleted(calendars)) { /* wait for all requests to complete */ }

    console.log("all fetched");

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
      let plainEvent = MCCalendarFetcher.getPlainEvent(event, startDate);
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

  allRequestsCompleted(calendars) {
    calendars.forEach((calendar) => {
      if (!calendar.fetched) {
        return false;
      }
    });

    return true;
  }
};