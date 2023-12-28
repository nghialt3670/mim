


function adjustTime(utcTimeString) {
  const utcTime = new Date(utcTimeString);
  const currentTime = new Date();
  const timeDifference = currentTime - utcTime;

  // Convert milliseconds to seconds
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : seconds + " seconds ago";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return days === 1 ? "1 day ago" : days + " days ago";
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return months === 1 ? "1 month ago" : months + " months ago";
  } else {
    const years = Math.floor(seconds / 31536000);
    return years === 1 ? "1 year ago" : years + " years ago";
  }
}

module.exports = { adjustTime }