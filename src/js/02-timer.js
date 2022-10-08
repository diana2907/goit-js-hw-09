import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtn = document.querySelector('[data-start]');
const daysQuantity = document.querySelector('[data-days]');
const hoursQuantity = document.querySelector('[data-hours]');
const minutesQuantity = document.querySelector('[data-minutes]');
const secondsQuantity = document.querySelector('[data-seconds]');
let timerId = null;
startBtn.disabled = true;
let isActive = false;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const valid = selectedDates[0].getTime() > options.defaultDate.getTime();
    if (!valid) {
      Notify.failure('Please choose a date in the future');
    }
    if (valid) {
      Notify.success('You chose a date in the future');
      startBtn.disabled = false;
    }
  },
};

const dataPickr = new flatpickr('input', options);

function addLeadingZero(value) {
  const formatDate = value.toString().padStart(2, '0');
  return formatDate;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  daysQuantity.textContent = days;
  hoursQuantity.textContent = hours;
  minutesQuantity.textContent = minutes;
  secondsQuantity.textContent = seconds;

  return { days, hours, minutes, seconds };
}

startBtn.addEventListener('click', () => {
  if (isActive) {
    return;
  }
  isActive = true;
  timerId = setInterval(() => {
    const selectedDate = dataPickr.selectedDates[0];
    const difference = selectedDate - new Date();

    convertMs(difference);

    if (difference < 1000) {
      clearInterval(timerId);
      Notify.info('Time is up');
    }
  }, 1000);
});
