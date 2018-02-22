"use strict";

const moment = require("moment");
const ICAL = require("ical.js");
const request = require("request-promise-native");


module.exports = class MCCalendarFetcher {

  /**
   *
   * @param config The configuration used for this fetcher. It has the following format:
   *        config = {
   *          url: ""
   *        }
   */
  constructor(config) {
    this.config = config;
    this.events = {};
  }


  fetchCalData() {
    let url = this.config.url;

    return request(url)
      .then((data) => {
        this.processData(data);
        return this.events;
      })
      .catch((err) => {
        throw err;
      });
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
};