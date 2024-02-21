import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = '845e816e9e9241a79c9231936241902';

   const getWeather = async () => { // async function funciona en torno a una accion
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&days=1&aqi=yes&alerts=no`);
      const data = await res.json();
        if (data.error) {
            setError(data.error.message);
        } else {
            setWeatherData(data);
        }   
    } catch (err) {
        setError('Error finding weather data');
    }
    };

  useEffect(() => {
    city ? getWeather() : setWeatherData(null);
  }, [city]);

  const renderBackgroundImage = () => {
    if (!weatherData) return require('./assets/img/default-background.jpg'); 
    const condition = weatherData.current.condition.text.toLowerCase();
    if (condition.includes('sunny')) return require('./assets/img/sunny-background.jpg');
    if (condition.includes('rain')) return require('./assets/img/rainy-background.jpg');
    if (condition.includes('cloudy')) return require('./assets/img/cloudy-background.jpg');
    return require('./assets/img/default-background.jpg'); 
  };

  return (
    <ImageBackground source={renderBackgroundImage()} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Weather App!</Text>
        <TextInput
          style={styles.textInput}
          placeholder='Enter city name'
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <TouchableOpacity style={styles.button} onPress={getWeather}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
        {error && <Text>{error}</Text>}
        {weatherData && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>City: {weatherData.location.name}</Text>
            <Text style={styles.dataText}>Country: {weatherData.location.country}</Text>
            <Text style={styles.dataText}>Temperature: {weatherData.current.temp_c}</Text>
            <Text style={styles.dataText}>Condition: {weatherData.current.condition.text}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#9AD0C2',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  dataText: {
    fontSize: 20,
    color: 'white',
  },
});
