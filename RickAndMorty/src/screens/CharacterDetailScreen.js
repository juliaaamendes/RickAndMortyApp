import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const CharacterDetailScreen = ({ route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacterDetails();
  }, []);

  const fetchCharacterDetails = async () => {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
      setCharacter(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Image
        source={{ uri: character.image }}
        style={{ width: '100%', height: 300, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
        {character.name}
      </Text>
      <Text>Status: {character.status}</Text>
      <Text>Espécie: {character.species}</Text>
      <Text>Gênero: {character.gender}</Text>
      <Text>Origem: {character.origin.name}</Text>
      <Text>Localização: {character.location.name}</Text>
    </ScrollView>
  );
};

export default CharacterDetailScreen;