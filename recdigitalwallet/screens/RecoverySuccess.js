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

import {COLORS, SIZES, FONTS, icons, images} from '../constants';

const RecoverySuccess = ({navigation}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

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
            Welcome to
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
            success
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
          alignItems: 'center',
          justifyContent: 'center',
        }}>
      <Image
          source={images.checkImg}
          resizeMode="center"
          style={{
            width: 150,
            marginTop: 50,
            height: 150,
          }}
        />
        <Text style={{textAlign: 'center', marginTop: 30}}>
          You've successfully recovered your password with REC Digital Platform
        </Text>
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{marginHorizontal: SIZES.padding * 3, marginVertical: 10}}>
        <TouchableOpacity
          style={{
            height: 50,
            marginTop: 60,
            backgroundColor: COLORS.btnColor,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            AsyncStorage.removeItem('token');
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          }}>
          <Text style={{color: COLORS.white, ...FONTS.h3}}>Let's Go</Text>
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
          justifyContent: 'center', marginBottom: 30
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
          {renderButton()}
          {termsAndConditions()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default RecoverySuccess;
