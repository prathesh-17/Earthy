import React,{useState,useEffect,useContext} from 'react';
import { Button,Dimensions,TextInput,View,Text } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,MaterialCommunityIcons,FontAwesome5} from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar,TouchableRipple} from 'react-native-paper'
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import axios from 'axios'
import AuthContext from '../context'
import TokenContext from '../tokenCntxt'
const {width,height}=Dimensions.get('window')
import {receiveData} from '../Auth/asyncStorage'
import ThemeContext from '../themeCntxt'

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

let TokId;
const MainTabScreen = () => {
  const {themeState} = useContext(ThemeContext)
  const [id,setId]=useState('')
  const [token,setToken]=useState('')

  TokId=React.useContext(TokenContext)
  const [user,setUser]=useState({})
  useEffect(()=>{
    getData()
  },[])
  const getData=async()=>{
    TokId=await receiveData()

    if(TokId&&TokId.Token){
      axios.get(`https://pra-blog-app.herokuapp.com/users/me`,{
        headers:{
          authorization:`Bearer ${TokId.Token}`
        }
      })
        .then((res)=>{
          setUser({...res.data.user,upvotes:res.data.upvotes})
        })
    }
  }
  return(

    <Tab.Navigator initialRouteName="Home"  barStyle={{height:(themeState.h1==0?0:height/13),backgroundColor:themeState.pri,
      alignItems:'center',justifyContent:'center'
      }}>
      <Tab.Screen name="Home"
        options={{ tabBarLabel: null,  tabBarColor: themeState.pri, tabBarIcon: ({ focused,color }) => {
          let size;
          if(focused){ size=34; }else{size=26}
          return(<MaterialCommunityIcons name="home-circle" style={{elevation:5,marginRight:-8} }color={themeState.sec} size={size} />
        )},}}
      >{({navigation})=>(<HomeStackScreen navigation={navigation} themeState = {themeState} user={user}/>)}</Tab.Screen>

      <Tab.Screen name="Notifications"
        options={{  tabBarLabel:null,  tabBarColor: themeState.pri,  tabBarIcon: ({ focused,color }) => {
            let size;
            if(focused){ size=33; }else{size=26}
            return(<MaterialCommunityIcons name="blogger" style={{elevation:5,marginLeft:-15}} color={themeState.sec} size={size} />
          )},}}
      >{({navigation})=>(<DetailsStackScreen navigation={navigation} themeState = {themeState} user={user}/>)}</Tab.Screen>
      
      <Tab.Screen  name="Profile"  component={ProfileScreen}
       options={{tabBarLabel: null,  tabBarColor: themeState.pri,  tabBarIcon: ({ focused,color }) => {
           let size;
           if(focused){ size=34; }else{size=28}
            return(<MaterialIcons name="person" style={{elevation:5,marginLeft:-12}} color={themeState.sec} size={size} />)
          },  }}
      />
      
      <Tab.Screen  name="Explore"  component={ExploreScreen}
        options={{    tabBarLabel:null, tabBarColor: themeState.pri,  tabBarIcon: ({ focused,color }) => {
            let size;
            if(focused){ size=33; }else{size=26}
             return(<MaterialIcons name="my-location" style={{elevation:5,marginLeft:-12}} color={themeState.sec} size={size} />)
           },}}
      />
    </Tab.Navigator>
);
}
export default MainTabScreen;

const HomeStackScreen = ({navigation,user,themeState}) => (
<HomeStack.Navigator screenOptions={{
        headerStyle: {  backgroundColor: themeState.pri,height:themeState.h1  },
        headerTintColor: '#fff',
        headerTitleStyle: {  fontWeight: 'bold'  },
        headerTitle:()=>{return(
          null
        )},
    }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title:'Overview',
        headerLeft: () => {
          if(themeState.h1!=0){
            return(
            <TouchableRipple onPress={() => navigation.openDrawer()}>
              <Avatar.Image source={{uri:user.avatar}}
              size={48} style={{marginLeft:6,elevation:10}} /></TouchableRipple>)}
        }}} />
</HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation,user,themeState}) => (
<DetailsStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: themeState.pri,height:height/11,
        elevation:11
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        },

    }}>
        <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
        headerLeft: () => {return (
          <TouchableRipple onPress={() => navigation.openDrawer()}>
            <Avatar.Image source={{uri:user.avatar}}
            size={48} style={{marginLeft:6,elevation:10}} /></TouchableRipple>
        )},
        headerTitle:()=>{
          return (
              <Text style={{color:themeState.sec,fontWeight:'bold',fontSize:23}}>News</Text>
              
          )
        }

        }} />
</DetailsStack.Navigator>
);

