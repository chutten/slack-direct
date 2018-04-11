// slack-redir format at present is a static prefix:
const SLACK_REDIR_PREFIX = "https://slack-redir.net/link?url=";
// Followed by a suffix starting with '&'

let observer = new MutationObserver(mutationList => {
  for (let anchor of document.querySelectorAll(`a[href^="${SLACK_REDIR_PREFIX}"`)) {
    let newAnchor = anchor.cloneNode(true);
    newAnchor.href = unescape(newAnchor.href.substring(SLACK_REDIR_PREFIX.length, newAnchor.href.indexOf("&")));
    anchor.parentNode.replaceChild(newAnchor, anchor);
  }
});
observer.observe(document.body, {childList: true, subtree: true});
