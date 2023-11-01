async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

chrome.runtime.onMessageExternal.addListener((msg) => {
  chrome.storage.sync.clear()

  chrome.windows.getCurrent((tabWindow) => {
    chrome.storage.sync.set({ uri: msg.uri })
    chrome.windows.create({
      tabId: getCurrentTab().id,
      url: 'index.html',
      type: 'popup',
      width: 400,
      height: 600,
      left: tabWindow.width - 400,
      top: 0,
      focused: true,
    })
  })
})
