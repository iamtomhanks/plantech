"use strict"
import React from 'react';
import {render} from 'react-dom';

import MainApp from './components/MainApp';

import { BrowserRouter, Switch, Route} from 'react-router-dom';

const Routes = (
  <BrowserRouter>
    <MainApp />
  </BrowserRouter>
)

render(
  Routes, document.getElementById('app')
);
