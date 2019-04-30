import React from 'react';
import {View, Modal, TouchableWithoutFeedback, TouchableOpacity, Text} from 'react-native';
import Firebase from './Firebase';

export default class PopupMenu extends React.Component {
    onPressMenu = (screen) => {
        this.props.navigation.navigate(screen); 
    };

    render() {
      return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.modalVisible}
        >
            {/*button is over full screen and trigers to close modal - except more menu which is another button without feedback*/}
            <TouchableOpacity onPressIn={this.props.setModalVisible} style={{flex: 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end'}}>
                    {/*more menu*/}
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={{width: 200, marginTop: 40, marginHorizontal: 10, backgroundColor: 'white', borderRadius: 5, elevation: 10}}>
                            {/*statistic*/}
                            <View style={{marginHorizontal: 10}}>
                                <TouchableOpacity onPress={() => this.onPressMenu('Statistic')} onPressOut={this.props.setModalVisible}>
                                    <Text style={{marginHorizontal: 20, paddingVertical: 10, fontSize: 18}}>Statistic</Text>
                                </TouchableOpacity>
                            </View>
                            {/*settings*/}
                            <View style={{borderColor: 'grey', borderTopWidth: 1, marginHorizontal: 10}}>
                                <TouchableOpacity onPress={() => this.onPressMenu('Settings')} onPressOut={this.props.setModalVisible}>
                                    <Text style={{marginHorizontal: 20, paddingVertical: 10, fontSize: 18}}>Settings</Text>
                                </TouchableOpacity>
                            </View>
                            {/*sign out*/}
                            <View style={{borderColor: 'grey', borderTopWidth: 2, marginHorizontal: 10}}>
                                <TouchableOpacity onPress={() => Firebase.auth.signOut().then(() => {})} onPressOut={this.props.setModalVisible}>
                                    <Text style={{marginHorizontal: 20, paddingVertical: 10, fontSize: 18}}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableOpacity>
        </Modal>
      )
    };
}

