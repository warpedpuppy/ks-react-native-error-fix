import React from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from 'react-native-elements';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component{
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: ''
            },
            loggedInText: 'Please wait, you are getting logged in.'
        }

        const firebaseConfig = {
            apiKey: "AIzaSyCY4cMbkznojqhmg94p6eFFqHmFbUP-2f8",
            authDomain: "chat-app-11762.firebaseapp.com",
            projectId: "chat-app-11762",
            storageBucket: "chat-app-11762.appspot.com",
            messagingSenderId: "1094671831669",
            appId: "1:1094671831669:web:f1f6cacb335dbf23eb1e3c",
            measurementId: "G-MLDD6PXQRB"

        }

        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection('messages');
        firebase.firestore().collection('messages').doc('messages');
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                }
            });
        });
        this.setState({
            messages,
        })
    }

    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text || null,
            user: message.user,
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            // .append is built into GiftedChat component
            messages: GiftedChat.append(previousState.messages, messages),
        }),
        () => {
            this.addMessage();
        });
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

    componentDidMount() {
        // calls firebase auth to app.
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
            // update user with current active user data
            this.setState({
                user: {
                    _id: user.uid,
                    name: this.props.route.params.name,
                    avatar: 'https://placeimg.com/140/140/any'
                },
                messages: [],
                loggedInText: `Hi ${this.props.route.params.name}, welcome to the chat!`,

            });
            this.referenceChatMessages = firebase.firestore().collection('messages');
            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
        // this.renderSystemMessage();
    }

    // renderSystemMessage() {
    //     this.setState({
    //         messages: [
    //             {
    //                 _id: 1,
    //                 text: `Hi ${this.props.route.params.name}, welcome to the chat!`,
    //                 createdAt: new Date(),
    //             // grey-scaled message above all others, system message used for something like "A has entered chat!", etc.
    //                 system: true
    //             },
    //         ]
    //     })
    // }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }
    

    render() {
        // pulling props from Start.js as passed in onPress
        const {name, color} = this.props.route.params;

        // props user's name into title of chat message
        this.props.navigation.setOptions({ title: name })

        return(
            <View style={{flex: 1, backgroundColor: color }}>
                <Text style={styles.loggedInText}>{this.state.loggedInText}</Text>
                <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={this.state.user}
                />
                {/* old android keyboard covering fix */}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loggedInText: {
        textAlign: 'center',
        color: 'white',
        opacity: 50
    }
})
