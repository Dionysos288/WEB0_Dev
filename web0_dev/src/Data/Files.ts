const someJSCodeExample = `
 import React from "react";
export default function App() {
  return <h1 className="text-red-500">Hello Tailwind!</h1>;
}
`;

const someCSSCodeExample = `
  body { margin: 0; padding: 0; }
`;

const someHTMLCodeExample = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      <!-- https://web.dev/uses-rel-preconnect -->
      <link rel="preconnect" href="https://storage.googleapis.com">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#111" />

      <meta
        name="description"
        content="Wlist"
        data-react-helmet="true"
      />
      <meta
        property="og:title"
        content="Wlist"
        data-react-helmet="true"
      >
      <meta
        property="og:description"
        content="Wlist"
        data-react-helmet="true"
      >
      <meta
        property="og:url"
        content="%PUBLIC_URL%"
        data-react-helmet="true"
      >
      <meta
        property="og:image"
        content="%PUBLIC_URL%/images/cover.png"
        data-react-helmet="true"
      />
      <meta
        name="twitter:card"
        content="summary"
        data-react-helmet="true"
      />
      <meta property="og:type" content="website" />
      <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
      <!--
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
      -->
      <link rel="manifest" href="%PUBLIC_URL%/manifest.json" crossorigin="use-credentials" />
      <!-- https://web.dev/defer-non-critical-css/ -->
      <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">

      <title>Wlist</title>

      <!-- ie -->
      <script type="text/javascript">
        var ua = navigator.userAgent;
        var is_ie = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

        if (is_ie) {
          document.ie = 'true';

          var ie_script = document.createElement('script');
          var ie_styles = document.createElement('link');

          ie_script.src = 'no-ie/init.js';
          ie_styles.rel = 'stylesheet';
          ie_styles.href = 'no-ie/styles.css';

          function injectScripts() {
            document.body.innerHTML = '';
            document.body.appendChild(ie_styles);
            document.body.appendChild(ie_script);
          }

          if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', injectScripts);
          } else { // before IE 9
            document.attachEvent('DOMContentLoaded', injectScripts);
          }

        }
      </script>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <script type="text/javascript">
        // set the body color before app initialization, to avoid blinking
        var themeMode = localStorage.getItem('theme-mode');
        var initialBodyStyles = document.createElement('style');
        var currentThemeColor = themeMode === 'light' ? '#fafafa': '#111';
        initialBodyStyles.innerText = 'body { background-color: ' + currentThemeColor + ' }';
        document.head.appendChild(initialBodyStyles);

        // also set meta[name="theme-color"] content
        var metaTheme = document.querySelector('meta[name="theme-color"]');

        metaTheme.content = currentThemeColor;
      </script>
      <div id="root"></div>
    </body>
  </html>
`;

const files = {
	'App.jsx': {
		name: 'App.jsx',
		language: 'javascript',
		value: someJSCodeExample,
		tailwind: true,
	},
	'styles.css': {
		name: 'styles.css',
		language: 'css',
		value: someCSSCodeExample,
	},
	'index.html': {
		name: 'index.html',
		language: 'html',
		value: someHTMLCodeExample,
	},
};

export default files;
