export default class Video {
  constructor(
    type = null,
    url = null,
    initialDuration = "",
    customDuration = "",
    start = "",
    end = ""
  ) {
    this.type = type;
    this.url = url;
    this.initialDuration = initialDuration;
    this.customDuration = customDuration;
    this.start = start;
    this.end = end;
  }

  getValidationRules() {
    return {
      customDuration: [
        (value) => {
          const valueToTime = this.stringToTime(value);
          const initialDurationToTime = this.stringToTime(this.initialDuration);
          if (!/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(value)) {
            return "The value is not valid, example of correct format: XX:XX:XX.XXX";
          } else if (valueToTime > initialDurationToTime) {
            return `The value is not valid, the initial duration is: ${this.initialDuration}`;
          }
          return true;
        },
      ],
      start: [
        (value) => {
          const valueToTime = this.stringToTime(value);
          const initialDurationToTime = this.stringToTime(this.initialDuration);
          const endToTime = this.stringToTime(this.end);
          if (!/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(value)) {
            return "The value is not valid, example of correct format: XX:XX:XX.XXX";
          } else if (
            valueToTime > initialDurationToTime ||
            valueToTime >= endToTime
          ) {
            return "The value is not valid";
          }
          return true;
        },
      ],
      end: [
        (value) => {
          const valueToTime = this.stringToTime(value);
          const initialDurationToTime = this.stringToTime(this.initialDuration);
          const startToTime = this.stringToTime(this.start);
          if (!/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(value)) {
            return "The value is not valid, example of correct format: XX:XX:XX.XXX";
          } else if (
            valueToTime > initialDurationToTime ||
            valueToTime < startToTime
          ) {
            return "The value is not valid";
          }
          return true;
        },
      ],
    };
  }

  setUrl(url) {
    this.url = url;
  }

  setStart(start) {
    this.start = start;
    if (/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(start)) {
      const newCustomDurationTime =
        this.stringToTime(this.end) - this.stringToTime(start);
      if (newCustomDurationTime > 0) {
        this.customDuration = this.timeToString(newCustomDurationTime);
      }
    }
  }

  setEnd(end) {
    this.end = end;
    if (/^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(end)) {
      const newCustomDurationTime =
        this.stringToTime(end) - this.stringToTime(this.start);
      if (newCustomDurationTime > 0) {
        this.customDuration = this.timeToString(newCustomDurationTime);
      }
    }
  }

  setCustomDuration(customDuration) {
    this.customDuration = customDuration;
    if (
      /^[0-9]{2,}:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/.test(customDuration) &&
      this.stringToTime(customDuration) <=
        this.stringToTime(this.initialDuration)
    ) {
      this.start = "00:00:00";
      this.end = customDuration;
    }
  }

  setInitialDuration(duration) {
    const formatedDuration = this.timeToString(duration);
    this.initialDuration = formatedDuration;
    this.customDuration = formatedDuration;
    this.start = "00:00:00";
    this.end = formatedDuration;
  }

  timeToString(time) {
    let hours = Math.floor(time / 3600).toString();
    if (hours.length === 1) {
      hours = `0${hours}`;
    }
    let minutes = Math.floor((time % 3600) / 60).toString();
    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    let seconds = ((time % 3600) % 60).toString();
    if (Math.floor(seconds).toString().length === 1) {
      seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  }

  stringToTime(string) {
    const [hours, minutes, seconds] = string.split(":");
    return (
      parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds)
    );
  }
}
