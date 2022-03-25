import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {COLORS, FONTS, SIZES, icons, images} from '../constants';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

const Scan = ({navigation}) => {
  const [isActive, setIsActive] = React.useState(false);
  React.useEffect(() => {
    // setIsActive(true);
    return () => {
      setIsActive(false);
    };
  }, [navigation]);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.padding * 4,
          paddingHorizontal: SIZES.padding * 3,
        }}>
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Home')}>
          <Image
            source={icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: COLORS.white, ...FONTS.body3}}>
            Scan wallet QR
          </Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: COLORS.green,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => console.log('Info')}>
          <Image
            source={icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={{
            marginTop: '-55%',
            width: 200,
            height: 300,
          }}
        />
      </View>
    );
  }

  function renderPaymentMethods() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          padding: SIZES.padding * 3,
          borderTopLeftRadius: SIZES.radius,
          borderTopRightRadius: SIZES.radius,
          backgroundColor: COLORS.white,
        }}>
        <Text style={{...FONTS.h4}}>Another payment methods</Text>

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: SIZES.padding * 2,
            marginLeft: 40,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: SIZES.padding * 2,
            }}
            onPress={() => setIsActive(true)}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.lightGreen,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Image
                source={icons.scan}
                resizeMode="cover"
                style={{
                  height: 25,
                  width: 25,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
            <Text style={{marginLeft: SIZES.padding, ...FONTS.body4}}>
              Barcode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function onBarCodeRead(result) {
    if (isActive) {
      setIsActive(false);
      Clipboard.setString(result.data);
      let wallet_type = '';
      let wallet_icon = images.trxImage;
      if (result.data.length == 42 && result.data.substring(0, 2) == '0x') {
        wallet_type = 'ERC20';
        wallet_icon = images.ethImage;
      } else if (
        result.data.length == 34 &&
        result.data.substring(0, 1) === 'T'
      ) {
        wallet_type = 'TRC20';
      }
      if (wallet_type) {
        navigation.navigate('ScannedQR', {
          wallet_address: result.data,
          wallet_icon: wallet_icon,
          wallet_type,
        });
      } else {
        Toast.show('Scan only ERC20/TRC20 wallet address');
      }
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.transparent}}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{flex: 1}}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onBarCodeRead={onBarCodeRead}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'Camera is required for barcode scanning',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }}>
        {renderHeader()}
        {renderScanFocus()}
        {renderPaymentMethods()}
      </RNCamera>
    </View>
  );
};

export default Scan;
