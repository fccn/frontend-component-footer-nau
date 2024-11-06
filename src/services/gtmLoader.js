/**
 * @implements {GoogleTagManagerLoader}
 * @memberof module:GoogleTagManager
 */
class GoogleTagManagerLoader {
  constructor({ config }) {
    this.gtmId = config.GOOGLE_TAG_MANAGER_ID;

    this.gtmArgs = '';
    if (config.GOOGLE_TAG_MANAGER_ENVIRONMENT) {
      if (!config.GOOGLE_TAG_MANAGER_ENVIRONMENT.startsWith('&')) {
        this.gtmArgs += '&';
      }
      this.gtmArgs += config.GOOGLE_TAG_MANAGER_ENVIRONMENT;
    }
  }

  loadScript() {
    if (!this.gtmId) {
      return;
    }

    global.googleTagManager = global.googleTagManager || [];
    const { googleTagManager } = global;

    // If the snippet was invoked do nothing.
    if (googleTagManager.invoked) {
      return;
    }

    // Invoked flag, to make sure the snippet is never invoked twice.
    googleTagManager.invoked = true;

    googleTagManager.load = (key, args, options) => {
      const scriptSrc = document.createElement('script');
      scriptSrc.type = 'text/javascript';
      scriptSrc.async = true;
      scriptSrc.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
       new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
       j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
       'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${args}';f.parentNode.insertBefore(j,f);       
       })(window,document,'script','dataLayer','${key}');
      `;
      document.head.insertBefore(scriptSrc, document.head.getElementsByTagName('script')[0]);

      googleTagManager._loadOptions = options; // eslint-disable-line no-underscore-dangle

      const noScriptSrc = document.createElement('noscript');

      noScriptSrc.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${key} height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.insertBefore(noScriptSrc, document.body.childNodes[0]);
    };

    // Load GoogleTagManager with your key.
    googleTagManager.load(this.gtmId, this.gtmArgs);
  }
}

export default GoogleTagManagerLoader;
