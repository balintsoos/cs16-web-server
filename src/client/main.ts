import { createEngine } from './engine';
import { getGameFiles } from './gamefiles';

let usernamePromiseResolve: (name: string) => void;
const usernamePromise = new Promise<string>((resolve) => {
  usernamePromiseResolve = resolve;
});

async function main() {
  const engine = createEngine();
  const [gamefiles] = await Promise.all([getGameFiles(), engine.init()]);

  await Promise.all(
    Object.entries(gamefiles.files).map(async ([filename, file]) => {
      if (file.dir) return;

      const path = '/rodir/' + filename;
      const dir = path.split('/').slice(0, -1).join('/');

      engine.em.FS.mkdirTree(dir);
      engine.em.FS.writeFile(path, await file.async('uint8array'));
    })
  );

  engine.em.FS.chdir('/rodir');

  document.getElementById('logo')!.style.animationName = 'pulsate-end';
  document.getElementById('logo')!.style.animationFillMode = 'forwards';
  document.getElementById('logo')!.style.animationIterationCount = '1';
  document.getElementById('logo')!.style.animationDirection = 'normal';

  const username = await usernamePromise;
  engine.main();
  engine.Cmd_ExecuteString('_vgui_menus 0');
  if (!window.matchMedia('(hover: hover)').matches) {
    engine.Cmd_ExecuteString('touch_enable 1');
  }
  engine.Cmd_ExecuteString(`name "${username}"`);
  engine.Cmd_ExecuteString('connect 127.0.0.1:8080');

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
    return '';
  });
}

const username = localStorage.getItem('username');
if (username) {
  (document.getElementById('username') as HTMLInputElement).value = username;
}

(document.getElementById('form') as HTMLFormElement).addEventListener(
  'submit',
  (e) => {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    localStorage.setItem('username', username);
    (document.getElementById('form') as HTMLFormElement).style.display = 'none';
    usernamePromiseResolve(username);
  }
);

main();
