import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Button} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class AddMoney extends React.Component {
    render(): React.ReactNode {
        return (
            <View>
                <Text>Give some money</Text>
            </View>
        );
    }
}