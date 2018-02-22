"use strict";

const NodeHelper = require("node_helper");
const CalendarFetcher = require("./core/CalendarFetcher");


module.exports = NodeHelper.create({

  start: function () {

  },


  socketNotificationReceived: function (notification, payload) {
    // console.log("node_helper received notification: " + notification);

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
    let events = this.fetcher.fetchCalData();

    // console.log("fetched events:");
    // console.log(events);
    this.sendSocketNotification("CALENDAR_EVENTS_FETCHED", events);
  }
});
