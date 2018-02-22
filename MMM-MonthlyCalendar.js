"use strict";

Module.register("MMM-MonthlyCalendar", {

  // default values
  defaults: {
    // Module misc
    name: "MMM-MonthlyCalendar",
    hidden: false,
    updatesEvery: 120,         // How often should the table be updated in s?

    // user definable
    weeksInFuture: 10,
    calendarFile: "M2CD-1-1-5D32543F-6853-432D-91B7-90FFF51E16C0.ics"
  },


  start: function () {
    this.initialized = false;
    this.events = {};
    this.error = {};

    let fetcherOptions = {
      calendarFile: this.config.calendarFile
    };

    this.sendSocketNotification("CREATE_FETCHER", fetcherOptions);
  },

  getDom: function () {
    let domBuilder = new DomBuilder(this.config, this.translate);

    return domBuilder.getDom(this.events);
  },

  getScripts: function () {
    return [
      this.file("core/DomBuilder.js"),
      "moment.js"
    ];
  },

  getStyles: function () {
    return [
      this.file("css/styles.css")
    ];
  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "FETCHER_INITIALIZED":
        this.initialized = true;
        this.startFetchingLoop(this.config.updatesEvery);

        break;

      case "CALENDAR_EVENTS_FETCHED":
        // reset error object
        this.error = {};
        this.events = payload;
        this.updateDom(2000);

        break;

      case "FETCH_ERROR":
        this.error = payload.error;
        this.events = {};
        this.updateDom(2000);

        break;
    }
  },


  startFetchingLoop: function(interval) {
    // start immediately ...
    this.sendSocketNotification("FETCH_CALENDAR_EVENTS");

    // ... and then repeat in the given interval
    setInterval(() => {
      this.sendSocketNotification("FETCH_CALENDAR_EVENTS");
    }, interval * 1000);
  }
});
