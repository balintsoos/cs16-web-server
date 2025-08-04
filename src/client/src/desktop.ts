const loadingStatus = document.getElementById('loading-status')!;
const progressBar = document.getElementById(
  'progress-bar'
)! as HTMLProgressElement;
const desktop = document.getElementById('desktop')!;

export function updateStatus(message: string): void {
  loadingStatus.innerText = message;
}

export function updateProgress(value: number, max: number): void {
  progressBar.max = max;
  progressBar.value = value;
}

export function removeDesktop(): void {
  desktop.remove();
}
