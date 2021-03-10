import React from 'react';
import {View, Text} from 'react-native';

export default class Chat extends React.Component{

    render() {
        let {name} = this.props.route.params

        // props user's name into title of chat message
        this.props.navigation.setOptions({ title: name })

        return(
            <View style={{flex: 1 }}>
                <Text>Welcome to chat</Text>
            </View>
        )
    }
}