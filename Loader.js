import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import ThemeContext from './themeCntxt';

const Box = ({ backgroundColor ='black', scale = 1,width = 20 }) => (
  <Animated.View
    style={[
      {
        width: width,
        height: width,
        borderRadius:width,
        backgroundColor,
        paddingLeft:10,
        transform: [{ scale }],
      },
    ]}
  />
);

const usePulse = (startDelay = 0) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2 }),
      Animated.timing(scale, { toValue: 0.6 }),
    ]).start(() => pulse());
  };

  useEffect(() => {
    const timeout = setTimeout(() => pulse(), startDelay);
    return () => clearTimeout(timeout);
  }, []);

  return scale;
};

const Loader = ({ count,col,wid }) => {
  const scale = usePulse();
  const scale1=usePulse(200);
  const scale2 = usePulse(400);
  const scale3 = usePulse(600); 

  // let colo;
  // if(col == 'black'){
  //   colo = 'rgb(255,215,0)'
  // }

  return (
    <View
      style={{ flex: 1,flexDirection:'row', alignItems: 'center',backgroundColor:(col?col:'rgb(255,215,0)') ,justifyContent: 'center' }}
    >
      <Box scale={scale}  width = {wid}   />
      <Box scale={scale1} width = {wid}  />
      <Box scale={scale2} width = {wid}  />
      <Box scale={scale3} width = {wid}  />
    </View>
  );
};

export default Loader;
