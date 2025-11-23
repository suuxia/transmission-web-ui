import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import App from './App.tsx';
import About from '@/views/About/About.tsx';
import Torrents from '@/views/Torrents/Torrents.tsx';
import Settings from '@/views/Settings/Settings.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Torrents,
      },
      {
        path: 'settings',
        Component: Settings,
      },
      {
        path: 'about',
        Component: About,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
