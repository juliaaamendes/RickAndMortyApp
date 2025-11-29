import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const CharactersListScreen = ({ navigation }) => {
  // Estados para a lista básica
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para PAGINAÇÃO
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Estados para BUSCA
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

   // Função para esconder o teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Buscar personagens (usado tanto para lista normal quanto busca)
  const fetchCharacters = async (pageNum = 1, query = '') => {
    try {
      const url = query 
        ? `https://rickandmortyapi.com/api/character/?name=${query}&page=${pageNum}`
        : `https://rickandmortyapi.com/api/character/?page=${pageNum}`;
      
      const response = await axios.get(url);
      
      if (pageNum === 1) {
        // Primeira página - substitui a lista
        setCharacters(response.data.results);
      } else {
        // Páginas seguintes - adiciona à lista existente
        setCharacters(prev => [...prev, ...response.data.results]);
      }
      
      setHasMore(!!response.data.info.next);
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      if (pageNum === 1) {
        setCharacters([]);
      }
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      }
      setLoadingMore(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchCharacters(1, '');
  }, []);

  // 🔄 PAGINAÇÃO INFINITA
  const loadMoreCharacters = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage, searchQuery);
    }
  };

  // 🔍 BUSCA COM DEBOUNCE
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    // Limpa o timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Configura novo timeout para buscar após 500ms
    const newTimeout = setTimeout(() => {
      setLoading(true);
      setPage(1);
      fetchCharacters(1, text);
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  // Renderizar cada item da lista
  // Renderizar cada item da lista
  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        dismissKeyboard(); // 👈 Esconde teclado ao clicar em personagem
        navigation.navigate('Details', { characterId: item.id });
      }}
      style={styles.characterCard}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.characterImage}
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text style={styles.characterDetails}>
          {item.status} - {item.species}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && characters.length === 0) {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Carregando personagens...</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Renderizar loading do final da lista
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Carregando mais...</Text>
      </View>
    );
  };

  if (loading && characters.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Carregando personagens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 BARRA DE PESQUISA */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar personagem..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {/* 📜 LISTA DE PERSONAGENS */}
      <FlatList
        data={characters}
        renderItem={renderCharacterItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhum personagem encontrado' : 'Nenhum personagem'}
            </Text>
          }
          // 👈 ESTA PROP É IMPORTANTE para o teclado não interferir com scroll
          keyboardShouldPersistTaps="handled"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    height: 40,
    borderColor: '#97ce4c',
    borderWidth: 2,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  characterCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  characterInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  characterName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  characterDetails: {
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default CharactersListScreen;