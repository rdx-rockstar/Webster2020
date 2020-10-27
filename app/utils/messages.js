const moment = require('moment');

function formatMessage(username, text,uid,pic) {
  return {
    username,
    text,
    uid,
    pic,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
