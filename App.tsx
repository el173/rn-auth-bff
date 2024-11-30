import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import queryString from 'query-string';
import axios from 'axios';

import { getDeepLink } from './libs/utilities';

const serverIp = '192.168.10.52';

const authUrl = `http://${serverIp}:8080/app-login?appName=app1`;

const App: React.FC = () => {
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url) {
        const parsed = queryString.parseUrl(url);
        const code = parsed.query.code;
        console.log('Token response:', code);
        if (code) {
          try {
            const response = await axios.post(`http://${serverIp}:8080/get-token`, { code });
            console.log('Token response:', response.data);
            Alert.alert('Token Received', `Token: ${JSON.stringify(response.data)}`);
          } catch (error) {
            console.error('Error fetching token:', error.message);
            Alert.alert('Error', 'Failed to fetch token');
          }
        } else {
          console.log('No code parameter in deep link');
        }
      }
    };

    // Add listener for deep links
    const subscription = Linking.addListener('url', handleDeepLink);

    // Clean up listener
    return () => {
      subscription.remove();
    };
  }, []);

  const openInAppBrowser = async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.openAuth(authUrl, getDeepLink(), {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          enableBarCollapsing: true,
        });
      } else {
        Alert.alert('Error', 'InAppBrowser is not supported on your device.');
      }
    } catch (error) {
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native App with Auth BFF</Text>
      <Button title="Login" onPress={openInAppBrowser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default App;
