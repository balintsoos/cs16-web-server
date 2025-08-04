import filesystemURL from 'xash3d-fwgs/filesystem_stdio.wasm?url';
import xashURL from 'xash3d-fwgs/xash.wasm?url';
import menuURL from 'cs16-client/cl_dll/menu_emscripten_wasm32.wasm?url';
import clientURL from 'cs16-client/cl_dll/client_emscripten_wasm32.wasm?url';
import serverURL from 'cs16-client/dlls/cs_emscripten_wasm32.so?url';
import gles3URL from 'xash3d-fwgs/libref_gles3compat.wasm?url';
import { Xash3DWebRTC } from './webrtc';
import { updateStatus } from './desktop';

export function createEngine(): Xash3DWebRTC {
  updateStatus('Initializing game engine...');
  return new Xash3DWebRTC({
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
    module: {
      arguments: ['-windowed', '-game', 'cstrike'],
    },
    libraries: {
      filesystem: filesystemURL,
      xash: xashURL,
      menu: menuURL,
      server: serverURL,
      client: clientURL,
      render: {
        gles3compat: gles3URL,
      },
    },
    filesMap: {
      'dlls/cs_emscripten_wasm32.so': serverURL,
      '/rwdir/filesystem_stdio.so': filesystemURL,
    },
  });
}
