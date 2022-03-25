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
import APPJSON from '../app.json';

const Bought = ({navigation, route}) => {
  const [hash, setHash] = React.useState(route.params.hash);
  const [action_type, setActionType] = React.useState(route.params.action_type);
  const [wallet, setWallet] = React.useState(route.params.wallet);
  const [to_address, setToAddress] = React.useState(route.params.to_address);
  const [amount, setAmount] = React.useState(route.params.amount);
  const [usd_amount, setUSDAmount] = React.useState(route.params.usd_amount);
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
            onPress={() => navigation.goBack({wallet})}
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
          <Text style={{fontSize: 18}}>Buy REC Assets</Text>
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
          <Text style={{marginTop: 0, fontSize: 15}}>Success</Text>
          <View style={{flexDirection: 'row', position: 'absolute'}}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 4,
              }}>
              _
            </Text>
            <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 30,
                  fontWeight: 'bold',
                  margin: 3,
                }}>
                _
              </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 3,
              }}>
              _
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 3,
              }}>
              _
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>
        <View
          style={{
            marginTop: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'dotted',
            borderWidth: 1,
            borderColor: '#ffffff40',
            height: 210,
            borderRadius: 200,
            width: 210,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'dotted',
              borderWidth: 1,
              borderColor: '#ffffff60',
              height: 180,
              borderRadius: 200,
              width: 180,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dotted',
                borderWidth: 1,
                borderColor: '#ffffff80',
                height: 150,
                borderRadius: 200,
                width: 150,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dotted',
                  borderWidth: 1,
                  borderColor: '#ffffff60',
                  height: 120,
                  borderRadius: 200,
                  width: 120,
                }}>
                <Image style={{height: 100, width: 100}} source={wallet.icon} />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
          }}>
          <Text style={{color: COLORS.white, fontSize: 14}}>
            Congratulations! Your {action_type == 1 ? 'Staking' : 'Buying'} is in progress
          </Text>
          <Text style={{marginTop: 5}}>{to_address}</Text>
          <Text style={{marginTop: 15, fontSize: 35, color: COLORS.white}}>
            {amount + ' REC'}
          </Text>
          <Text style={{marginTop: 5}}>={'$' + usd_amount}</Text>
        </View>
        <View
          style={{
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text style={{marginTop: 5, color: COLORS.white, marginBottom: 10}}>
            Transaction fees included
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.yellow,
              height: 50,
              width: '100%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('Wallet', wallet)}>
            <Text style={{color: COLORS.white}}>Done</Text>
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

export default Bought;
