console.log('running script')

// content.js
function injectCode(src) {
  const script = document.createElement('script')
  script.src = src
  script.onload = function () {
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(script)
}

injectCode(chrome.runtime.getURL('/injected.js'))
