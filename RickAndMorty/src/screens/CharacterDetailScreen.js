import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator} from 'react-native';
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

  const getStatusColor = () => {
    switch (character.status) {
      case 'Dead':
        return '#db4227ff';
      case 'unknown':
        return '#f0b44dff';
      default: // Alive
        return '#97ce4c';
    }
  };

  const statusColor = getStatusColor();
  const boxStyle = {
    borderColor: statusColor,
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Image
        source={{ uri: character.image }}
        style={{ width: 300, height: 300, borderRadius: 145, padding: 10, alignSelf: 'center', borderColor: statusColor, borderWidth: 4 }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: statusColor, textAlign: 'center' }}>
        {character.name}
      </Text>
      
      <View style={boxStyle}>
        <Text><Text style={{ fontWeight: 'bold' }}>Status:</Text> {character.status}</Text>
      </View>
      <View style={boxStyle}>
        <Text><Text style={{ fontWeight: 'bold' }}>Espécie:</Text> {character.species}</Text>
      </View>
      <View style={boxStyle}>
        <Text><Text style={{ fontWeight: 'bold' }}>Gênero:</Text> {character.gender}</Text>
      </View>
      <View style={boxStyle}>
        <Text><Text style={{ fontWeight: 'bold' }}>Origem:</Text> {character.origin.name}</Text>
      </View>
      <View style={boxStyle}>
        <Text><Text style={{ fontWeight: 'bold' }}>Localização:</Text> {character.location.name}</Text>
      </View>
    </ScrollView>
  );
};

export default CharacterDetailScreen;