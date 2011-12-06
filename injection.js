console.log("Not Ow.ly: injection.js");

var notOwly_bitly_name, notOwly_bitly_key, notOwly_enabled, notOwly_shortenUrl;

(function(){
  var shortenerSection = $('#urlInputSection ._shortenerSection');
  var current = shortenerSection.find('._currentName');
  var menu = shortenerSection.find('._menu');
  var options = menu.find('._option').click(function(){
    notOwly_enabled = false;
  });
  var bitly = $('<a class="_option" href="#" data-url="http://bit.ly" data-id="0">bit.ly</a>');
  bitly.click(function(){
    notOwly_enabled = true;
    current.text($.trim(bitly.text()));
    menu.css('display', 'none');
  });
  bitly.insertBefore(menu.find('._option').first());

  // Enable by default.
  bitly.click();
})();

notOwly_shortenUrl = function(url, success) {
  var newLogin = $('#notOwly_bitly_name');
  if (newLogin.size()) {
    notOwly_bitly_name = newLogin.val();
    newLogin.remove();
  }

  var newKey = $('#notOwly_bitly_key');
  if (newKey.size()) {
    notOwly_bitly_key = newKey.val();
    newKey.remove();
  }

  if (!notOwly_bitly_key) {
    if (confirm("[Not Ow.ly for HootSuite]\nI don't know your bit.ly account.\nDo you set up now?")) {
      var option = $('#notOwly_option_page');
      window.open(option.val(), '_blank');
    }
    hs.throbberMgrObj.remove("._submitShortenUrl");
    return;
  }

  var params = {
    longUrl: url,
    login: notOwly_bitly_name,
    apiKey: notOwly_bitly_key,
    version: "2.0.1"
  };

  var args = [];
  for (var key in params) {
    args.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
  };

  var options = {
    data: args.join('&'),
    url: 'http://api.bit.ly/shorten',
    dataType: 'jsonp',
    type: 'GET'
  };

  options.success = function(data) {
    data.status = data.errorCode;
    data.error_message = data.errorMessage;
    for (var key in data.results) {
      var item = data.results[key];
      if (item.errorCode) {
        data.status = item.errorCode;
        data.error_message = item.errorMessage;
      }

      if (item.userHash) {
        item.hash = item.userHash;
      }
    }
    success({ output : data, defaultUrlShortener : "http:\/\/bit.ly" });
  };

  options.error = function () {
    hs.statusObj.update(translation._("There was an error while processing your request. Please try again later."), "error", true);
    return false;
  }

  $.ajax(options);
}

owly.shortenUrl_org = owly.shortenUrl;
owly.shortenUrl = function(url, success) {
  if (notOwly_enabled) {
    notOwly_shortenUrl(url, success);
  } else {
    owly.shortenUrl_org(url, success);
  }
};

