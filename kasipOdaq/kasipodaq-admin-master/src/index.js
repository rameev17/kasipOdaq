import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from './App';

Sentry.init({
  dsn: "https://411dc610cf9c4fedb2edf1b7e7d8f631@o454082.ingest.sentry.io/5443528",
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById('root'));
