document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const currentTimeDisplay = document.getElementById("current-time");
  const progressBar = document.getElementById("progress");
  const cursor = document.getElementById("progress-cursor");
  const radioForm = document.getElementById("radioForm");
  const selectedValue = document.getElementById("selectedValue");
  const resetButton = document.getElementById("resetButton");

  pauseButton.disabled = true;
  playButton.disabled = true;
  let isSecondAudioPlaying = false;
  let interval;
  let currentTime = 290;
  let isPlaying = false;
  let totalDuration = 1800; // Ses dosyasının toplam süresi (saniye)

  const forwardButton = document.getElementById("forward");
  const rewindButton = document.getElementById("rewind");
  resetButton.addEventListener("click", function () {
    // İleri geri sarma işlemlerini durdurun
    clearInterval(interval);
    isPlaying = false; // Sayaç durduruldu

    // Sayaçı ve progress bar'ı sıfırlayın
    currentTime = 290;
    progressBar.value = (currentTime / totalDuration) * 100; // progressBar'ı currentTime'a göre güncelle
    currentTimeDisplay.textContent = formatTime(currentTime);

    // İkinci sesi çalmak için kullanılan bayrakı sıfırlayın
    isSecondAudioPlaying = false;

    // Play ve pause düğmelerini etkinleştirin/devre dışı bırakın
    playButton.disabled = false;
    pauseButton.disabled = true;
  });

  // İleri düğmesine tıklama olayını ekleyin
  forwardButton.addEventListener("click", function () {
    if (selectedRadio && isPlaying) {
      currentTime += 1; // 1 saniye ileri al
      startTime = Date.now() - currentTime * 1000; // startTime'ı güncelle
      updateTime(selectedRadio);
    }
  });

  // Geri düğmesine tıklama olayını ekleyin
  rewindButton.addEventListener("click", function () {
    if (selectedRadio && isPlaying) {
      currentTime -= 1; // 2 saniye geri al
      if (currentTime < 0) {
        currentTime = 0; // Zaman sıfırın altına düşerse sıfıra ayarlayın
      }
      startTime = Date.now() - currentTime * 1000; // startTime'ı güncelle
      updateTime(selectedRadio);
    }
  });

  let specialTimes = [
    convertToSeconds(5, 0), // 5:00
    convertToSeconds(5, 12), // 5:12
    convertToSeconds(5, 54), // 5:54
    convertToSeconds(6, 0), // 6:00 (TB)
    convertToSeconds(6, 12), // 6:12
    convertToSeconds(6, 54), // 6:54
    convertToSeconds(7, 0), // 7:00 (CW)
    convertToSeconds(7, 12), // 7:12
    convertToSeconds(7, 24) - 2, // 7:24
    convertToSeconds(8, 24) - 2, // 8:24
    convertToSeconds(8, 30) - 2, // 8:30
    convertToSeconds(9, 0) - 2, // 9:00
    convertToSeconds(9, 12) - 2, // 9:12
    convertToSeconds(9, 42) - 2, // 9:42
    convertToSeconds(9, 54) - 2, // 9:54
    convertToSeconds(10, 0) - 2, // 10:00
    convertToSeconds(10, 42) - 2, // 10:42
    convertToSeconds(10, 54) - 2, // 10:54
    convertToSeconds(11, 30) - 2, // 11:30
    convertToSeconds(11, 54) - 2, // 11:54
    convertToSeconds(12, 24) - 2, // 12:24
    convertToSeconds(12, 30) - 2, // 12:30
    convertToSeconds(13, 0) - 2, // 13:00
    convertToSeconds(13, 12) - 2, // 13:12
    convertToSeconds(13, 24) - 2, // 13:24
    convertToSeconds(13, 30) - 2, // 13:30
    convertToSeconds(13, 42) - 2, // 13:42
    convertToSeconds(14, 24) - 2, // 14:24
    convertToSeconds(14, 30) - 2, // 14:30
    convertToSeconds(14, 42) - 2, // 14:42
    convertToSeconds(15, 54) - 2, // 15:54
    convertToSeconds(16, 0) - 2, // 16:00 (DS)
    convertToSeconds(16, 12) - 2, // 16:12
    convertToSeconds(17, 0) - 2, // 17:00
    convertToSeconds(17, 24) - 2, // 17:24
    convertToSeconds(18, 42) - 2, // 18:42
    convertToSeconds(18, 54) - 2, // 18:54
    convertToSeconds(19, 0) - 2, // 19:00
    convertToSeconds(19, 12) - 2, // 19:12
    convertToSeconds(19, 54) - 2, // 19:54
    convertToSeconds(20, 0) - 2, // 20:00
    convertToSeconds(20, 12) - 2, // 20:12
    convertToSeconds(21, 12) - 2, // 21:12 (CENTAUR)
    convertToSeconds(21, 24) - 2, // 21:24
    convertToSeconds(21, 42) - 2, // 21:42
    convertToSeconds(22, 24) - 2, // 22:24
    convertToSeconds(22, 30) - 2, // 22:30
    convertToSeconds(22, 42) - 2, // 22:42
    convertToSeconds(23, 42) - 2, // 23:42
    convertToSeconds(23, 54) - 2, // 23:54
    convertToSeconds(24, 24) - 2, // 24:24
    convertToSeconds(24, 30) - 2, // 24:30
    convertToSeconds(24, 42) - 2, // 24:42
  ];

  let specialTimes01 = [
    convertToSeconds(5, 1), // 5:01
    convertToSeconds(5, 13), // 5:13
    convertToSeconds(5, 55), // 5:55
    convertToSeconds(6, 1), // 6:01 (TB)
    convertToSeconds(6, 13), // 6:13
    convertToSeconds(6, 55), // 6:55
    convertToSeconds(7, 1), // 7:01 (CW)
    convertToSeconds(7, 13), // 7:13
    convertToSeconds(7, 25), // 7:25
    convertToSeconds(8, 25), // 8:25
    convertToSeconds(8, 31), // 8:31
    convertToSeconds(9, 1), // 9:01
    convertToSeconds(9, 13), // 9:13
    convertToSeconds(9, 43), // 9:43
    convertToSeconds(9, 55), // 9:55
    convertToSeconds(10, 1), // 10:01
    convertToSeconds(10, 43), // 10:43
    convertToSeconds(10, 55), // 10:55
    convertToSeconds(11, 31), // 11:31
    convertToSeconds(11, 55), // 11:55
    convertToSeconds(12, 25), // 12:25
    convertToSeconds(12, 31), // 12:31
    convertToSeconds(13, 1), // 13:01
    convertToSeconds(13, 13), // 13:13
    convertToSeconds(13, 25), // 13:25
    convertToSeconds(13, 31), // 13:31
    convertToSeconds(13, 43), // 13:43
    convertToSeconds(14, 25), // 14:25
    convertToSeconds(14, 31), // 14:31
    convertToSeconds(14, 43), // 14:43
    convertToSeconds(15, 55), // 15:55
    convertToSeconds(16, 1), // 16:01 (DS)
    convertToSeconds(16, 13), // 16:13
    convertToSeconds(17, 1), // 17:01
    convertToSeconds(17, 25), // 17:25
    convertToSeconds(18, 43), // 18:43
    convertToSeconds(18, 55), // 18:55
    convertToSeconds(19, 1), // 19:01
    convertToSeconds(19, 13), // 19:13
    convertToSeconds(19, 55), // 19:55
    convertToSeconds(20, 1), // 20:01
    convertToSeconds(20, 13), // 20:13
    convertToSeconds(21, 13), // 21:13 (CENTAUR)
    convertToSeconds(21, 25), // 21:25
    convertToSeconds(21, 43), // 21:43
    convertToSeconds(22, 25), // 22:25
    convertToSeconds(22, 31), // 22:31
    convertToSeconds(22, 43), // 22:43
    convertToSeconds(23, 43), // 23:43
    convertToSeconds(23, 55), // 23:55
    convertToSeconds(24, 25), // 24:25
    convertToSeconds(24, 31), // 24:31
    convertToSeconds(24, 43), // 24:43
  ];

  let specialTimes02 = [
    convertToSeconds(5, 2), // 5:02
    convertToSeconds(5, 14), // 5:14
    convertToSeconds(5, 50), // 5:50
    convertToSeconds(6, 2), // 6:02 (TB)
    convertToSeconds(6, 14), // 6:14
    convertToSeconds(6, 50), // 6:50
    convertToSeconds(7, 2), // 7:02 (CW)
    convertToSeconds(7, 14), // 7:14
    convertToSeconds(7, 20), // 7:20
    convertToSeconds(8, 20), // 8:20
    convertToSeconds(8, 32), // 8:32
    convertToSeconds(9, 2), // 9:02
    convertToSeconds(9, 14), // 9:14
    convertToSeconds(9, 44), // 9:44
    convertToSeconds(9, 50), // 9:50
    convertToSeconds(10, 2), // 10:02
    convertToSeconds(10, 44), // 10:44
    convertToSeconds(10, 50), // 10:50
    convertToSeconds(11, 32), // 11:32
    convertToSeconds(11, 50), // 11:50
    convertToSeconds(12, 20), // 12:20
    convertToSeconds(12, 32), // 12:32
    convertToSeconds(13, 2), // 13:02
    convertToSeconds(13, 14), // 13:14
    convertToSeconds(13, 20), // 13:20
    convertToSeconds(13, 32), // 13:32
    convertToSeconds(13, 44), // 13:44
    convertToSeconds(14, 20), // 14:20
    convertToSeconds(14, 32), // 14:32
    convertToSeconds(14, 44), // 14:44
    convertToSeconds(15, 50), // 15:50
    convertToSeconds(16, 2), // 16:02 (DS)
    convertToSeconds(16, 14), // 16:14
    convertToSeconds(17, 2), // 17:02
    convertToSeconds(17, 20), // 17:20
    convertToSeconds(18, 44), // 18:44
    convertToSeconds(18, 50), // 18:50
    convertToSeconds(19, 2), // 19:02
    convertToSeconds(19, 14), // 19:14
    convertToSeconds(19, 50), // 19:50
    convertToSeconds(20, 2), // 20:02
    convertToSeconds(20, 14), // 20:14
    convertToSeconds(21, 15), // 21:15 (CENTAUR)
    convertToSeconds(21, 20), // 21:20
    convertToSeconds(21, 44), // 21:44
    convertToSeconds(22, 20), // 22:20
    convertToSeconds(22, 32), // 22:32
    convertToSeconds(22, 44), // 22:44
    convertToSeconds(23, 44), // 23:44
    convertToSeconds(23, 50), // 23:50
    convertToSeconds(24, 20), // 24:20
    convertToSeconds(24, 32), // 24:32
    convertToSeconds(24, 44), // 24:44
  ];

  let specialTimes03 = [
    convertToSeconds(5, 3), // 5:03
    convertToSeconds(5, 15), // 5:15
    convertToSeconds(5, 51), // 5:51
    convertToSeconds(6, 3), // 6:03 (TB)
    convertToSeconds(6, 15), // 6:15
    convertToSeconds(6, 51), // 6:51
    convertToSeconds(7, 3), // 7:03 (CW)
    convertToSeconds(7, 15), // 7:15
    convertToSeconds(7, 21), // 7:21
    convertToSeconds(8, 21), // 8:21
    convertToSeconds(8, 33), // 8:33
    convertToSeconds(9, 3), // 9:03
    convertToSeconds(9, 15), // 9:15
    convertToSeconds(9, 45), // 9:45
    convertToSeconds(9, 51), // 9:51
    convertToSeconds(10, 3), // 10:03
    convertToSeconds(10, 45), // 10:45
    convertToSeconds(10, 51), // 10:51
    convertToSeconds(11, 33), // 11:33
    convertToSeconds(11, 51), // 11:51
    convertToSeconds(12, 21), // 12:21
    convertToSeconds(12, 33), // 12:33
    convertToSeconds(13, 3), // 13:03
    convertToSeconds(13, 15), // 13:15
    convertToSeconds(13, 21), // 13:21
    convertToSeconds(13, 33), // 13:33
    convertToSeconds(13, 45), // 13:45
    convertToSeconds(14, 21), // 14:21
    convertToSeconds(14, 33), // 14:33
    convertToSeconds(14, 45), // 14:45
    convertToSeconds(15, 51), // 15:51
    convertToSeconds(16, 3), // 16:03 (DS)
    convertToSeconds(16, 15), // 16:15
    convertToSeconds(17, 3), // 17:03
    convertToSeconds(17, 21), // 17:21
    convertToSeconds(18, 45), // 18:45
    convertToSeconds(18, 51), // 18:51
    convertToSeconds(19, 3), // 19:03
    convertToSeconds(19, 15), // 19:15
    convertToSeconds(19, 51), // 19:51
    convertToSeconds(20, 3), // 20:03
    convertToSeconds(20, 15), // 20:15
    convertToSeconds(21, 15), // 21:15 (CENTAUR)
    convertToSeconds(21, 21), // 21:21
    convertToSeconds(21, 45), // 21:45
    convertToSeconds(22, 21), // 22:21
    convertToSeconds(22, 33), // 22:33
    convertToSeconds(22, 45), // 22:45
    convertToSeconds(23, 45), // 23:45
    convertToSeconds(23, 51), // 23:51
    convertToSeconds(24, 21), // 24:21
    convertToSeconds(24, 33), // 24:33
    convertToSeconds(24, 45), // 24
  ];
  let specialTimes003 = [
    convertToSeconds(5, 3), // 5:03
    convertToSeconds(5, 9), // 5:09
    convertToSeconds(5, 51), // 5:51
    convertToSeconds(6, 3), // 6:03 (TB)
    convertToSeconds(6, 9), // 6:09
    convertToSeconds(6, 51), // 6:51
    convertToSeconds(7, 3), // 7:03 (CW)
    convertToSeconds(7, 9), // 7:09
    convertToSeconds(7, 21), // 7:21
    convertToSeconds(8, 21), // 8:21
    convertToSeconds(8, 33), // 8:33
    convertToSeconds(9, 3), // 9:03
    convertToSeconds(9, 9), // 9:09
    convertToSeconds(9, 39), // 9:39
    convertToSeconds(9, 51), // 9:51
    convertToSeconds(10, 3), // 10:03
    convertToSeconds(10, 39), // 10:39
    convertToSeconds(10, 51), // 10:51
    convertToSeconds(11, 33), // 11:33
    convertToSeconds(11, 51), // 11:51
    convertToSeconds(12, 21), // 12:21
    convertToSeconds(12, 33), // 12:33
    convertToSeconds(13, 3), // 13:03
    convertToSeconds(13, 9), // 13:09
    convertToSeconds(13, 21), // 13:21
    convertToSeconds(13, 33), // 13:33
    convertToSeconds(13, 39), // 13:39
    convertToSeconds(14, 21), // 14:21
    convertToSeconds(14, 33), // 14:33
    convertToSeconds(14, 39), // 14:39
    convertToSeconds(15, 51), // 15:51
    convertToSeconds(16, 3), // 16:03 (DS)
    convertToSeconds(16, 9), // 16:09
    convertToSeconds(17, 3), // 17:03
    convertToSeconds(17, 21), // 17:21
    convertToSeconds(18, 39), // 18:39
    convertToSeconds(18, 51), // 18:51
    convertToSeconds(19, 3), // 19:03
    convertToSeconds(19, 9), // 19:09
    convertToSeconds(19, 51), // 19:51
    convertToSeconds(20, 3), // 20:03
    convertToSeconds(20, 9), // 20:09
    convertToSeconds(21, 9), // 21:09 (CENTAUR)
    convertToSeconds(21, 21), // 21:21
    convertToSeconds(21, 39), // 21:39
    convertToSeconds(22, 21), // 22:21
    convertToSeconds(22, 33), // 22:33
    convertToSeconds(22, 39), // 22:39
    convertToSeconds(23, 39), // 23:39
    convertToSeconds(23, 51), // 23:51
    convertToSeconds(24, 21), // 24:21
    convertToSeconds(24, 33), // 24:33
    convertToSeconds(24, 39), // 24:39
  ];
  let specialTimes04 = [
    convertToSeconds(5, 4), // 5:04
    convertToSeconds(5, 10), // 5:10
    convertToSeconds(5, 52), // 5:52
    convertToSeconds(6, 4), // 6:04 (TB)
    convertToSeconds(6, 10), // 6:10
    convertToSeconds(6, 52), // 6:52
    convertToSeconds(7, 4), // 7:04 (CW)
    convertToSeconds(7, 10), // 7:10
    convertToSeconds(7, 22), // 7:22
    convertToSeconds(8, 22), // 8:22
    convertToSeconds(8, 34), // 8:34
    convertToSeconds(9, 4), // 9:04
    convertToSeconds(9, 10), // 9:10
    convertToSeconds(9, 40), // 9:40
    convertToSeconds(9, 52), // 9:52
    convertToSeconds(10, 4), // 10:04
    convertToSeconds(10, 40), // 10:40
    convertToSeconds(10, 52), // 10:52
    convertToSeconds(11, 34), // 11:34
    convertToSeconds(11, 52), // 11:52
    convertToSeconds(12, 22), // 12:22
    convertToSeconds(12, 34), // 12:34
    convertToSeconds(13, 4), // 13:04
    convertToSeconds(13, 10), // 13:10
    convertToSeconds(13, 22), // 13:22
    convertToSeconds(13, 34), // 13:34
    convertToSeconds(13, 40), // 13:40
    convertToSeconds(14, 22), // 14:22
    convertToSeconds(14, 34), // 14:34
    convertToSeconds(14, 40), // 14:40
    convertToSeconds(15, 52), // 15:52
    convertToSeconds(16, 4), // 16:04 (DS)
    convertToSeconds(16, 10), // 16:10
    convertToSeconds(17, 4), // 17:04
    convertToSeconds(17, 22), // 17:22
    convertToSeconds(18, 40), // 18:40
    convertToSeconds(18, 52), // 18:52
    convertToSeconds(19, 4), // 19:04
    convertToSeconds(19, 10), // 19:10
    convertToSeconds(19, 52), // 19:52
    convertToSeconds(20, 4), // 20:04
    convertToSeconds(20, 10), // 20:10
    convertToSeconds(21, 10), // 21:10 (CENTAUR)
    convertToSeconds(21, 22), // 21:22
    convertToSeconds(21, 40), // 21:40
    convertToSeconds(22, 22), // 22:22
    convertToSeconds(22, 34), // 22:34
    convertToSeconds(22, 40), // 22:40
    convertToSeconds(23, 40), // 23:40
    convertToSeconds(23, 52), // 23:52
    convertToSeconds(24, 22), // 24:22
    convertToSeconds(24, 34), // 24:34
    convertToSeconds(24, 40), // 24:40
  ];
  let specialTimes05 = [
    convertToSeconds(5, 5), // 5:05
    convertToSeconds(5, 11), // 5:11
    convertToSeconds(5, 53), // 5:53
    convertToSeconds(6, 5), // 6:05 (TB)
    convertToSeconds(6, 11), // 6:11
    convertToSeconds(6, 53), // 6:53
    convertToSeconds(7, 5), // 7:05 (CW)
    convertToSeconds(7, 11), // 7:11
    convertToSeconds(7, 23), // 7:23
    convertToSeconds(8, 23), // 8:23
    convertToSeconds(8, 35), // 8:35
    convertToSeconds(9, 5), // 9:05
    convertToSeconds(9, 11), // 9:11
    convertToSeconds(9, 41), // 9:41
    convertToSeconds(9, 53), // 9:53
    convertToSeconds(10, 5), // 10:05
    convertToSeconds(10, 41), // 10:41
    convertToSeconds(10, 53), // 10:53
    convertToSeconds(11, 35), // 11:35
    convertToSeconds(11, 53), // 11:53
    convertToSeconds(12, 23), // 12:23
    convertToSeconds(12, 35), // 12:35
    convertToSeconds(13, 5), // 13:05
    convertToSeconds(13, 11), // 13:11
    convertToSeconds(13, 23), // 13:23
    convertToSeconds(13, 35), // 13:35
    convertToSeconds(13, 41), // 13:41
    convertToSeconds(14, 23), // 14:23
    convertToSeconds(14, 35), // 14:35
    convertToSeconds(14, 41), // 14:41
    convertToSeconds(15, 53), // 15:53
    convertToSeconds(16, 5), // 16:05 (DS)
    convertToSeconds(16, 11), // 16:11
    convertToSeconds(17, 5), // 17:05
    convertToSeconds(17, 23), // 17:23
    convertToSeconds(18, 41), // 18:41
    convertToSeconds(18, 53), // 18:53
    convertToSeconds(19, 5), // 19:05
    convertToSeconds(19, 11), // 19:11
    convertToSeconds(19, 53), // 19:53
    convertToSeconds(20, 5), // 20:05
    convertToSeconds(20, 11), // 20:11
    convertToSeconds(21, 11), // 21:11 (CENTAUR)
    convertToSeconds(21, 23), // 21:23
    convertToSeconds(21, 41), // 21:41
    convertToSeconds(22, 23), // 22:23
    convertToSeconds(22, 35), // 22:35
    convertToSeconds(22, 41), // 22:41
    convertToSeconds(23, 41), // 23:41
    convertToSeconds(23, 53), // 23:53
    convertToSeconds(24, 23), // 24:23
    convertToSeconds(24, 35), // 24:35
    convertToSeconds(24, 41), // 24:41
  ];

  let centaurtime = [convertToSeconds(20, 40)]; // 5:05

  currentTime = Math.max(0, Math.min(currentTime, totalDuration));

  cursor.addEventListener("mousedown", function (e) {
    e.preventDefault();

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseup", releaseCursor);
  });

  // Add an event listener to the form
  radioForm.addEventListener("change", function () {
    selectedRadio = document.querySelector('input[name="radioGroup"]:checked');
    playButton.disabled = false;

    // Check if a radio button is selected
  });
  function moveCursor(e) {
    const containerWidth = progressBar.clientWidth;
    const cursorWidth = cursor.clientWidth;

    const newPosition =
      e.clientX - progressBar.getBoundingClientRect().left - cursorWidth / 2;

    if (newPosition >= 0 && newPosition <= containerWidth - cursorWidth) {
      cursor.style.left = newPosition + "px";
      const percent = (newPosition / (containerWidth - cursorWidth)) * 100;
      progressBar.value = percent;
      currentTime = Math.floor((percent / 100) * totalDuration);
      startTime = Date.now() - currentTime * 1000; // startTime'ı güncelle
      currentTimeDisplay.textContent = formatTime(currentTime);
    }
  }

  function releaseCursor() {
    document.removeEventListener("mousemove", moveCursor);
    document.removeEventListener("mouseup", releaseCursor);
  }

  playButton.addEventListener("click", function () {
    if (selectedRadio) {
      startTimer();
    } else {
      // Display an error message or take appropriate action
      console.log("Please select a radio option before starting.");
    }
  });

  // Add a click event listener to the pause button
  pauseButton.addEventListener("click", function () {
    if (selectedRadio) {
      pauseTimer();
    } else {
      // Display an error message or take appropriate action
      console.log("Please select a radio option before pausing.");
    }
  });

  let startTime;

  function startTimer() {
    if (isPlaying) return; // Eğer sayaç zaten çalışıyorsa, fonksiyonu sonlandır

    isPlaying = true;
    startTime = Date.now() - currentTime * 1000; // currentTime'ı milisaniye cinsinden hesapla

    interval = setInterval(function () {
      currentTime = Math.floor((Date.now() - startTime) / 1000); // Geçen süreyi saniye cinsinden hesapla
      currentTimeDisplay.textContent = formatTime(currentTime);
      progressBar.value = (currentTime / totalDuration) * 100;

      // Synchronize cursor position
      const cursorPosition =
        (currentTime / totalDuration) *
          (progressBar.clientWidth - cursor.clientWidth) +
        cursor.clientWidth / 2;
      cursor.style.left = cursorPosition + "px";
      const containerWidth = progressBar.clientWidth;
      const cursorWidth = cursor.clientWidth;
      const percent = (currentTime / totalDuration) * 100;
      const newPosition = (containerWidth - cursorWidth) * (percent / 100);
      cursor.style.left = newPosition + "px";

      updateTime(selectedRadio);

      if (currentTime >= totalDuration) {
        pauseTimer();
      }
    }, 1000);

    playButton.disabled = true;
    pauseButton.disabled = false;
  }

  function pauseTimer() {
    isPlaying = false;
    clearInterval(interval);
    playButton.disabled = false;
    pauseButton.disabled = true;
  }

  progressBar.addEventListener("input", function () {
    currentTime = (progressBar.value * totalDuration) / 100;
    currentTimeDisplay.textContent = formatTime(currentTime);
    updateTime(selectedRadio);
  });

  function updateTime(selectedRadio) {
    let isSpecialTime = false;

    // Iterate through special times arrays based on the selected radio value
    const specialTimesArray = getSpecialTimesArray(selectedRadio.value);
    if (specialTimesArray) {
      isSpecialTime = specialTimesArray.some(
        (time) => currentTime >= time - 2 && currentTime < time
      );
    }
    currentTimeDisplay.textContent = formatTime(currentTime);
    progressBar.value = (currentTime / totalDuration) * 100;
    // Synchronize cursor position
    const cursorPosition =
      (currentTime / totalDuration) *
        (progressBar.clientWidth - cursor.clientWidth) +
      cursor.clientWidth / 2;
    cursor.style.left = cursorPosition + "px";
    const containerWidth = progressBar.clientWidth;
    const cursorWidth = cursor.clientWidth;
    const percent = (currentTime / totalDuration) * 100;
    const newPosition = (containerWidth - cursorWidth) * (percent / 100);
    cursor.style.left = newPosition + "px";

    CT = centaurtime.some(
      (time) => currentTime >= time - 3 && currentTime < time
    );

    if (CT && !isSecondAudioPlaying) {
      isSecondAudioPlaying = true;
      const dikkat = new Audio("/assets/music/dikkat.mp3");
      dikkat.play();
      dikkat.onended = function () {
        isSecondAudioPlaying = false;
      };
    }

    if (isSpecialTime && !isSecondAudioPlaying) {
      isSecondAudioPlaying = true;
      const secondAudio = new Audio("/assets/music/ses.mp3");
      secondAudio.play();
      secondAudio.onended = function () {
        isSecondAudioPlaying = false;
      };
    }

    if (currentTime >= totalDuration) {
      pauseTimer();
    }
  }
  function getSpecialTimesArray(selectedRadioValue) {
    switch (selectedRadioValue) {
      case "radio00":
        return specialTimes;
      case "radio01":
        return specialTimes01;
      case "radio02":
        return specialTimes02;
      case "radio03":
        return specialTimes03;
      case "radio003":
        return specialTimes003;
      case "radio04":
        return specialTimes04;
      case "radio05":
        return specialTimes05;
      default:
        return specialTimes; // Use a default value if the selectedRadioValue is not recognized
    }
  }
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function convertToSeconds(minutes, seconds) {
    return minutes * 60 + seconds;
  }

  function goToTime(time) {
    var timeArray = time.split(":");
    var hours = parseInt(timeArray[0]);
    var minutes = parseInt(timeArray[1]);

    // Zamanı saniyeye çevirin (saat*3600 + dakika*60)
    var targetTimeInSeconds = hours * 60 + minutes;

    // Şu anki zamanı güncelleyin
    currentTime = targetTimeInSeconds;
    startTime = Date.now() - currentTime * 1000;

    // Seçilen radyo istasyonunu güncelleyin (örneğin, "radio01")
    var selectedRadio = document.querySelector(
      'input[name="radioGroup"]:checked'
    );

    // updateTime işlevini çağırarak zamanı güncelleyin
    updateTime(selectedRadio);
  }

  // Radio düğmelerini seçin
  var radioButtons = document.querySelectorAll('input[type="radio"]');

  // Seçilen değeri gösterecek olan div'i alın
  var selectedValueDiv = document.getElementById("TSüre");
  var buttonContainer = document.getElementById("buttonContainer");

  // Radio düğmelerine tıklanıldığında çalışacak kod
  radioButtons.forEach(function (radio) {
    radio.addEventListener("change", function () {
      // Seçilen radio düğmesinin değerini alın
      var selectedValue = this.value;

      // İlgili metni oluşturun
      var text = "";

      if (selectedValue === "radio00") {
        text = `(( 00 SÜRELERİ ))\n
5:00 - 5:12 - 5:54 - 6:00(TB) - 6:12 - 6:54 - 7:00(CW) - 7:12 - 7:24
8:24 - 8:30 - 9:00 - 9:12 - 9:42 - 9:54 - 10:00
10:42 - 10:54 - 11:30 - 11:54 - 12:24 - 12:30
13:00 - 13:12 - 13:24 - 13:30 - 13:42
14:24 - 14:30 - 14:42 - 15:54 - 16:00(DS) - 16:12 - 17:00 - 17:24
18:42 - 18:54 - 19:00 - 19:12 - 19:54 - 20:00 - 20:12
21:12(CENTAUR) - 21:24 - 21:42 - 22:24 - 22:30 - 22:42
23:42 - 23:54 - 24:24 - 24:30 - 24:42`;
      } else if (selectedValue === "radio01") {
        text = `(( 01 SÜRELERİ ))\n
5:01 - 5:13 - 5:55 - 6:01(TB) - 6:13 - 6:55 - 7:01(CW) - 7:13 - 7:25
8:25 - 8:31 - 9:01 - 9:13 - 9:43 - 9:55 - 10:01
10:43 - 10:55 - 11:31 - 11:55 - 12:25 - 12:31
13:01 - 13:13 - 13:25 - 13:31 - 13:43
14:25 - 14:31 - 14:43 - 15:55 - 16:01(DS) - 16:13 - 17:01 - 17:25
18:43 - 18:55 - 19:01 - 19:13 - 19:55 - 20:01 - 20:13
21:13(CENTAUR) - 21:25 - 21:43 - 22:25 - 22:31 - 22:43
23:43 - 23:55 - 24:25 - 24:31 - 24:43`;
      } else if (selectedValue === "radio02") {
        text = `(( 02 SÜRELERİ ))\n
5:02 - 5:14 - 5:50 - 6:02(TB) - 6:14 - 6:50 - 7:02(CW) - 7:14 - 7:20
8:20 - 8:32 - 9:02 - 9:14 - 9:44 - 9:50 - 10:02
10:44 - 10:50 - 11:32 - 11:50 - 12:20 - 12:32
13:02 - 13:14 - 13:20 - 13:32 - 13:44
14:20 - 14:32 - 14:44 - 15:50 - 16:02(DS) - 16:14 - 17:02 - 17:20
18:44 - 18:50 - 19:02 - 19:14 - 19:50 - 20:02 - 20:14
21:15(CENTAUR) - 21:20 - 21:44 - 22:20 - 22:32 - 22:44
23:44 - 23:50 - 24:20 - 24:32 - 24:44`;
      } else if (selectedValue === "radio03") {
        text = `(( 03 SÜRELERİ ))\n
5:03 - 5:15 - 5:51 - 6:03(TB) - 6:15 - 6:51 - 7:03(CW) - 7:15 - 7:21
8:21 - 8:33 - 9:03 - 9:15 - 9:45 - 9:51 - 10:03
10:45 - 10:51 - 11:33 - 11:51 - 12:21 - 12:33
13:03 - 13:15 - 13:21 - 13:33 - 13:45
14:21 - 14:33 - 14:45 - 15:51 - 16:03(DS) - 16:15 - 17:03 - 17:21
18:45 - 18:51 - 19:03 - 19:15 - 19:51 - 20:03 - 20:15
21:15(CENTAUR) - 21:21 - 21:45 - 22:21 - 22:33 - 22:45
23:45 - 23:51 - 24:21 - 24:33 - 24:45`;
      } else if (selectedValue === "radio003") {
        text = `(( 003 SÜRELERİ ))
5:03 - 5:09 - 5:51 - 6:03(TB) - 6:09- 6:51 - 7:03(CW) - 7:09 - 7:21
8:21 - 8:33 - 9:03 - 9:09 - 9:39 - 9:51 - 10:03
10:39 - 10:51 - 11:33 - 11:51 - 12:21 - 12:33
13:03 - 13:09 - 13:21 - 13:33 - 13:39
14:21 - 14:33 - 14:39 - 15:51 - 16:03(DS) - 16:09 - 17:03 - 17:21
18:39 - 18:51 - 19:03 - 19:09 - 19:51 - 20:03 - 20:09
21:09(CENTAUR) - 21:21 - 21:39 - 22:21 - 22:33 - 22:39
23:39 - 23:51 - 24:21 - 24:33 - 24:39`;
      } else if (selectedValue === "radio04") {
        text = `(( 04 SÜRELERİ ))
5:04 - 5:10 - 5:52 - 6:04(TB) - 6:10 - 6:52 - 7:04(CW) - 7:10 - 7:22
8:22 - 8:34 - 9:04 - 9:10 - 9:40 - 9:52 - 10:04
10:40 - 10:52 - 11:34 - 11:52 - 12:22 - 12:34
13:04 - 13:10 - 13:22 - 13:34 - 13:40
14:22 - 14:34 - 14:40 - 15:52 - 16:04(DS) - 16:10 - 17:04 - 17:22
18:40 - 18:52 - 19:04 - 19:10 - 19:52 - 20:04 - 20:10
21:10(CENTAUR) - 21:22 - 21:40 - 22:22 - 22:34 - 22:40
23:40 - 23:52 - 24:22 - 24:34 - 24:40`;
      } else if (selectedValue === "radio05") {
        text = `(( 05 SÜRELERİ ))
5:05 - 5:11 - 5:53 - 6:05(TB) - 6:11 - 6:53 - 7:05(CW) - 7:11 - 7:23
8:23 - 8:35 - 9:05 - 9:11 - 9:41 - 9:53 - 10:05
10:41 - 10:53 - 11:35 - 11:53 - 12:23 - 12:35
13:05 - 13:11 - 13:23 - 13:35 - 13:41
14:23 - 14:35 - 14:41 - 15:53 - 16:05(DS) - 16:11 - 17:05 - 17:23
18:41 - 18:53 - 19:05 - 19:11 - 19:53 - 20:05 - 20:11
21:11(CENTAUR) - 21:23 - 21:41 - 22:23 - 22:35 - 22:41
23:41 - 23:53 - 24:23 - 24:35 - 24:41`;
      }

      // Seçilen değeri gösterilen div'e yazın
      buttonContainer.innerHTML = "";

      var lines = text.split("\n");

      // Her satır için bir div oluştur
      lines.forEach(function (line) {
        // Satırın başındaki ve sonundaki boşlukları sil
        line = line.trim();

        // Satırın boş olmadığını kontrol et
        if (line !== "") {
          // Satırı - işaretine göre böl
          var parts = line.split("-");

          // Her parça için bir button oluştur
          parts.forEach(function (part) {
            // Parçanın boş olmadığını kontrol et
            if (part !== "") {
              // Button elemanını oluştur
              var button = document.createElement("button");
              button.type = "button"; // Bu satır eklenmiştir

              // Buttonun içeriğini parçaya eşitle
              button.innerHTML = part;

              // Buttonun stilini ayarla
              button.style.margin = "5px";
              button.style.padding = "10px";
              button.style.backgroundColor = "#3498db";
              button.style.color = "#fff";
              button.style.border = "none";
              button.style.borderRadius = "5px";

              // Buttonu buttonContainer divine ekle
              button.addEventListener("click", function () {
                // Buttonun içeriğindeki zamanı alın
                var time = part.split("(")[0].trim();
                goToTime(time);
              });
              buttonContainer.appendChild(button);
            }
          });

          // Satır sonunda bir boşluk bırak
          var space = document.createElement("br");
          buttonContainer.appendChild(space);
        }
      });
    });
  });
});
