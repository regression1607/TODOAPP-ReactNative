import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, Alert, TextInput, Button } from 'react-native';
import axios from 'axios';

const defaultCategories = ['national', 'international', 'sports', 'politics', 'business', 'health', 'science', 'technology', 'education'];

const NewsScreen: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      let url = '';
      if (category) {
        url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
      } else if (searchTerm) {
        url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?category=${defaultCategories.join(',')}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
      }

      try {
        const response = await axios.get(url);
        if (response.data.status === 'ok') {
          setArticles(response.data.articles);
        } else {
          setError('Failed to fetch news');
        }
      } catch (err) {
        setError('Error fetching news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open the link');
      console.error('Error opening URL:', err);
    });
  };

  const handleSearch = () => {
    setCategory('');
    // Call fetchNews directly here
    fetchNews();
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    let url = '';
    if (category) {
      url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
    } else if (searchTerm) {
      url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?category=${defaultCategories.join(',')}&apiKey=e8893f20c1f449bd8d3e8cdd6dad68bc`;
    }

    try {
      const response = await axios.get(url);
      if (response.data.status === 'ok') {
        setArticles(response.data.articles);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      setError('Error fetching news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for news"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch} // Trigger search on Enter
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <View style={styles.categoryContainer}>
        {defaultCategories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.categoryButton} onPress={() => setCategory(cat)}>
            <Text style={styles.categoryButtonText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {articles.map((item) => (
        <View key={item.url} style={styles.articleContainer}>
          <TouchableOpacity onPress={() => handlePress(item.url)}>
            {item.urlToImage ? (
              <Image source={{ uri: item.urlToImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center', // Center content horizontally
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
    height: 40,
    borderRadius: 10,
    color: 'black',
  },
  categoryContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: '#4CAF50', // Green background
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold',
  },
  articleContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#888',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});

export default NewsScreen;
