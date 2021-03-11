import React from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component{
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }
    componentDidMount() {
        this.setState({
            messages: [
                // messages require id, creation data and user object, ptional items are image, video, etc.
                // reference "Message Object" section of GiftedChat repo 
                {
                    _id: 1,
                    text: 'Hello developer!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                // grey-scaled message above all others, system message used for something like "A has entered chat!", etc.
                {
                    _id: 2,
                    text: `Hi ${this.props.route.params.name}, welcome to the chat!`,
                    createdAt: new Date(),
                    system: true
                },
            ]
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            // .append is built into GiftedChat component
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props) {
        return(
            <Bubble
            // inherits props with spread operator
            {...props}
            wrapperStyle={{
                // right speech bubbles are for the sender
                right: {
                    backgroundColor: 'pink',
                }
            }}
            textStyle={{
                right: {
                    color: 'black',
                }
            }}
            />
        );
    }
    

    render() {
        // pulling props from Start.js as passed in onPress
        let {name, color} = this.props.route.params

        // props user's name into title of chat message
        this.props.navigation.setOptions({ title: name })

        return(
            <View style={{flex: 1, backgroundColor: color }}>
                <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1
                }}
                />
                {/* old android keyboard covering fix */}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
            </View>
        )
    }
}
