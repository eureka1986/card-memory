import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/index.css';
import { router } from './routes/router';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('根节点不存在');
}
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
