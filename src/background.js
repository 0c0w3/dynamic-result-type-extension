/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Our dynamic type is registered under this name.
const DYNAMIC_TYPE_NAME = "test";

// Our provider.
class ProviderDynamicExtensionTest extends UrlbarProvider {
  constructor() {
    super();

    // Register our dynamic result type.
    UrlbarResult.addDynamicResultType(DYNAMIC_TYPE_NAME);
    UrlbarView.addDynamicViewTemplate(DYNAMIC_TYPE_NAME, {
      stylesheet: "data/style.css",
      attributes: {
        role: "group",
      },
      children: [
        {
          name: "icon",
          tag: "img",
        },
        {
          name: "title",
          tag: "span",
        },
        {
          name: "buttonSpacer",
          tag: "span",
        },
        {
          name: "button",
          tag: "span",
          attributes: {
            role: "button",
          },
        },
        {
          name: "help",
          tag: "span",
          attributes: {
            role: "button",
          },
        },
      ],
    });
  }

  get name() {
    return "ProviderDynamicExtensionTest";
  }

  getPriority(queryContext) {
    return 0;
  }

  isActive(queryContext) {
    return true;
  }

  // Updates the result's view.
  getViewUpdate(result) {
    return {
      icon: {
        attributes: {
          src: result.payload.icon || "chrome://browser/skin/tip.svg",
        },
      },
      title: {
        textContent: "This is a dynamic result that looks like a tip.",
      },
      button: {
        textContent: "Click Me",
      },
      help: {
        style: {
          display: result.payload.helpUrl ? "" : "none",
        },
      },
    };
  }

  async startQuery(queryContext, addCallback) {
    let result = new UrlbarResult(
      UrlbarUtils.RESULT_TYPE.DYNAMIC,
      UrlbarUtils.RESULT_SOURCE.OTHER_LOCAL,
      {
        dynamicType: DYNAMIC_TYPE_NAME,
        helpUrl: "http://example.com/",
      }
    );
    result.suggestedIndex = 1;
    addCallback(this, result);
  }

  cancelQuery(queryContext) {
  }

  pickResult(result) {
    console.log("Result picked!", result);
  }
}

// main
let testProvider;
(async function main() {
  testProvider = new ProviderDynamicExtensionTest();
  // To remove the provider, call testProvider.uninit().
})();
