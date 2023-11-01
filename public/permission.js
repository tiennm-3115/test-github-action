async function requestPermission() {
  await navigator.mediaDevices.getUserMedia({ video: true });
}

requestPermission();
