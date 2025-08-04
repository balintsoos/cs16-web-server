import { createEngine } from './engine';
import { getGameFiles } from './gamefiles';
import { removeDesktop, updateProgress, updateStatus } from './desktop';
import { cachePlayerName, getPlayerName } from './player';
import type { Xash3DWebRTC } from './webrtc';

const playButton = document.getElementById('play-button') as HTMLButtonElement;

async function initApp() {
  try {
    const engine = createEngine();
    await initEngine(engine);
    playButton.addEventListener('click', (e) => {
      e.preventDefault();
      start(engine);
    });
    playButton.disabled = false;
  } catch (error) {
    console.error('Failed to load game:', error);
    updateStatus('Failed to load game. Please try again later.');
  }
}

async function initEngine(engine: Xash3DWebRTC): Promise<void> {
  const [gamefiles] = await Promise.all([getGameFiles(), engine.init()]);

  const fileEntries = Object.entries(gamefiles.files);
  const totalFiles = fileEntries.length;
  let filesLoaded = 0;

  await Promise.all(
    fileEntries.map(async ([filename, file]) => {
      if (file.dir) return;

      const path = '/rodir/' + filename;
      const dir = path.split('/').slice(0, -1).join('/');

      engine.em.FS.mkdirTree(dir);
      engine.em.FS.writeFile(path, await file.async('uint8array'));

      filesLoaded += 1;
      updateProgress(filesLoaded, totalFiles);
      updateStatus(`Loading game files... (${filesLoaded}/${totalFiles})`);
    })
  );

  engine.em.FS.chdir('/rodir');

  updateStatus('Game loaded successfully!');
}

function start(engine: Xash3DWebRTC): void {
  removeDesktop();
  const playerName = getPlayerName();
  cachePlayerName(playerName);

  engine.main();
  engine.Cmd_ExecuteString('_vgui_menus 0');
  if (!window.matchMedia('(hover: hover)').matches) {
    engine.Cmd_ExecuteString('touch_enable 1');
  }
  engine.Cmd_ExecuteString(`name "${playerName}"`);
  engine.Cmd_ExecuteString('connect 127.0.0.1:8080');

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
    return '';
  });
}

initApp();
