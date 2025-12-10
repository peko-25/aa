import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// Tu API Key de SubDL
const API_KEY = "0RahrNdhQWVkU39Qpz95X_pksSkgmQ40";

// Manifest para Strimio
app.get("/manifest.json", (req, res) => {
  res.json({
    id: "subdl-addon",
    version: "1.0.0",
    name: "SubDL Subtitles",
    description: "Addon de subtítulos usando SubDL",
    resources: ["subtitles"],
    types: ["movie", "series"],
    logo: "https://stremio.com/logo.png",
    behaviorHints: { configurable: false }
  });
});

// Endpoint de subtítulos
app.get("/subtitles/:type/:id.json", async (req, res) => {
  const imdbId = req.params.id.replace("tt", "");

  try {
    const response = await fetch(
      `https://api.subdl.com/api/v1/subtitles?api_key=${API_KEY}&imdb_id=${imdbId}`
    );
    const data = await response.json();

    // Si SubDL no devuelve nada, devolvemos array vacío
    if (!data.data || data.data.length === 0) {
      return res.json({ subtitles: [] });
    }

    // Mapear los subtítulos al formato Strimio
    const subtitles = data.data.map(sub => ({
      id: sub.id,
      lang: "es-LA",
      url: sub.attributes.url,
      type: "srt"
    }));

    res.json({ subtitles });

  } catch (err) {
    console.error(err);
    // Siempre devolver un JSON válido
    res.json({ subtitles: [] });
  }
});

// Arrancar servidor
app.listen(PORT, () => console.log(`SubDL addon running on port ${PORT}`));
