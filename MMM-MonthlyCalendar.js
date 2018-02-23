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
    this.initialized = false;
    this.events = {};
    this.error = undefined;

    let fetcherOptions = {
      calendars: this.config.calendars
    };

    Log.info(this.config.calendars);

    this.sendSocketNotification("CREATE_FETCHER", fetcherOptions);
  },

  getDom: function () {
    let domBuilder = new MCDomBuilder(this.config, this.translate);

    if (!this.initialized) {
      return domBuilder.getSimpleDom(this.translate("LOADING"));
    }

    if (this.error) {
      let errorMessage = this.translate("MC_FETCH_ERROR", { givenURL: this.config.url, origError: this.error });
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
      // en: "translations/en.json",
      de: "translations/de.json"
    };
  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "FETCHER_INITIALIZED":
        this.initialized = true;
        this.startFetchingLoop(this.config.updatesEvery);

        break;

      case "CALENDAR_EVENTS_FETCHED":
        // reset error object
        this.error = undefined;
        this.events = payload;
        this.updateDom(2000);

        break;

      case "FETCH_ERROR":
        this.error = payload;
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
