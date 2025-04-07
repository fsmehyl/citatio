console.log("som tu");

chrome.action.onClicked.addListener(() => {
  console.log("Kliknutie na ikonu rozšírenia");

  chrome.windows.create(
    {
      url: chrome.runtime.getURL("hello.html"),
      type: "popup",
    },
    (window) => {
      if (chrome.runtime.lastError) {
        console.error("Chyba pri otváraní okna:", chrome.runtime.lastError);
      } else {
        console.log("Nové okno otvorené:", window);
      }
    }
  );
});
