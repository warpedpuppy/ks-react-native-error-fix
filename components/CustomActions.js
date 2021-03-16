import React from 'react'
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component{
    constructor() {
        super();
    }
    
    // for creating like location, image sharing

    onActionPress = () => {
        const options = ['Choose Photo from Library', 'Take Photo', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch(buttonIndex) {
                    case 0:
                        return this.pickImage();
                    case 1: 
                        return this.takePhoto();
                    case 2:
                        return this.getLocation();
                    default:
                }
            },
        );
    };

// permissions request

    pickImage = async () => {
        try {
            const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            if(status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    // picks only through users images, not other media, which version is better?
                    // mediaTypes: 'Images',
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));

                // cancelled is a value returned by launchImageLibraryAsync, which is true if user cancells process and doesn't pick file
                if(!result.cancelled) {
                    this.storeImage(result.uri);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    takePhoto = async () => {
        const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY && Permissions.CAMERA)

        if(status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                // mediaTypes: 'Images',
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch(error => console.log(error));

            if(!result.cancelled) {
                const imageUrl = await this.storeImage(result.uri);
                this.props.onSend({image: imageUrl, text: ''});
            }
        }
    }

    // image to BLOB
    storeImage = async(uri) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log('XHRonError', e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            })

            // create name for file
            const imageNameBefore = uri.split('/');
            const imageName = imageNameBefore[imageNameBefore.length - 1];

            const ref = firebase.storage().ref().child(`images/${imageName}`);
            // console.log('ref', ref);

            const snapshot = await ref.put(blob);
            console.log('snapshot', snapshot);
            blob.close();

            const imageDownload = await snapshot.ref.getDownloadURL();
            console.log(imageDownload);
            return imageDownload;

        }
        catch(e) {
            console.log(e);
        }
    }

    // permissions for location

    getLocation = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        
        if(status === 'granted') {
            let result = await Location.getCurrentPositionAsync({});

            const longitude = JSON.stringify(result.coords.longitude);
            const latitude = JSON.stringify(result.coords.latitude)

            if (result) {
                this.props.onSend({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    text: ''
                });
            }
        }
    }

    render() {
        return(
            <TouchableOpacity style={styles.container} onPress={this.onActionPress}>
                <View style={styles.wrapper, this.props.wrapperStyle}>
                    <Text style={styles.iconText}>+</Text>
                </View>
            </TouchableOpacity>
        )
    }

};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
});

CustomActions.contextType = {
    actionSheet: PropTypes.func
};


