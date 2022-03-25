import axios from 'axios';
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

import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import APPJSON from '../app.json';
import {Picker} from '@react-native-picker/picker';
import counrties from '../countries.json';

const SignUp = ({navigation}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [areas, setAreas] = React.useState([]);
  const [phone_no, setPhoneNo] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedCountryCode, selectCountryCode] = React.useState('+1');

  async function RegisterOTP(number, navigation) {
    console.log(number);
    setLoading(true);
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'registerOTP', number, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data.response != undefined && response.data.response) {
          setToken(response.data.token);
          navigation.navigate('SignUpOTPVerification', number);
        } else {
          Toast.show(response.data.message, Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        let resp = error.response.data;
        if (resp.message != undefined) {
          Toast.show(resp.message, Toast.LONG);
        } else {
          Toast.show('Could not sent OTP. Please try again.', Toast.LONG);
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
    storeData(JSON.stringify(userToken));
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

  function PageMessage() {
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
            Signup to
          </Text>
          <Text
            style={{
              marginLeft: 5,
              color: COLORS.yellow,
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            REC Wallet
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 5,
            color: COLORS.white,
            fontSize: 15,
          }}>
          Enter your phone number
        </Text>
      </View>
    );
  }

  function renderForm() {
    const dummy_countries = [];
    const dummy_arr = [];
    counrties.countries.map((country, index) => {
      if (dummy_countries.find(c => c.dial_code == country.dial_code)) {
        dummy_arr.push(country);
      } else {
        dummy_countries.push(country);
      }
    });
    const items = dummy_countries.map(country => {
      return (
        <Picker.Item
          label={country.flag + ' ' + country.code + ' ' + country.dial_code}
          value={country.dial_code}
          style={{backgroundColor: COLORS.black, color: COLORS.white}}
          key={country.dial_code}
        />
      );
    });
    return (
      <View
        style={{
          marginTop: SIZES.padding * 1,
          marginHorizontal: SIZES.padding * 3,
        }}>
        {/* Full Name */}
        <View style={{marginTop: SIZES.padding * 3}}>
          <Picker
            selectedValue={selectedCountryCode}
            style={{
              position: 'absolute',
              bottom: 10,
              zIndex: 9,
              width: 150,
              paddingHorizontal: 15,
              paddingVertical: 25,
            }}
            onValueChange={(itemValue, itemIndex) =>
              selectCountryCode(itemValue)
            }>
            {items}
          </Picker>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>Phone</Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              paddingLeft: 150,
              paddingVertical: 0,
              borderRadius: 10,
              height: 56,
              color: COLORS.white,
              ...FONTS.body3,
              backgroundColor: COLORS.inputBackground,
            }}
            keyboardType="numeric"
            onChangeText={Text => setPhoneNo(selectedCountryCode + Text)}
            selectionColor={COLORS.white}
          />
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{margin: SIZES.padding * 3}}>
        <TouchableOpacity
          style={{
            height: 50,
            marginTop: 80,
            backgroundColor: COLORS.btnColor,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>
            {loading ? 'Please wait...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleSubmit = async e => {
    e.preventDefault();
    await RegisterOTP(
      {
        phone_no,
        registeration: 1,
      },
      navigation,
    );
  };
  function termsAndConditions() {
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
            fontSize: 12,
          }}>
          By continuing, I confirm that I have read the
        </Text>
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            top: 1,
            bottom: 15,
          }}
          onPress={() => navigation.navigate('TermsAndPolicies')}>
          <Text
            style={{
              marginLeft: 4,
              color: COLORS.yellow,
              fontSize: 12,
            }}>
            Pivacy Policy
          </Text>
        </TouchableOpacity>
      </View>
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
          {PageMessage()}
          {renderForm()}
          {renderButton()}
          {termsAndConditions()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
