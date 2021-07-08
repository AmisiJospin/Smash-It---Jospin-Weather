/*
  Author: Jospin AMISI, +265992129078, +265886662568
  Url: facebook.com/amissi.hassan
  site web: www.jospinamisi.heroku.com
  Email:jospinamissi@gmail.com
  Version: 1.0.0 - 11.09.2020
*/

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../serviceWork.js")
    .then((reg) => console.log("service worker registered"))
    .catch((err) => console.log("service worker not registered", err));
}
