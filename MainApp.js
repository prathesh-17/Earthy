import {checkExpo,getExpo} from './api/checkExpoNotification'
import 'react-native-gesture-handler'
import React,{useEffect,useState,useLayoutEffect} from 'react';
import { StyleSheet, Text, View,Button,TextInput,Image,Dimensions } from 'react-native';
import RootStackScreen from './screens/RootStackScreen'
import { NavigationContainer,DarkTheme as NavigationDarkTheme,DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'
import { saveData,receiveData,removeItem,sendTheme,receiveTheme } from './Auth/asyncStorage';
import  DrawerContents  from './screens/DrawerContent';
import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import Loader from './Loader';
import DetailsScreen from './screens/DetailsScreen';
import TokenContext from './tokenCntxt';
import UpvoteScreen from './screens/UpvoteScreen';
import axios from 'axios';
import { Provider, DarkTheme as PaperDarkTheme,DefaultTheme as PaperDefaultTheme} from 'react-native-paper';
import ThemeContext from './themeCntxt'
const Drawer=createDrawerNavigator();
import AuthContext from './context'
import SearchScreen from './screens/SearchScreen'

const {width,height} = Dimensions.get('window')

export default function MainApp() {

  const [isDt,setDt] = useState(false)
  const initialState = {
    bg:'#ddd',
    txt:'#000',
    pst:'#fff',
    sec:'#000',
    pri:'rgb(255,215,0)',
    dr:'#fff',
    h1:height/11
  };

  const themeReducer = (state, action) => {
    switch( action.type ) {
      case 'LIGHT':
          sendTheme('LIGHT')
          return {...initialState}

      case 'DARK':
          sendTheme('DARK')
          return {
              ...state,
              bg:'#444',
              txt:'#fff',
              pst:'rgb(20,20,25)',
              pri:'#000',
              sec:'rgb(255,215,0)',
              dr:'#222',
            }  
      case 'HEIGHT':
          return {
            ...state,
            h1:0
          }
      case 'HIT':
        return {
          ...state,
          h1:height/11
        }
    }
  };
  
  const [themeState,themeDispatch] = React.useReducer(themeReducer,initialState)

  const [fl,setFl]=useState(false);
  const [userToken,setToken]=useState(null)
  const initialLoginState = {
     isLoading: true,
     userToken: null,
   };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading:false

        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,

        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'EXPO_TOKEN':
        return {
          ...prevState,
          isLoading: false,
        }
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(userToken) => {
      try {
        await saveData( userToken);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', token: userToken });
    },
    logOut: async() => {
      try {
        await removeItem();
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {

    },
    toggleTheme: () => {
      setDt( isDt => !isDt );
    }
  }), []);

  useEffect(() => {
    setTimeout(() => {
      receiveTheme().then((res)=>{
        // console.log(res)
        themeDispatch({type:res.Theme})
      })
    }, 500);
    setTimeout(async()=>{
      checkExpo().then(()=>{
        dispatch({type:'EXPO_TOKEN'})
      })
    },1000)
  }, [])
  useEffect(() => {
    setTimeout(async()=>{
      let userToken;
      userToken = null;
      try {
        userToken = await receiveData();
        // console.log('inside app useeffect '+userToken)
      } catch(e) {
        console.log(e);
      }

       if(userToken){
        dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
      }
      // console.log('useEffect userToken '+loginState.userToken)


    },1000);


  }, []);
  if( loginState.isLoading ) {
  
        return(
          <Loader/>
        )
  }
  else{
    if(loginState.userToken){
      const token=loginState.userToken
      // console.log("App else",token)
    }
    const main=()=>{
      return(
        <TokenContext.Provider value={loginState.userToken}>
            <Drawer.Navigator drawerStyle={{width:width/1.2}} drawerContent={props => <DrawerContents {...props} {...loginState.userToken}/>}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen name="SupportScreen" component={SupportScreen} />
              <Drawer.Screen name="UpvoteScreen" component={UpvoteScreen} />
              <Drawer.Screen name="SearchScreen" component={SearchScreen} />
            </Drawer.Navigator>
          </TokenContext.Provider>
        
      )
    }
    return (
      <ThemeContext.Provider value = {{themeState,themeDispatch}} >
        <AuthContext.Provider value={authContext}>
        <NavigationContainer >
          { loginState.userToken  !=null ? (
            main()
          )
        :
          <RootStackScreen/>
        }
        </NavigationContainer>
        </AuthContext.Provider>
      </ThemeContext.Provider>  
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  lottie: {
    width: 100,
    height: 100
  }
});
