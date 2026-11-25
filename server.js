
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.json({
    service: "MOUSKI PRONOS",
    status: "Serveur actif"
  });
});

app.get("/api/fixtures", async (req, res) => {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "Clé API non configurée sur le serveur"
    });
  }

  try {
    const date = req.query.date ||
      new Date().toISOString().slice(0, 10);

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${encodeURIComponent(date)}`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur du fournisseur football"
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Erreur API football:", error.message);
    res.status(500).json({
      error: "Impossible de récupérer les matchs"
    });
  }
});

app.listen(PORT, () => {
  console.log(`MOUSKI PRONOS actif sur le port ${PORT}`);
});
