import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import axios from 'axios';
import APPJSON from '../app.json';

const Login = ({navigation}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [email, setUserName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [policy_json, setPolicyJson] = React.useState({
    terms_conditions: '',
    privacy_policy: '',
  });
  React.useEffect(() => {
    check();
    getTermsAndConditions();
  }, []);
  async function check() {
    // await AsyncStorage.setItem('token', 'S7UWrWTIfLm3lfoRXTwvsHvHsOEkccWL1kbGAKhmdbOXHrB7MrsXXOzAosKZ');
    let token = await AsyncStorage.getItem('token');
    if (!token) {
      return false;
    }
    setLoading(true);
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'user', {token: token}, axiosConfig)
      .then(response => {
        setLoading(false);
        if (
          response.data != null &&
          response.data.id != undefined &&
          response.data.id
        ) {
          // navigation.navigate('Home');
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      })
      .catch(error => {
        Toast.show(error.response.data);
      });
  }

  async function getTermsAndConditions() {
    await AsyncStorage.removeItem('termsAndPolicies');
    let termsAndPolicies = await AsyncStorage.getItem('termsAndPolicies');
    if (termsAndPolicies) {
      setPolicyJson(JSON.parse(termsAndPolicies));
      return false;
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'termsAndPolicies', null, axiosConfig)
      .then(async response => {
        if (
          response.data != null &&
          response.data.content != undefined &&
          response.data.content
        ) {
          // navigation.navigate('Home');
          const string = JSON.stringify(response.data);
          AsyncStorage.setItem('termsAndPolicies', string);
        }
      })
      .catch(error => {
        console.log(error);
        // Toast.show(error.response.data);
      });
  }

  async function loginUser(credentials, navigation) {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    setLoading(true);
    axios
      .post(APPJSON.API_URL + 'signin', credentials, axiosConfig)
      .then(response => {
        setLoading(false);
        console.log(response.data);
        if (
          response.data != null &&
          response.data.response != undefined &&
          response.data.token
        ) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        } else if (
          response.data != null &&
          response.data.response != undefined &&
          response.data.response
        ) {
          // setToken(response.data.token);
          // navigation.navigate('Home');
          credentials.phone_no = response.data.phone_no;
          navigation.navigate('LoginOTPVerification', credentials);
        } else if (
          response.data != null &&
          response.data.response !== undefined &&
          response.data.response === false &&
          response.data.message === 'Phone no is required'
        ) {
          navigation.navigate('PhoneNoRequired', {email});
        }
      })
      .catch(error => {
        setLoading(false);
        let resp = error.response.data;
        if (resp.errors != undefined) {
          if (resp.errors.email[0]) {
            Toast.show(resp.errors.email[0], Toast.LONG);
          } else if (resp.errors.password) {
            Toast.show(resp.errors.password[0], Toast.LONG);
          }
        } else if (!resp.response) {
          Toast.show(resp.message, Toast.LONG);
        }
      });
  }
  const storeData = async value => {
    try {
      await AsyncStorage.setItem('token', value);
      console.log(value);
    } catch (e) {
      // saving error
    }
  };
  function setToken(userToken) {
    storeData(userToken);
  }

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => console.log('Login')}>
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.white,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 10,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.AppLogo}
          resizeMode="contain"
          style={{
            width: '40%',
          }}
        />
      </View>
    );
  }

  function loginMessage() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 7,
          marginHorizontal: SIZES.padding * 3,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: COLORS.white,
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            Login to
          </Text>
          <Text
            style={{
              marginLeft: 5,
              color: COLORS.yellow,
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            REC Digital Platform
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 5,
            color: COLORS.white,
            fontSize: 15,
          }}>
          Welcome back, You've been missed!
        </Text>
      </View>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 1,
          marginHorizontal: SIZES.padding * 3,
        }}>
        {/* Full Name */}
        <View style={{marginTop: SIZES.padding * 3}}>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>
            Email or Phone No
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              padding: 10,
              borderRadius: 10,
              height: 50,
              color: COLORS.white,
              ...FONTS.body3,
              backgroundColor: COLORS.inputBackground,
            }}
            onChangeText={Text => setUserName(Text)}
            placeholder="Email or Number"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>

        {/* Password */}

        <View style={{marginTop: SIZES.padding * 2}}>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>Password</Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              padding: 10,
              borderRadius: 10,
              height: 50,
              color: COLORS.white,
              ...FONTS.body3,
              backgroundColor: COLORS.inputBackground,
            }}
            placeholder="Password"
            onChangeText={_password => setPassword(_password)}
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              bottom: 15,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            top: 1,
            bottom: 15,
          }}
          onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={{color: COLORS.white}}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{margin: SIZES.padding * 3}}>
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: COLORS.btnColor,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>
            {loading ? 'Please wait...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleSubmit = async e => {
    e.preventDefault();
    await loginUser(
      {
        email,
        password,
      },
      navigation,
    );
  };
  function signupButton() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 12,
          }}>
          Don't have account?
        </Text>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            top: 1,
            bottom: 15,
          }}
          onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              marginLeft: 2,
              color: COLORS.yellow,
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            Signup
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  function renderAreaCodesModal() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{padding: SIZES.padding, flexDirection: 'row'}}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}>
          <Image
            source={{uri: item.flag}}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          />
          <Text style={{...FONTS.body4}}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
              }}>
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <LinearGradient
        colors={[COLORS.lime, COLORS.emerald]}
        style={{flex: 1, paddingLeft: 0, padddingRight: 0}}>
        <ScrollView>
          {renderLogo()}
          {loginMessage()}
          {renderForm()}
          {renderButton()}
          {signupButton()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default Login;
