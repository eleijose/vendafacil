import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/gerar", async (req, res) => {
  const { produto, publico, estilo } = req.body;

  const prompt = `
Crie um anúncio de vendas para:
Produto: ${produto}
Público: ${publico}
Estilo: ${estilo}

Inclua:
- Título chamativo
- Descrição persuasiva
- Chamada para ação
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.3",
        input: prompt
      })
    });

    const data = await response.json();

    res.json({
      resultado: data.output[0].content[0].text
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar resposta");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
