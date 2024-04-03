import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Image, View, StyleSheet} from 'react-native';

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      handleNav();
    }, 500);
  }, [handleNav]);

  const handleNav = useCallback(async () => {
    const userid = await AsyncStorage.getItem('Userid');
    if (userid) {
      navigation.navigate('Userlist');
    } else {
      navigation.navigate('Login');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/back.png')} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  img: {
    width: 70,
    height: 70,
  },
});
