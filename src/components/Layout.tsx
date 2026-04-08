import type { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="app-shell">
    <div className="card">{children}</div>
  </div>
);
