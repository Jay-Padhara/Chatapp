import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import fireStore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      console.log('Backpress is not allowed.');
    });
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      console.log('Please enter credentials.');
      Alert.alert('Please enter valid credentials.');
    } else {
      try {
        setVisible(true);

        const match = await fireStore()
          .collection('users')
          .where('email', '==', email)
          .get();

        if (match.size > 0) {
          console.log(match.docs[0].data());

          sendData(
            match.docs[0].data().email,
            match.docs[0].data().name,
            match.docs[0].data().password,
            match.docs[0].data().userid,
          );

          setEmail();
          setPassword();
          setVisible(false);
          navigation.navigate('Userlist');
        } else {
          setVisible(false);
          setEmail();
          setPassword();
          Alert.alert('User not found.');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlesign = () => {
    setEmail();
    setPassword();
    navigation.navigate('Signup');
  };

  const sendData = async (mail, name, pass, userid) => {
    try {
      await AsyncStorage.setItem('Name', name);
      await AsyncStorage.setItem('Email', mail);
      await AsyncStorage.setItem('Password', pass);
      await AsyncStorage.setItem('Userid', userid);
      console.log('User data seted.');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.login}> Login </Text>

      <View style={styles.textinput}>
        <TextInput
          placeholder="Enter your email..."
          style={styles.textin}
          keyboardType="email-address"
          value={email}
          placeholderTextColor="grey"
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          placeholder="Enter your password..."
          style={styles.textin}
          placeholderTextColor="grey"
          keyboardType="number-pad"
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.indi}>
          <ActivityIndicator size={40} color="red" />
        </View>
      </Modal>

      <TouchableOpacity style={styles.touchable} onPress={handleLogin}>
        <Text style={styles.touchlog}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.touchsign} onPress={handlesign}>
        <Text style={styles.sign}>Not registered? Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },

  login: {
    fontSize: 30,
    marginTop: 40,
    color: 'white',
  },

  textinput: {
    marginTop: 50,
  },

  indi: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textin: {
    width: Dimensions.get('screen').width / 1.3,
    height: 55,
    padding: 15,
    fontSize: 16,
    marginTop: 30,
    color: 'white',
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 2,
  },

  touchable: {
    width: Dimensions.get('screen').width / 1.3,
    marginTop: 30,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 20,
    borderWidth: 2,
  },

  touchlog: {
    color: 'white',
    fontSize: 16,
  },

  touchsign: {
    marginTop: 30,
  },

  sign: {
    fontSize: 16,
    color: 'white',
    borderBottomColor: 'blue',
    borderWidth: 2,
  },
});
