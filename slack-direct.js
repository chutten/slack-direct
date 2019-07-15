// slack-redir format at present is a static prefix:
const SLACK_REDIR_PREFIX = "https://slack-redir.net/link?url=";
// Followed by a suffix starting with '&'

// Been seeing some slowdowns and weirdness. Let's yield every so often
// to keep from hogging the main thread.
const MAX_STEP_MS = 100;
// The handle for the idle callback, used so we don't over-process.
let gIdleHandle = undefined;

let observer = new MutationObserver(mutationList => {
  if (gIdleHandle) {
    window.cancelIdleCallback(gIdleHandle);
    gIdleHandle = undefined;
  }
  let stepBegin = Date.now();
  for (let anchor of document.querySelectorAll(`a[href^="${SLACK_REDIR_PREFIX}"`)) {
    let newAnchor = anchor.cloneNode(true);
    newAnchor.href = unescape(newAnchor.href.substring(SLACK_REDIR_PREFIX.length, newAnchor.href.indexOf("&")));
    anchor.parentNode.replaceChild(newAnchor, anchor);
    if (Date.now() - stepBegin > MAX_STEP_MS) {
      // We're not done, but we've hit our time budget.
      // Reschedule until an idle period (or until we observe another mutation)
      gIdleHandle = window.requestIdleCallback(() => {
        observer.observe(document.body, {childList: true, subtree: true});
      });
      return;
    }
  }
});
observer.observe(document.body, {childList: true, subtree: true});
