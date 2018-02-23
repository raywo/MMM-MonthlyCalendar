"use strict";

const NodeHelper = require("node_helper");
const CalendarFetcher = require("./core/MCCalendarFetcher");


module.exports = NodeHelper.create({

  start: function () {
    this.fetchers = undefined;
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
    this.fetcher = new CalendarFetcher(config);
    this.sendSocketNotification("FETCHER_INITIALIZED");

    console.log("[" + this.name + "] created new calendar fetcher");
  },


  fetchCalEvents: function () {
  //   this.fetcher.fetchCalData()
  //     .then((events) => {
  //       this.sendSocketNotification("CALENDAR_EVENTS_FETCHED", events);
  //     })
  //     .catch((err) => {
  //       this.sendSocketNotification("FETCH_ERROR", err.message);
  //     });
    let events = this.fetcher.fetchCalData();
    this.sendSocketNotification("CALENDAR_EVENTS_FETCHED", events);
  }
});
