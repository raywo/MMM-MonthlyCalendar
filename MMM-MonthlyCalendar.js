"use strict";

Module.register("MMM-MonthlyCalendar", {

  // default values
  defaults: {
    // Module misc
    name: "MMM-MonthlyCalendar",
    hidden: false,
    updatesEvery: 120,         // How often should the table be updated in s?

    // user definable
    weeksInFuture: 4
  },


  start: function () {
    Log.info("Starting module: " + this.name );

    this.initialized = false;
    this.events = {};
    this.fetchTracker = {};   // Keeps track of the last used fetchID for each calendar.
    this.errors = {};
    this.currentFetchID = undefined;

    this.config.calendars.forEach((calendar) => {
      this.fetchTracker[calendar.url] = this.currentFetchID;
    });

    this.startFetchingLoop(this.config.updatesEvery);
  },


  getDom: function () {
    let domBuilder = new MCDomBuilder(this.config);

    if (!this.initialized) {
      return domBuilder.getSimpleDom(this.translate("LOADING"));
    }

    let errorKeys = Object.keys(this.errors);

    if (errorKeys.length > 0) {
      let givenURLs = errorKeys.join("<br>");
      let messages = errorKeys.map((key) => this.errors[key].message).join("<br>");
      let errorMessage = this.translate("MC_FETCH_ERROR", { givenURL: givenURLs, origError: messages });

      return domBuilder.getSimpleDom(errorMessage);
    }

    return domBuilder.getDom(this.events);
  },


  getScripts: function () {
    return [
      this.file("core/MCDomBuilder.js"),
      "moment.js"
    ];
  },


  getStyles: function () {
    return [
      this.file("css/styles.css")
    ];
  },


  getTranslations: function () {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "CALENDAR_EVENTS_FETCHED":
        this.initialized = true;
        // reset errors object
        this.errors = {};

        if (payload.fetchID === this.currentFetchID) {
          this.mergeEvents(payload.events);
          this.fetchTracker[payload.calendar.url] = payload.fetchID;
          this.scheduleDomUpdate(1000);
        }

        break;

      case "FETCH_ERROR":
        Log.error("(" + payload.fetchID + ") An error occured during fetching for calendar: ");
        Log.error(payload.calendar);
        Log.error("\nError message: " + payload.error.message);

        this.initialized = true;
        this.errors[payload.calendar.url] = payload.error;
        this.fetchTracker[payload.calendar.url] = payload.fetchID;
        this.scheduleDomUpdate(1000);

        break;
    }
  },


  startFetchingLoop: function(interval) {
    // start immediately ...
    this.sendStartFetching();

    // ... and then repeat in the given interval
    setInterval(() => {
      this.sendStartFetching();
    }, interval * 1000);
  },


  sendStartFetching: function () {
    this.currentFetchID = this.generateFetchID();
    this.events = {};

    let payload = {
      calendars: this.config.calendars,
      fetchID: this.currentFetchID
    };

    this.sendSocketNotification("FETCH_CALENDAR_EVENTS", payload);
  },


  generateFetchID: function() {
    let dt = new Date().getTime();

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },


  mergeEvents: function(newEvents) {
    Object.keys(newEvents).forEach((key) => {
      if (this.events[key]) {
        this.events[key] = this.events[key].concat(newEvents[key]);
        this.events[key].sort(this.sortByPriority);
      } else {
        this.events[key] = newEvents[key];
      }
    });
  },


  scheduleDomUpdate: function(interval) {
    if (this.allFetchesDone()) {
      this.updateDom(interval);
    }
  },


  allFetchesDone: function () {
    let keys = Object.keys(this.fetchTracker);

    for (let i = 0; i < keys.length; i++) {
      if (this.fetchTracker[keys[i]] !== this.currentFetchID) {
        return false;
      }
    }

    return true;
  },


  sortByPriority: function(leftElem, rightElem) {
    return leftElem.priority - rightElem.priority;
  }
});
