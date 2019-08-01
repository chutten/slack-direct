// slack-redir format at present is a static prefix:
const SLACK_REDIR_PREFIX = "https://slack-redir.net/link?url=";
// Followed by a suffix starting with '&'

let observer = new MutationObserver(mutationList => {
  disconnect();
  for (let anchor of document.querySelectorAll(`a[href^="${SLACK_REDIR_PREFIX}"`)) {
    // Have to manipulate a cloned node as we can't manipulate the `href` successfully directly, for some reason?
    let newAnchor = anchor.cloneNode(true);
    // Leave the old one around so that Slack's JS doesn't complain
    anchor.style.display = 'none';
    newAnchor.href = unescape(newAnchor.href.substring(SLACK_REDIR_PREFIX.length, newAnchor.href.indexOf("&")));
    anchor.parentNode.insertBefore(newAnchor, anchor);
  }
  reconnect();
});
window.requestIdleCallback(reconnect);

function reconnect() {
  observer.observe(document.body, {childList: true, subtree: true});
}

function disconnect() {
  observer.disconnect();
}
