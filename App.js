import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, ScrollView } from 'react-native';

export default App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [weatherImage, setWeatherImage] = useState(null);
  const API_KEY = '845e816e9e9241a79c9231936241902';

  const getWeather = async () => {
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=no`);
      const data = await res.json();
      if (res.status === 200) {
        setWeatherData(data);
        setError(null);
        updateWeatherImage(data.current.condition.code);
      } else {
        setError(`Error finding weather data!`);
      }
    } catch (err) {
      setError(`Error finding weather data!`);
    }
  };

  const updateWeatherImage = (weatherCode) => {
    // Map weather codes to respective images
    const weatherImages = {
      1000: require('./assets/sunny.png'),
      1003: require('./assets/partly_cloudy.png'), // Example for "Partly cloudy" condition
      // Add more weather codes and respective image paths as needed
    };
    // Set default image if no match found
    setWeatherImage(weatherImages[weatherCode] || require('./assets/default.png'));
  };

  useEffect(() => {
    city ? getWeather() : setWeatherData(null);
  }, [city]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Weather App!</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Enter city name'
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <TouchableOpacity style={styles.button} onPress={getWeather}>
        <Text>Get Weather</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {weatherData && (
        <ScrollView contentContainerStyle={[styles.weatherContainer, { backgroundImage: `url(${weatherImage})` }]}>
          <Text style={styles.weatherText}>City: {weatherData.location.name}</Text>
          <Text style={styles.weatherText}>Country: {weatherData.location.country}</Text>
          <Text style={styles.weatherText}>Temperature: {weatherData.current.temp_c}°C</Text>
          <Text style={styles.weatherText}>Condition: {weatherData.current.condition.text}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'transparent', // Make background transparent to see the image
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white', // Set text color to contrast with background image
  },
});
