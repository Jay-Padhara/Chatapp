import {TouchableOpacity, Image} from 'react-native';
import React from 'react';

export default function Ctouchable({style, source, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={style} />
    </TouchableOpacity>
  );
}
