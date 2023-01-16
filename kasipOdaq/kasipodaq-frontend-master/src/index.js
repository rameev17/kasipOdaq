import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import * as serviceWorker from './serviceWorker';

Sentry.init({
  dsn: "https://3586886ae48b496fb513ba6f02d16609@o454082.ingest.sentry.io/5443512",
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
