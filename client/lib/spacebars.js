UI.registerHelper('simpleFormat', (text) => {
  if (!text) {
    return;
  }
  var carriage_returns, linkify, newline, paragraphs;
  linkify = (string) => {
    var re;
    re = [
      "\\b((?:https?|ftp)://[^\\s\"'<>]+)\\b",
      "\\b(www\\.[^\\s\"'<>]+)\\b",
      "\\b(\\w[\\w.+-]*@[\\w.-]+\\.[a-z]{2,6})\\b",
      "@([a-z0-9]+)"
    ];
    re = new RegExp(re.join('|'), 'gi');
    return string.replace(re, (match, url, www, mail, username) => {
      if (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
      }
      if (www) {
        return '<a href="http://' + www + '" target="_blank">' + www + '</a>';
      }
      if (mail) {
        return '<a href="mailto:' + mail + '">' + mail + '</a>';
      }
      if (username) {
        if (Meteor.user().username === username) {
          return '<span class="highlight-username">@' + username + '</span>';
        }
        return '@' + username;
      }
      return match;
    });
  };
  text = linkify(text);
  carriage_returns = /\r\n?/g;
  paragraphs = /\n\n+/g;
  newline = /([^\n]\n)(?=[^\n])/g;
  text = text.replace(carriage_returns, '\n');
  text = text.replace(paragraphs, '</p>\n\n<p>');
  text = text.replace(newline, '$1<br/>');
  text = '<p>' + text + '</p>';
  return new Spacebars.SafeString(text);
});

UI.registerHelper('formatDate', (date) => {
  return moment(date).format('LL');
});

/*
 * Full time format
 */
UI.registerHelper('fullTimeDate', (date) => {
  return moment(date).format('HH:mm:ss, LL');
});

Template.registerHelper('instance', () => Template.instance());
