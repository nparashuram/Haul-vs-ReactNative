import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

//Import:Start
//Import:End

export default class extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Container __ID__
          __RAND__
        </Text>
        {/*Child_Components:Start*/}
        {/*Child_Components:End*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});