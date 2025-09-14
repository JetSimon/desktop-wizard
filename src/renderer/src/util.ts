function chooseRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getLocalStorageBoolWithDefault(key: string, defaultValue: boolean): boolean {
  const res = localStorage.getItem(key)

  if (res) {
    return res == 'true'
  }

  return defaultValue
}

function setLocalStorageBool(key: string, value: boolean): void {
  localStorage.setItem(key, value ? 'true' : 'false')
}

export { chooseRandom, getLocalStorageBoolWithDefault, setLocalStorageBool }
