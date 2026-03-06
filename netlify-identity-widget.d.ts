declare module 'netlify-identity-widget' {
  const widget: {
    init: () => void;
    open: (tab?: 'login' | 'signup') => void;
    close: () => void;
    on: (event: string, cb: (...args: any[]) => void) => void;
    off: (event: string, cb: (...args: any[]) => void) => void;
  };
  export default widget;
}
