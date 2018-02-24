"use strict";

const NodeHelper = require("node_helper");
const CalendarFetcher = require("./core/MCCalendarFetcher");


module.exports = NodeHelper.create({

  start: function () {
    this.fetchers = {};
  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "FETCH_CALENDAR_EVENTS":
        this.fetchCalEvents(payload.calendars, payload.fetchID);
        break;
    }
  },


  fetchCalEvents: function (calendars, fetchID) {
    calendars.forEach((calendar) => {
      let fetcher = this.getFetcher(calendar.url);

      fetcher.fetchCalData(fetchID, calendar.priority)
        .then((response) => {
          response.calendar = calendar;
          this.sendSocketNotification("CALENDAR_EVENTS_FETCHED", response);
        })
        .catch((err) => {
          let payload = {
            fetchID: fetchID,
            calendar: calendar,
            error: err
          };

          this.sendSocketNotification("FETCH_ERROR", payload);
        });
    });
  },


  getFetcher(url) {
    if (!this.fetchers[url]) {
      this.fetchers[url] = new CalendarFetcher(url);
      console.log("[" + this.name + "] created new calendar fetcher for url: " + url);
    }

    return this.fetchers[url];
  }
});
