import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {Provider,Com} from '../src/index';
import initState from './test/store';
ReactDOM.render(<Provider init={initState}>
                    <Com module="stage"/>
                    <Com module="edit"/>
            </Provider>, document.getElementById('container'));

