/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

/* eslint-disable @typescript-eslint/indent */

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router } from "react-router";
import { App } from "./App";
import { registerServiceWorker } from "./registerServiceWorker";
import "./index.scss";
import { history, store } from "./wireframes/redux/store.ts";
import Homepage from "./Homepage.tsx";
import Login from "./Login.tsx";

const Root = (
  <DndProvider backend={HTML5Backend}>
    <Provider store={store}>
      <Router history={history}>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route path="/C4/:token?" component={App} />
      </Router>
    </Provider>
  </DndProvider>
);

registerServiceWorker(store);

ReactDOM.render(Root, document.getElementById("root-layout") as HTMLElement);
