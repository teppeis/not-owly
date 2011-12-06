console.log("Not Ow.ly: background.js");

function save(key, value) {
  localStorage[key] = value;
}

function restore(key) {
  var value = localStorage[key];
  if (value === void 0) value = '';
  return value;
}

function init_1_2() {
  save('version', '1.2');
}

function checkInit() {
  var version = restore('version');
  if (version === '') {
    init_1_2();
    if (restore('bitly_key') === '') {
      openOptionPage();
    }
  }
}

function openOptionPage() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')}, function(){})
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getAccount') {
    var bitly_name = localStorage['bitly_name'];
    var bitly_key = localStorage['bitly_key'];
    var account;
    if ( bitly_name && bitly_key ) {
      account = {};
      account.name = bitly_name;
      account.key = bitly_key;
    }
    sendResponse(account);
  }
});

checkInit();