/*
{
    "output": {
        "results": {
            "http:\/\/hootsuite.com\/dashboard": {
                "hash": "1DzkB",
                "createdDate": [],
                "score": 0,
                "title": null,
                "sourceUrl": "http:\/\/hootsuite.com\/dashboard",
                "createdUser": 1,
                "shortUrl": "http:\/\/ow.ly\/1DzkB"
            }
        },
        "status": 0
    },
    "defaultUrlShortener": "http:\/\/ow.ly"
}

function ajaxCall(a, d) {
    switch (d) {
    case "q1":
    case "qm":
    case "qstream":
        break;
    case "abortOld":
        $.manageAjax.clear("q1", true);
        $.manageAjax.clear("qm", true);
        $.manageAjax.clear("single", true);
        $.manageAjax.clear("streamTab", true);
        $.manageAjax.clear("qstream", true);
        break;
    case "single":
        $.manageAjax.clear("single", true);
        break;
    case "streamTab":
        $.manageAjax.clear("streamTab", true);
        $.manageAjax.clear("qstream", true);
        break;
    default:
        hs.statusObj.update("Warning: Invalid ajax manager", "warning", true);
        return false;
        break
    }
    a.url = ("https:" == document.location.protocol.toLowerCase() ? hs.c.rootUrlSSL : hs.c.rootUrl) + a.url;
    if (!("abort" in a)) {
        a.abort = function () {}
    }
    var b = function () {};
    if ("sessionTimeout" in a) {
        b = a.sessionTimeout;
        delete a.sessionTimeout
    }
    var c = function () {};
    if ("success" in a) {
        c = a.success
    }
    a.success = function (f, e) {
        if (f == undefined) {} else {
            if (f.exception) {
                displayExceptionPopup(f.exception)
            }
            else {
                if (f.sessionTimeout) {
                    b();
                    loadLoginPopup()
                }
                else {
                    if (f.controllerPermissionDenied == 1) {
                        if ("permissionDenied" in a) {
                            a.permissionDenied(f, e)
                        }
                        dashboard.showPermissionDeniedPopup(f)
                    }
                    else {
                        c(f, e)
                    }
                }
            }
        }
    };
    if (!("error" in a)) {
        a.error = function () {
            hs.statusObj.update(translation._("There was an error while processing your request. Please try again later."), "error", true);
            return false;
        }
    }
    requestId = $.manageAjax.add(d, a);
    return false
}

owly.shortenUrl = function (a, c) {
    var b = [];
    if (typeof a === "string") {
        b.push(a)
    } else {
        if ($.isArray(a)) {
            b = a
        }
    }
    if (!b.length || !$.isFunction(c)) {
        return
    }
    ajaxCall({
        url: "/ajax/network/shorten-url",
        type: "POST",
        data: "url=" + encodeURIComponent(b.join(" ")),
        success: c
    }, "q1")
};

function shortenURL(a) {
    hs.acListen = false;
    var b = $.trim($("#newLinkSourceUrl" + a).val());
    if (b.length == 0) {
        hs.statusObj.update(translation._("Please enter a URL to shrink"), "error", true, 3000);
        return false
    }
    b = messageBox.urlParameters.attachDefaultParameterToUrl(b);
    var c = function (f) {
        $("#messageBoxMessage" + a).focus();
        var d = f.output;
        if (d.status > 0) {
            hs.statusObj.update("Error: " + d.error_message, "error", true, 3000)
        }
        else {
            var g = $("#messageBoxMessage" + a),
                e = injectOwlyLinkIntoTweet(g.val(), f.defaultUrlShortener + "/" + f.output.results[b].hash);
            newActionTweet(null, e, null, null, "#messageBoxForm" + a);
            hs.statusObj.update(translation._("URL shortened and added to your message"), "success", true, 2000);
            messageBox.scrapeLink(a)
        }
        $("#newLinkSourceUrl" + a).val("");
        hs.throbberMgrObj.remove("._submitShortenUrl" + a);
        return false;
    };
    hs.throbberMgrObj.add("._submitShortenUrl" + a);
    owly.shortenUrl(b, c)
}

messageBox.urlBox.init = function (g) {
    var j = ["._upload", "._schedule", "._draft"],
        e = $(g),
        k = e.closest("._shrink"),
        m = e.closest("._messageTools"),
        c;
    if (!k.length) {
        return
    }
    var h = function () {
        c = e.width();
        var q = m.outerWidth() - m.find("._submit").outerWidth(true) - k.find("._shortenerSection").outerWidth(true) - k.find("._submitShortenUrlButton").outerWidth(true) - 21;
        k.addClass("focused").find("._shortenerSection").show();
        m.find(j.join(",")).hide();
        setTimeout(function () {
            e.stop(true, true).animate({
                width: q
            }, 200)
        }, 1)
    },
        l = function () {
            e.stop(true, true).width("");
            k.removeClass("focused").find("._shortenerSection").hide().find("._menu").css("display", "none");
            m.find(j.join(",")).css("display", "")
        };
    e.bind("focus", h);
    m.closest("._messageBoxForm").find("textarea.messageBoxMessage").bind("focus", l);
    var d = k.find("._shortenerSection"),
        o = d.find("._currentName"),
        b = d.find("._button"),
        a = d.find("._menu"),
        i = a.find("._option"),
        p = a.find("._params"),
        f = function (q) {
            if (typeof q != "undefined") {
                q.preventDefault()
            }
            if (a.is(":visible")) {
                a.css("display", "none")
            } else {
                a.show()
            }
        },
        n = function (t) {
            t.preventDefault();
            var q = $(this),
                r = q.attr("data-url"),
                u = q.attr("data-id"),
                s = r;
            o.text($.trim(q.text()));
            f();
            if (!r.match(/ow\.ly|ht\.ly/i)) {
                s = u
            }
            updateMemberPreference("defaultUrlShortener", s)
        };
    b.click(f);
    i.click(n);
    p.click(function (q) {
        q.preventDefault();
        messageBox.urlParameters.show();
        f()
    })
};
*/
