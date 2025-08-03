const loadingStatus = document.getElementById('loading-status')!;
const progressBar = document.getElementById('progress-bar')!;
const overlay = document.getElementById('loading-overlay')!;

export function updateStatus(msg: string): void {
  loadingStatus.innerText = msg;
}

export function updateProgress(percent: number): void {
  progressBar.style.width = percent + '%';
}

export function removeOverlay(): void {
  overlay.style.opacity = '0';
  setTimeout(() => overlay.remove(), 500);
}
