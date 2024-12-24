const proxyListUrl = "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt";
const proxyContainer = document.getElementById("proxyContainer");

async function fetchProxies() {
  try {
    const response = await fetch(proxyListUrl);
    const data = await response.text();
    return data.split("\n").filter((proxy) => proxy.trim() !== "");
  } catch (error) {
    console.error("Failed to fetch proxies:", error);
    return [];
  }
}

function checkProxyPing(proxy) {
  const start = Date.now();
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `http://${proxy}/favicon.ico?${Date.now()}`;
    img.onload = img.onerror = () => {
      const ping = Date.now() - start;
      resolve(ping);
    };
    setTimeout(() => resolve(Infinity), 5000);
  });
}

async function updateProxies() {
  const proxies = await fetchProxies();
  const filteredProxies = [];
  for (let i = 0; i < proxies.length && filteredProxies.length < 5; i++) {
    const proxy = proxies[i].trim();
    const ping = await checkProxyPing(proxy);
    if (ping > 200 && ping <= 1000) {
      filteredProxies.push({ proxy, ping });
    }
  }
  displayProxies(filteredProxies);
}

function displayProxies(proxies) {
  proxyContainer.innerHTML = "";
  proxies.forEach(({ proxy, ping }) => {
    const proxyCard = document.createElement("div");
    proxyCard.className = "proxy-card";
    proxyCard.innerHTML = `
      <div>${proxy}</div>
      <div class="status">
        <span class="status-dot"></span>
        <span>Live</span>
      </div>
      <div class="ping">Ping: ${ping} ms</div>
    `;
    proxyContainer.appendChild(proxyCard);
  });
}

setInterval(updateProxies, 10000);
updateProxies();
