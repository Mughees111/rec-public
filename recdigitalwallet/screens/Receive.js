import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import QRCode from 'react-native-qrcode-image';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';

const Receive = ({navigation, route}) => {
  const [wallet, setWallet] = React.useState(route.params.wallet);
  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: SIZES.padding * 2,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Wallet')}
            style={{
              height: 20,
              width: 20,
            }}>
            <Image
              source={icons.right}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 18}}>{wallet.description} wallet</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image
              source={icons.bell}
              style={{
                width: 30,
                height: 30,
              }}
            /> */}
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                flexDirection: 'row'
              }}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 5,
                  backgroundColor:
                    APPJSON.API_mode == 'Testnet' ? COLORS.red : COLORS.green,
                  borderRadius: 50,
                }}
              />
              <Text>{APPJSON.API_mode}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderBanner() {
    return (
      <View
        style={{
          backgroundColor: COLORS.primaryBlue,
          height: '100%',
          width: '100%',
          borderRadius: 25,
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginTop: 0, marginBottom: 10, fontSize: 15}}>
            {wallet.wallet_type} Wallet | QR
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 30,
            }}>
            <Image
              source={icons.info}
              style={{height: 20, width: 20, margin: 10, tintColor: COLORS.yellow}}></Image>
            <Text style={{fontSize: 10}}>
              {wallet.title} is {wallet.wallet_type} Based Blochchain wallet.
              Please send only {wallet.wallet_type} Tokens in this wallet.
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            backgroundColor: COLORS.white,
          }}>
          <Image
            style={{
              height: 70,
              width: 70,
              position: 'absolute',
              zIndex: 10,
              borderWidth: 3,
              borderColor: COLORS.black,
              borderRadius: 50,
            }}
            source={wallet.icon}
          />
          <QRCode
            value={wallet.wallet_address}
            size={250}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
          {/* <Image style={{height: 250, width: 250}} source={images.QRImage} /> */}
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
          }}>
          <Text style={{color: COLORS.white, fontSize: 14}}>
            {wallet.title} Wallet Address
          </Text>
          <View
            style={{
              marginVertical: 20,
              borderRadius: 10,
              backgroundColor: COLORS.primary,
              padding: 20,
              minWidth: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text  onPress={() => {
              Clipboard.setString(wallet.wallet_address);
              Toast.show('wallet address copied');
              }}>
              {wallet.wallet_address}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log(wallet);
              Clipboard.setString(wallet.wallet_address);
              Toast.show('wallet address copied');
            }}
            style={{
              backgroundColor: '#05446f',
              padding: 15,
              marginTop: 0,
              width: 220,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}>
            <Text style={{color: COLORS.white}}>Copy Wallet Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderPromos() {
    return (
      <View>
        {renderHeader()}
        {renderBanner()}
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primary}}>
      {renderPromos()}
    </SafeAreaView>
  );
};

export default Receive;
