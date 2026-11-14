import { useEffect, useState } from 'react';
import { Icon } from './Icons';

export function PwaControls({ t }) {
  const [prompt, setPrompt] = useState(null);
  const [offline, setOffline] = useState(false);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
  );

  useEffect(() => {
    function capturePrompt(event) {
      event.preventDefault();
      setPrompt(event);
    }
    function markInstalled() {
      setInstalled(true);
      setPrompt(null);
      setHelp(false);
    }
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', markInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    const worker = navigator.serviceWorker;
    const refresh = () => setOffline(Boolean(worker.controller));
    worker.addEventListener('controllerchange', refresh);
    refresh();
    worker.register(new URL('sw.js', document.baseURI))
      .then(() => worker.ready)
      .then(refresh)
      .catch(error => console.warn('Service worker:', error));
    return () => worker.removeEventListener('controllerchange', refresh);
  }, []);

  async function install() {
    if (!prompt) {
      setHelp(value => !value);
      return;
    }
    setPrompt(null);
    try {
      await prompt.prompt();
    } catch {
      setHelp(true);
    }
  }

  return <>
    <div className="pwa-controls">
      {!installed && <button type="button" className="utility-button" onClick={install}
        aria-expanded={help} aria-controls="install-help"><Icon name="download" /> {t.install}</button>}
      {offline && <span className="offline-status" role="status"><Icon name="check" /> {t.offline}</span>}
    </div>
    {help && <p className="install-help" id="install-help">{t.installHelp} {t.offlineHelp}</p>}
  </>;
}
