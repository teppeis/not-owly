console.log("Not Ow.ly: content.js");

var optionPageUrl = chrome.extension.getURL('options.html');
appendData('option_page', optionPageUrl);

updateAccount();
loadScript(chrome.extension.getURL('injection.js'));
setInterval(updateAccount, 3000);

function updateAccount() {
  chrome.extension.sendRequest({type:'getAccount'}, function(res){
    if (res) {
      appendData('bitly_name', res.name);
      appendData('bitly_key', res.key);
    }
  });
}

function loadScript(src) {
  var e = document.createElement("script");
  e.type = 'text/javascript';
  e.charset = 'UTF-8';
  e.src = src;
  document.body.appendChild(e);
}

function appendData(key, value) {
  var id = 'notOwly_' + key;
  var e = document.getElementById(id);
  if (e) {
    e.value = value;
  } else {
    var e = document.createElement("input");
    e.type = 'hidden';
    e.id = id;
    e.name = key;
    e.value = value;
    document.body.appendChild(e);
  }
}

