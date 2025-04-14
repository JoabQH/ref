# ref
Hola
const TimeSync = {
  async init(config) {
    try {
      let serverTime;

      try {
        serverTime = await this.getServerTime(config.serverUrl);
      } catch (serverErr) {
        console.warn("Fallo al obtener la hora desde el servidor, usando WorldTimeAPI como respaldo...");
        serverTime = await this.getWorldTime();
      }

      return await this.applyTime(serverTime);
    } catch (e) {
      console.error("Error al sincronizar la hora:", e);
      throw new Error("No se pudo sincronizar la hora.");
    }
  },

  async getServerTime(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Respuesta inválida del servidor");
    const data = await response.json();
    return new Date(data.currentTime);
  },

  async getWorldTime() {
    const response = await fetch("https://worldtimeapi.org/api/ip");
    if (!response.ok) throw new Error("Error al consultar WorldTimeAPI");
    const data = await response.json();
    return new Date(data.utc_datetime);
  },

  async applyTime(serverTime) {
    const currentTime = new Date();
    const difference = Math.abs(serverTime - currentTime);

    if (difference > 60000) {
      try {
        tizen.time.setCurrentDateTime(serverTime);
        return "Hora ajustada con éxito.";
      } catch (e) {
        console.error("Error al aplicar hora:", e);
        throw new Error("No se pudo ajustar la hora.");
      }
    } else {
      return "La hora ya estaba correcta.";
    }
  }
};



async function checkAndFixTime() {
  const message = document.getElementById("message");

  if (!message) {
    console.error("Elemento con id 'message' no encontrado");
    return;
  }

  try {
    const config = await ConfigManager.loadConfig();
    const resultText = await TimeSync.init(config);
    message.textContent = resultText;
  } catch (err) {
    console.error("Error al sincronizar:", err);
    message.textContent = "Error al sincronizar";
  }

  // Intenta cerrar la app después de 5 segundos
  setTimeout(() => {
    try {
      tizen.application.getCurrentApplication().exit();
    } catch (e) {
      console.error("No se pudo cerrar la app:", e);
    }
  }, 5000);
}
