var express = require('express');
const mysql = require('mysql');
const axios = require('axios');
var router = express.Router();

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pokemon_api'
});

// Rota para capturar um Pokémon aleatório
router.get('/capturar', async function(req, res, next) {
  try {
    // Gerar um ID aleatório entre 1 e 100
    const randomPokemonId = Math.floor(Math.random() * 100) + 1;
    
    // Construir a URL da PokeAPI com o ID aleatório
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`;
  
    // Consumir a rota externa da PokeAPI
    const response = await axios.get(pokemonUrl);
    const pokemonData = response.data;

    // Salvar os dados no db
    const { abilities, base_experience, id, name, sprites } = pokemonData;
    const { other } = sprites;
    const tmp_dream_world = other.dream_world
    const url = tmp_dream_world.front_default

    
    // Ordenar as habilidades de acordo com o slot
    const sortedAbilities = abilities.map((ability, index) => ({
      sequencial: index + 1,
      nome: ability.ability.name,
      slot: ability.slot
    }));

    // Verificar se o Pokémon já existe no db
    const checkIfExistsQuery = 'SELECT * FROM pokemon_captured WHERE id_pokemon = ?';
    db.query(checkIfExistsQuery, [randomPokemonId], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        // Se o Pokémon já existe, retornar a mensagem adequada
        res.json({ message: 'Pokémon já capturado anteriormente.' });
      } else {
        // Caso contrário, consumir a rota externa da PokeAPI
        const sql = `
        INSERT INTO pokemon_captured (id_pokemon, name, base_experience, abilities, url)
        VALUES (?, ?, ?, ?, ?)
        `;
        // Executar a consulta no db
        db.query(sql, [id, name, base_experience, JSON.stringify(sortedAbilities), url], (err, result) => {
          if (err) throw err;
          
          console.log(`Pokémon com ID ${id} capturado e salvo no banco de dados.`);
          res.json(pokemonData);
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao capturar o Pokémon' });
  }
});

// Rota para capturar um Pokémon específico por ID
router.get('/capturar/:id', async function(req, res, next) {
  try {
    const pokemonId = req.params.id;
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const response = await axios.get(pokemonUrl);
    
    // Verificar se o Pokémon já existe no banco de dados
    const checkIfExistsQuery = 'SELECT * FROM pokemon_captured WHERE id_pokemon = ?';
    db.query(checkIfExistsQuery, [pokemonId], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        // Se o Pokémon já existe, retornar a mensagem adequada
        res.json({ message: 'Pokémon já está na Pokédex.' });
      } else {
        // Caso contrário, consumir a rota externa da PokeAPI
        const pokemonData = response.data;
        // Salvar os dados no banco de dados conforme especificado
        const { abilities, base_experience, id, name, sprites } = pokemonData;
        const { other } = sprites;
        const tmp_dream_world = other.dream_world
        const url = tmp_dream_world.front_default

        // Ordenar as habilidades de acordo com o slot
        const sortedAbilities = abilities.map((ability, index) => ({
          sequencial: index + 1,
          nome: ability.ability.name,
          slot: ability.slot
        }));

        // SQL para inserir os dados no banco de dados
        const sql = `
        INSERT INTO pokemon_captured (id_pokemon, name, base_experience, abilities, url)
        VALUES (?, ?, ?, ?, ?)
      `;

        // Executar a consulta no banco de dados
        db.query(sql, [id, name, base_experience, JSON.stringify(sortedAbilities), url], (err, result) => {
          if (err) throw err;
          
          console.log(`Pokémon com ID ${id} capturado e salvo no banco de dados.`);
          res.json(pokemonData);
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao capturar o Pokémon' });
  }
});


// Rota para batalhar com um Pokémon aleatório
router.get('/batalhar/:id', async function(req, res, next) {
  try {
    const pokemonId = req.params.id;

    // Consumir a rota externa da PokeAPI para obter um Pokémon aleatório
    const randomEnemyId = Math.floor(Math.random() * 100) + 1;
    const enemyPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomEnemyId}`;
    const enemyResponse = await axios.get(enemyPokemonUrl);
    const enemyPokemonData = enemyResponse.data;

    // Consumir a rota externa da PokeAPI para obter o Pokémon com ID fornecido
    const userPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const userResponse = await axios.get(userPokemonUrl);
    const userPokemonData = userResponse.data;

    // Calcular o "poder" do Pokémon conforme especificado
    const calculatePower = (pokemon) => {
      const abilitiesCount = pokemon.abilities.length;
      const totalSlotValue = pokemon.abilities.reduce((total, ability) => total + ability.slot, 0);
      const power = Math.log(abilitiesCount * totalSlotValue * pokemon.base_experience);
      return power;
    };

    // Calcular o "poder" para ambos os Pokémons
    const userPower = calculatePower(userPokemonData);
    const enemyPower = calculatePower(enemyPokemonData);

    // Adicionar o "poder" aos dados do Pokémon e salvar no banco de dados
    const enemySql = `
        INSERT INTO pokemon_battle (enemy_id, enemy_power, user_pokemon_id)
        VALUES (?, ?, ?)
      `;
    const updateUserPower = 'UPDATE pokemon_captured SET power = ? WHERE id_pokemon = ?';

    db.query(updateUserPower, [userPower, pokemonId], (err, result) => {
      if (err) throw err;

      db.query(enemySql, [randomEnemyId, enemyPower, pokemonId], (err, result) => {
        if (err) throw err;

        console.log(`Batalha registrada entre Pokémon ID ${pokemonId} e Pokémon aleatório ID ${randomEnemyId}.`);
        res.json({ message: 'Batalha concluída' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao batalhar com o Pokémon' });
  }
});

// Rota para obter a Pokédex completa
router.get('/pokedex', function(req, res, next) {
  // Consultar o banco de dados e retornar todos os Pokémons capturados
  const getPokedexQuery = 'SELECT * FROM pokemon_captured';

  db.query(getPokedexQuery, (err, result) => {
    if (err) throw err;

    console.log('Consulta à Pokédex realizada com sucesso.');
    res.json(result);
  });
});

// Rota para obter um Pokémon específico na Pokédex por ID
router.get('/pokedex/:id', function(req, res, next) {
  const pokemonId = req.params.id;

  // Consultar o banco de dados e retornar os dados do Pokémon específico
  const getPokemonQuery = 'SELECT * FROM pokemon_captured WHERE id_pokemon = ?';

  db.query(getPokemonQuery, [pokemonId], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      console.log(`Consulta ao Pokémon ID ${pokemonId} realizada com sucesso.`);
      res.json(result[0]); // Retorna apenas o primeiro resultado (deve ser único, pois ID é chave primária)
    } else {
      res.status(404).json({ message: 'Pokémon não encontrado na Pokédex.' });
    }
  });
});

module.exports = router;