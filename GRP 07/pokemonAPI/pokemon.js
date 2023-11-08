const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

app.get('/pokemon', (req, res) => {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/50'; // URL do Pokémon de exemplo (você pode alterar o número para obter informações de outros Pokémon)
  https.get(apiUrl, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const pokemonData = JSON.parse(data);
        const abilitiesCount = pokemonData.abilities.length;
        const name = pokemonData.name;
        const frontDefaultURL = pokemonData.sprites['front_default'];

        const responseObject = {
          abilities: abilitiesCount,
          name: name,
          front_default: frontDefaultURL,
        };

        res.json(responseObject);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao processar a requisição.' });
      }
    });
  }).on('error', (error) => {
    res.status(500).json({ error: 'Erro ao fazer a requisição para a API Pokémon.' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
