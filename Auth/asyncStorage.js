import {AsyncStorage,Alert} from 'react-native'

exports.saveData=async(TokenAndId)=>{
  AsyncStorage.setItem('Token',TokenAndId.token)
    .then(res=>{
      AsyncStorage.setItem('Id',TokenAndId.id)
        .then(res=>{
        })
    })
    .catch(err=>{
      console.log(err)
      Alert.alert('Data Not Sent')
    })
}

exports.sendTheme = async(theme)=>{
  AsyncStorage.setItem('Theme',theme)
    .then(res=>{
      // Alert.alert('theme has been set')
    })
    .catch(err=>{
      Alert.alert('Oops we are facing some problem')
    })
}

exports.receiveTheme = async()=>{
  try{
    const Theme =await AsyncStorage.getItem('Theme')
    if(Theme){
      console.log('theme '+Theme);
      return {Theme}
    }
    else{
      return {Theme:'LIGHT'}
    }
  }
  catch{
    return {Theme : 'LIGHT'}
  }
}

exports.receiveData=async()=>{
  try{
    const Token=await AsyncStorage.getItem('Token');
    const Id=await AsyncStorage.getItem('Id');

    // console.log(Token,Id)
    if(Token&&Id){

      return {Token:Token,Id:Id}
    }
    else {
    }
  }
  catch{
    Alert.alert('something went wrong')
  }
}

exports.removeItem = async()=>{
  try{
    await AsyncStorage.removeItem('Id');
    await AsyncStorage.removeItem('Token');
    Alert.alert('Deletion successful')
    return true;
  }
  catch(err){
    return false;
  }
}
