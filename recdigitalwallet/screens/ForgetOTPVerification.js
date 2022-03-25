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
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import axios from 'axios';
import APPJSON from '../app.json';

const ForgetOTPVerification = ({navigation, route}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [phone_no, setPhoneNo] = React.useState(route.params.phone_no);
  const [OTP1, setOTP1] = React.useState(null);
  const [OTP2, setOTP2] = React.useState(null);
  const [OTP3, setOTP3] = React.useState(null);
  const [OTP4, setOTP4] = React.useState(null);
  const [activeRef1, setActiveRef1] = React.useState(null);
  const [activeRef2, setActiveRef2] = React.useState(null);
  const [activeRef3, setActiveRef3] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [resent, setResent] = React.useState(false);
  async function VerifyOTP(data, navigation) {
    setLoading(true);
    console.log(data);
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'verifyOTP', data, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data.response != undefined && response.data.response) {
          setToken(response.data.token);
          navigation.navigate('NewPassword', {
            token: response.data.token,
            phone_no: data.phone_no,
          });
        } else {
          setOTP1(null);
          setOTP2(null);
          setOTP3(null);
          setOTP4(null);
          Toast.show(response.data.message, Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        let resp = error.response.data;
        if (resp.message != undefined) {
          setOTP1(null);
          setOTP2(null);
          setOTP3(null);
          setOTP4(null);
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
  const handleSubmit = async () => {
    await VerifyOTP(
      {
        phone_no,
        verification_code: OTP1 + OTP2 + OTP3 + OTP4,
      },
      navigation,
    );
  };

  async function RegisterOTP(number, navigation) {
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
          Toast.show('New OTP sent', Toast.LONG);
          setToken(response.data.token);
          navigation.navigate('ForgetOTPVerification', number);
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
            Password Recovery!
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 5,
            color: COLORS.white,
            fontSize: 15,
          }}>
          Verify your identity
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
            An authentication code has been sent to
          </Text>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>{phone_no}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
            }}>
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                paddingHorizontal: 20,
                paddingVertical: 1,
                borderRadius: 10,
                height: 50,
                width: 50,
                borderBottomColor: COLORS.yellow,
                borderBottomWidth: 1,
                color: COLORS.white,
                ...FONTS.body3,
                backgroundColor: COLORS.inputBackground,
              }}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={Text => {
                setOTP1(Text);
                if (Text) {
                  activeRef1.focus();
                }
              }}
              value={OTP1}
              selectionColor={COLORS.white}
            />
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                paddingHorizontal: 20,
                paddingVertical: 1,
                borderRadius: 10,
                height: 50,
                width: 50,
                borderBottomColor: COLORS.yellow,
                borderBottomWidth: 1,
                color: COLORS.white,
                ...FONTS.body3,
                backgroundColor: COLORS.inputBackground,
              }}
              ref={input => {
                setActiveRef1(input);
              }}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={Text => {
                setOTP2(Text);
                if (Text) {
                  activeRef2.focus();
                }
              }}
              value={OTP2}
              selectionColor={COLORS.white}
            />
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                paddingHorizontal: 20,
                paddingVertical: 1,
                borderRadius: 10,
                height: 50,
                width: 50,
                borderBottomColor: COLORS.yellow,
                borderBottomWidth: 1,
                color: COLORS.white,
                ...FONTS.body3,
                backgroundColor: COLORS.inputBackground,
              }}
              ref={input => {
                setActiveRef2(input);
              }}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={Text => {
                setOTP3(Text);
                if (Text) {
                  if (Text) {
                    activeRef3.focus();
                  }
                }
              }}
              value={OTP3}
              selectionColor={COLORS.white}
            />
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                paddingHorizontal: 20,
                paddingVertical: 1,
                borderRadius: 10,
                height: 50,
                width: 50,
                borderBottomColor: COLORS.yellow,
                borderBottomWidth: 1,
                color: COLORS.white,
                ...FONTS.body3,
                backgroundColor: COLORS.inputBackground,
              }}
              ref={input => {
                setActiveRef3(input);
              }}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={Text => {
                setOTP4(Text);
                if (Text) {
                  Keyboard.dismiss();
                }
              }}
              value={OTP4}
              selectionColor={COLORS.white}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: COLORS.white, ...FONTS.body3}}>
              I didn't receive code.
            </Text>
            {(() => {
              if (!resent) {
                return (
                  <TouchableOpacity
                    onPress={async () => {
                      await RegisterOTP(
                        {
                          phone_no,
                        },
                        navigation,
                      );
                      setResent(true);
                    }}
                    disabled={loading}
                    style={{
                      flexDirection: 'row',
                      marginLeft: 5,
                      opacity: loading ? 0.7 : 1,
                      color: COLORS.white,
                    }}>
                    <Text>Resend Code</Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <Text style={{marginLeft: 5}}>
                    {loading && !resent ? 'Sending...' : 'New OTP sent'}
                  </Text>
                );
              }
            })()}
          </View>
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
            {loading ? 'Please wait...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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

export default ForgetOTPVerification;
