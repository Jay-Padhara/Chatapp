import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export default function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      console.log('Please enter credentials.');
      Alert.alert('Please enter valid credentials.');
    } else {
      const docid = uuid.v4();
      setVisible(true);

      await firestore()
        .collection('users')
        .doc(docid)
        .set({
          userid: docid,
          name: name,
          email: email,
          password: password,
          count: 0,
        })
        .then(() => {
          console.log('User Registered.');
          navigation.navigate('Login');
          setName();
          setEmail();
          setPassword();
          setVisible(false);
        })
        .catch(error => {
          setVisible(false);
          console.log(error);
        });
    }
  };

  const handlelog = () => {
    setName();
    setEmail();
    setPassword();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.login}> Signup </Text>

      <View style={styles.textinput}>
        <TextInput
          placeholder="Enter your name..."
          style={styles.textin}
          keyboardType="name-phone-pad"
          value={name}
          placeholderTextColor="grey"
          onChangeText={text => setName(text)}
        />

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
          keyboardType="number-pad"
          value={password}
          placeholderTextColor="grey"
          onChangeText={text => setPassword(text)}
        />
      </View>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.indi}>
          <ActivityIndicator size={40} color="red" />
        </View>
      </Modal>

      <TouchableOpacity style={styles.touchable} onPress={handleSignup}>
        <Text style={styles.touchlog}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.touchsign} onPress={handlelog}>
        <Text style={styles.sign}>Already registered? Login</Text>
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
    marginTop: 50,
    color: 'white',
  },

  textinput: {
    marginTop: 60,
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
    marginTop: 20,
    color: 'white',
    borderRadius: 20,
    fontSize: 16,
    borderColor: 'grey',
    borderWidth: 2,
  },

  touchable: {
    width: Dimensions.get('screen').width / 1.3,
    marginTop: 40,
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
    marginTop: 20,
  },

  sign: {
    fontSize: 16,
    color: 'white',
    borderBottomColor: 'blue',
    borderWidth: 2,
  },
});
