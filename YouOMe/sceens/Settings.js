import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Button} from 'react-native';
import * as styles from "../components/Styles";

const mainColorLightGrey = "#E5E5E5";
const mainColorGreen = '#8acb88';
const mainColorBlue = '#648381';
const mainColorGrey = '#575761';
const mainColorOrange =  '#ffbf46';

export default class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            optionColor: "default",
            optionKeepLogIn: true
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: styles.mainColorGrey}}>
                <View>
                    <View>
                        <Text style={{color: 'white', fontSize: 18, marginHorizontal: 20, marginVertical: 10}}>Color pallete</Text>
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 15, marginHorizontal: 20, marginVertical: 10}}>Default</Text>
                        <TouchableOpacity style={{paddingHorizontal: 20, paddingBottom: 10}} onPress={() => this.setState({optionColor: "default"})}>
                            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'default' ? styles.mainColorOrange : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'black', elevation: 5}}>
                            <View style={{flex: 1, backgroundColor: mainColorLightGrey, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGreen, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorBlue, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGrey, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorOrange, height: 30}}></View>
                        </View>
                        
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 15, marginHorizontal: 20, marginVertical: 10}}>Custom (tap on colors to change)</Text>
                        <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, paddingTop: 15}} onPress={() => this.setState({optionColor: "custom"})}>
                            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'custom' ? styles.mainColorOrange : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'black', elevation: 5}}>
                            <View style={{flex: 1, backgroundColor: mainColorLightGrey, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGreen, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorBlue, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGrey, height: 30}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorOrange, height: 30}}></View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, marginVertical: 20, borderTopColor: 'white', borderTopWidth: 3}}>
                    <Text style={{color: 'white', fontSize: 18, marginHorizontal: 20}}>Keep me log in</Text>
                    <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, paddingTop: 15}} onPress={() => this.setState({optionKeepLogIn: !this.state.optionKeepLogIn})}>
                        <View style={{height: 30, width: 30, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: 24, width: 24, backgroundColor: this.state.optionKeepLogIn ? styles.mainColorOrange : styles.mainColorLightGrey2}}></View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}