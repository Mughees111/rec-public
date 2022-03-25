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
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import axios from 'axios';
import APPJSON from '../app.json';

const TermsAndPolicies = ({navigation}) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [PageTitle, setPageTitle] = React.useState('Privacy Policies');
  const [isActive, setIsActive] = React.useState(true);
  const [routes] = React.useState([
    {key: 'first', title: 'Privacy policy'},
    {key: 'second', title: 'Terms'},
  ]);
  React.useEffect(() => {
    if (isActive) {
      check();
    }
    return () => {
      setIsActive(false);
    };
  }, []);

  const [policy_json, setPolicyJson] = React.useState({
    content: [],
    updated_at: 'loading...',
    created_at: '',
  });

  const [terms_json, setTermsJson] = React.useState({
    content: [],
    updated_at: 'loading...',
    created_at: '',
  });

  async function check() {
    await AsyncStorage.removeItem('termsAndPolicies');
    let termsAndPolicies = await AsyncStorage.getItem('termsAndPolicies');
    if (termsAndPolicies) {
      setPolicyJson(JSON.parse(termsAndPolicies).privacy_policy);
      setTermsJson(JSON.parse(termsAndPolicies).terms_conditions);
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
          response.data.terms_conditions != undefined &&
          response.data.terms_conditions
        ) {
          // navigation.navigate('Home');
          const string = JSON.stringify(response.data);
          AsyncStorage.setItem('termsAndPolicies', string);
          let termsAndPolicies = await AsyncStorage.getItem('termsAndPolicies');
          if (termsAndPolicies) {
            // const contentJson = JSON.parse(
            //   response.data.privacy_policy.content,
            // );

            const json = JSON.parse(termsAndPolicies).privacy_policy;
            json.content = json;
            json.updated_at = moment(new Date(json.updated_at)).format(
              'DD MMM, YYYY hh:mm',
            );
            setPolicyJson(json);

            const jsonTerms = JSON.parse(termsAndPolicies).terms_conditions;
            jsonTerms.content = jsonTerms;
            jsonTerms.updated_at = moment(
              new Date(jsonTerms.updated_at),
            ).format('DD MMM, YYYY hh:mm');
            setTermsJson(jsonTerms);
          }
        }
      })
      .catch(error => {
        console.log(error);
        // Toast.show(error.response.data);
      });
  }

  function renderTerms(data, param) {
    if (data['content'] == undefined) {
      return false;
    }
    // const keys = Object.keys(data);
    var contents = data['content']['contents'];
    var headings = data['content']['headings'];
    // console.log(data.Content);
    return (
      <View>
        {headings.map((heading, keyIndex) => {
          const keyHeadings = contents[keyIndex];
          return keyHeadings.map((thisHeadings, index) => {
            return (
              <View key={index + keyIndex}>
                {(() => {
                  if (index == 0) {
                    return (
                      <Text
                        key={index + keyIndex + 999 + param}
                        style={{
                          color: COLORS.white,
                          marginBottom: 2,
                          marginTop: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        {heading}
                      </Text>
                    );
                  }
                })()}
                <Text
                  key={heading + keyIndex + 111 + param}
                  style={{color: COLORS.white, marginBottom: 10, fontSize: 12}}>
                  {thisHeadings}
                </Text>
              </View>
            );
          });
        })}
      </View>
    );
  }
  const FirstRoute = () => (
    <SafeAreaView>
      <ScrollView>
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={{marginVertical: 20, color: '#949494', fontSize: 15}}>
            Last updated: {policy_json.updated_at}
          </Text>
          <View>{renderTerms(policy_json.content, 2)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const SecondRoute = () => (
    <SafeAreaView>
      <ScrollView>
        <View style={{flex: 1, marginTop: 10}}>
          <Text style={{marginVertical: 20, color: '#949494', fontSize: 15}}>
            Last updated: {terms_json.updated_at}
          </Text>
          <View>{renderTerms(terms_json.content, 1)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      activeColor={COLORS.white}
      inactiveColor="#949494"
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: COLORS.primaryBlue}}
    />
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
          paddingVertical: 25,
          paddingBottom: 20,
          paddingHorizontal: 30,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.right}
              style={{height: 20, width: 20, marginBottom: 20}}
            />
          </TouchableOpacity>
          <Text style={{marginLeft: 20, fontWeight: 'bold'}}>{PageTitle}</Text>
        </View>
        <TabView
          style={{borderRadius: 10}}
          navigationState={{index, routes}}
          indicatorStyle={{backgroundColor: COLORS.yellow}}
          renderScene={renderScene}
          onIndexChange={index => {
            if (!index) setPageTitle('Privacy Policies');
            else setPageTitle('Terms & Conditions');
            setIndex(index);
          }}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </SafeAreaView>
      <Text
        style={{
          backgroundColor: COLORS.primary,
          width: '100%',
          textAlign: 'center',
          padding: 15,
          fontSize: 10,
        }}>
        SECURE, INSTANT AND TRADE CONFIDENTLY
      </Text>
    </KeyboardAvoidingView>
  );
};

export default TermsAndPolicies;
