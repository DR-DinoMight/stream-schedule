document.addEventListener('DOMContentLoaded', (_event) => {
  let times = document.querySelectorAll('time');
  times.forEach((timeElement) => {
    let twitchTime = new Date(timeElement.innerText);
    timeElement.innerText = moment(twitchTime).format('HH:mm');
  });
});
