const PLAYER_NAME_KEY = 'player-name';

const playerNameInput = document.getElementById(
  'player-name-input'
) as HTMLInputElement;

const playerName = localStorage.getItem(PLAYER_NAME_KEY);
if (playerName) {
  playerNameInput.value = playerName;
}

export function getPlayerName(): string {
  return playerNameInput.value.trim();
}

export function cachePlayerName(playerName: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, playerName);
}
