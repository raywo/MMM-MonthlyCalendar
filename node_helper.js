"use strict";

const NodeHelper = require("node_helper");
const CalendarFetcher = require("./core/MCCalendarFetcher");


module.exports = NodeHelper.create({

  start: function () {

  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "CREATE_FETCHER":
        this.createFetcher(payload);
        break;

      case "FETCH_CALENDAR_EVENTS":
        this.fetchCalEvents();
        break;
    }
  },


  createFetcher: function (config) {
    // TODO: Only create new fetcher if there is no fetcher yet. Maybe enable more than one fetcher.
    this.fetcher = new CalendarFetcher(config);

    this.sendSocketNotification("FETCHER_INITIALIZED");
  },


  fetchCalEvents: function () {
    this.fetcher.fetchCalData()
      .then((events) => {
        this.sendSocketNotification("CALENDAR_EVENTS_FETCHED", events);
      })
      .catch((err) => {
        this.sendSocketNotification("FETCH_ERROR", err.message);
      });
  }
});
