import React from 'react';
import { Dimensions,Image,View, Text, Button, StyleSheet } from 'react-native';

const {width,height}=Dimensions.get('window')

const SupportScreen = () => {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/corona2.png')} style={{width:width/2,height:height/2,resizeMode:'contain'}}/>

        <Text style={{fontSize:15,color:'#999'}}>Aadi</Text>
        <Text style={{fontSize:15,color:'#999'}}>Prathesh</Text>
        <Text style={{fontSize:15,color:'#999'}}>Sibi</Text>
      </View>
    );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
