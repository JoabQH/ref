const TimeSync = {
  async init(config) {
    try {
      let serverTime;

      try {
        serverTime = await this.getServerTime(config.serverUrl);
      } catch (serverErr) {
        console.warn("Fallo servidor. Intentando WorldTimeAPI...");
        try {
          serverTime = await this.getWorldTime();
        } catch (worldTimeErr) {
          console.warn("Fallo WorldTimeAPI. Intentando fallback local...");
          if (config.fallbackTimezone) {
            serverTime = this.getTimeFromTimezone(config.fallbackTimezone);
          } else {
            throw new Error("No hay fuente de tiempo válida.");
          }
        }
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

  getTimeFromTimezone(timezoneString) {
    const match = timezoneString.match(/UTC([+-]\d{1,2})/i);
    if (!match) throw new Error("Formato de fallbackTimezone inválido");

    const offsetHours = parseInt(match[1], 10);
    const nowUTC = new Date(new Date().toUTCString()); // Asegura que sea en UTC
    nowUTC.setHours(nowUTC.getHours() + offsetHours);
    return nowUTC;
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
