/*global chrome*/
var port = chrome.runtime.connectNative('foo.bar');

port.onMessage.addListener((msg) => {
  port.postMessage(msg.toUpperCase());
});
