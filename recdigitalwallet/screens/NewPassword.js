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
import CheckBox from '@react-native-community/checkbox';
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';

import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import axios from 'axios';
import APPJSON from '../app.json';

const NewPassword = ({navigation, route}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [termsAndCondtionCheckBox, setTermsAndCondtionCheckBox] =
    React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [phone_no, setPhoneNo] = React.useState(route.params.phone_no);
  const [password, setPassword] = React.useState(null);
  const [password_confirmation, setConfirmationPassword] = React.useState(null);

  async function register(data, navigation) {
    setLoading(true);
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'setNewPassword', data, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data.response != undefined && response.data.response) {
          setToken(response.data.token);
          navigation.reset({
            index: 0,
            routes: [{name: 'RecoverySuccess'}],
          });
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
    } catch (e) {
      // saving error
    }
  };
  function setToken(userToken) {
    storeData(userToken);
  }
  const handleSubmit = async e => {
    e.preventDefault();
    if (!termsAndCondtionCheckBox) {
      Toast.show('Accept the agreement to continue.', Toast.LONG);
      return false;
    }
    let token = await AsyncStorage.getItem('token');
    await register(
      {
        password,
        password_confirmation,
        phone_no,
        token: JSON.parse(token),
      },
      navigation,
    );
  };

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => console.log('SignUp')}>
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
          Back To Login
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
            Password Recovery
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 5,
            color: COLORS.white,
            fontSize: 15,
          }}>
          Reset Your password
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
        {/* Password */}

        <View style={{marginTop: SIZES.padding * 1}}>
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
            onChangeText={Text => setPassword(Text)}
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
        <View
          style={{
            alignItems: 'flex-end',
            top: 1,
            bottom: 15,
          }}>
          {/* <Text>
            Password Strength:
            {() => {
              if (password != null) {
                return <PasswordStrengthMeterBar password={password} />;
              }
            }}
          </Text> */}
        </View>

        {/* Confirm Password */}

        <View style={{marginTop: SIZES.padding * 1}}>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>
            {' '}
            Cofirm Password
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
            placeholder="Password"
            onChangeText={Text => setConfirmationPassword(Text)}
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
        <View
          style={{
            alignItems: 'flex-end',
            top: 1,
            bottom: 15,
          }}>
          {/* <Text>Password: </Text> */}
        </View>
      </View>
    );
  }

  function renderCheckBox() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.padding * 3,
          marginTop: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CheckBox
          value={termsAndCondtionCheckBox}
          onValueChange={() =>
            setTermsAndCondtionCheckBox(!termsAndCondtionCheckBox)
          }
          style={{color: COLORS.yellow}}
        />
        <View style={{flexDirection: 'row'}}>
          <Text>I confirm that I have read the </Text>
          <TouchableOpacity onPress={() => navigation.navigation('TermsAndPolicies')}>
            <Text style={{color: COLORS.yellow}}> Privacy Policy </Text>
          </TouchableOpacity>
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
            backgroundColor: COLORS.btnColor,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>
            {loading ? 'Please wait...' : 'Next'}
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
          {PageMessage()}
          {renderForm()}
          {renderCheckBox()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default NewPassword;
