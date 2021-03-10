import React from 'react';
import {View, Text} from 'react-native';

export default class Chat extends React.Component{

    render() {
        // pulling props from Start.js as passed in onPress
        let {name, color} = this.props.route.params

        // props user's name into title of chat message
        this.props.navigation.setOptions({ title: name })

        return(
            <View style={{flex: 1, backgroundColor: color }}>
                <Text>Welcome to chat</Text>
            </View>
        )
    }
}