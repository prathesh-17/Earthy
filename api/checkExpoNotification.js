import {AsyncStorage,Alert} from 'react-native'
import {registerForPushNotificationsAsync} from './notifications.js'

exports.checkExpo=async()=>{
     AsyncStorage.getItem('ExpoToken')
     .then((val)=>{
       if(val==null){
         registerForPushNotificationsAsync()
           .then(res=>{
             console.log('Token',res)
             AsyncStorage.setItem('ExpoToken',res).then(()=>{
               Alert.alert('Token Posted successfully')
               return ;
             })
           })
        }
      })
      return;
}

exports.firstLaunch=async()=>{
  AsyncStorage.getItem("alreadyaunched").then(value => {
            console.log('value',value)
            if(value == null){
                 AsyncStorage.setItem('alreadyLaunched', 'true');
                 return {first:true}
            }
            else{
              return {first:false}
            }
          }
        )
    }


exports.getExpo=()=>{
  AsyncStorage.getItem('ExpoToken').then(value=>{
    return value
  })
}
