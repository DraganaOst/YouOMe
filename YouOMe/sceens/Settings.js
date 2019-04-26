import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Button} from 'react-native';
import * as styles from "../components/Styles";
import {Svg, Polyline, Line, G, Path, Circle, Polygon} from 'react-native-svg';

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
            pickedColor: "rgb(255, 0, 0)",
            color1: styles.mainColorLightGrey,
            color2: styles.mainColorGreen,
            color3: styles.mainColorBlue,
            color4: styles.mainColorGrey,
            color5: styles.mainColorOrange,
            selectedColorToChange: ""
        }
    }

    setColor = (color) => {
        this.setState({pickedColor: color});
        if(this.state.selectedColorToChange == "color1")
            this.setState({color1: color});
        else if(this.state.selectedColorToChange == "color2")
            this.setState({color2: color});
        else if(this.state.selectedColorToChange == "color3")
            this.setState({color3: color});
        else if(this.state.selectedColorToChange == "color4")
            this.setState({color4: color});
        else if(this.state.selectedColorToChange == "color5")
            this.setState({color5: color});
    }

    getColors = (interval) => {
        let colors = [];

        for(let i= 0; i<255; i+=interval){
            colors.push(`rgb(255, 0, ${i})`);
        }
        for(let i=255; i>0; i-=interval){
            colors.push(`rgb(${i}, 0, 255)`);
        }
        for(let i= 0; i<255; i+=interval){
            colors.push(`rgb(0, ${i}, 255)`);
        }
        for(let i=255; i>0; i-=interval){
            colors.push(`rgb(0, 255, ${i})`);
        }
        for(let i= 0; i<255; i+=interval){
            colors.push(`rgb(${i}, 255, 0)`);
        }
        for(let i=255; i>0; i-=interval){
            colors.push(`rgb(255, ${i}, 0)`);
        }
        return colors;
    }

    getColorWheel = (diameter, colors, donatWidth = diameter) => {
        let angle = 360 / colors.length;
        angle = (Math.PI * angle) / 180;
        let radius = diameter/2;
        let array = [];

        let point = {
            x: 0,
            y: radius
        }
        let centerPoint = {
            x: radius,
            y: radius
        }
        let rotatedPoint = {
            x: 0,
            y: 0       
        }
        if(donatWidth == diameter){
            for(let i=0; i<colors.length; i++){
                rotatedPoint.x = point.x * Math.cos(angle) + point.y * (-1) * Math.sin(angle) + centerPoint.x * (1-Math.cos(angle)) + centerPoint.y * Math.sin(angle);
                rotatedPoint.y = point.x * Math.sin(angle) + point.y * Math.cos(angle) + centerPoint.y * (1 - Math.cos(angle)) - centerPoint.x * Math.sin(angle);
                array.push(
                    <Polygon
                        key={i}
                        onPress={() => this.setColor(colors[i])}
                        points={`${point.x},${point.y} ${centerPoint.x},${centerPoint.y} ${rotatedPoint.x},${rotatedPoint.y}`}  //"40,5 70,80 25,95"
                        fill={colors[i]}
                    />
                );
                point.x = rotatedPoint.x;
                point.y = rotatedPoint.y;
            }
        }
        else{
            let point2 = {
                x: donatWidth,
                y: radius
            }
            let rotatedPoint2 = {
                x: 0,
                y: 0       
            }
            for(let i=0; i<colors.length; i++){
                rotatedPoint.x = point.x * Math.cos(angle) + point.y * (-1) * Math.sin(angle) + centerPoint.x * (1-Math.cos(angle)) + centerPoint.y * Math.sin(angle);
                rotatedPoint.y = point.x * Math.sin(angle) + point.y * Math.cos(angle) + centerPoint.y * (1 - Math.cos(angle)) - centerPoint.x * Math.sin(angle);
                rotatedPoint2.x = point2.x * Math.cos(angle) + point2.y * (-1) * Math.sin(angle) + centerPoint.x * (1-Math.cos(angle)) + centerPoint.y * Math.sin(angle);
                rotatedPoint2.y = point2.x * Math.sin(angle) + point2.y * Math.cos(angle) + centerPoint.y * (1 - Math.cos(angle)) - centerPoint.x * Math.sin(angle);
                array.push(
                    <Polygon
                        key={i}
                        onPress={() => this.setColor(colors[i])}
                        points={`${point.x},${point.y} ${point2.x},${point2.y} ${rotatedPoint2.x},${rotatedPoint2.y} ${rotatedPoint.x},${rotatedPoint.y}`} 
                        fill={colors[i]}
                    />
                );
                point.x = rotatedPoint.x;
                point.y = rotatedPoint.y;
                point2.x = rotatedPoint2.x;
                point2.y = rotatedPoint2.y;
            }
        }

        
        return array;
    }

    getObjectFromColor = (color) => {
        let object = {
            r: 0,
            g: 0,
            b: 0
        }

        let substring = color.substring(4, color.length-1);
        let array = substring.split(',');
        object.r = Number(array[0]);
        object.g = Number(array[1]);
        object.b = Number(array[2]);

        return object;
    }

    getColorScale = (color, numberOfShades) => {
        let array = [];

        let object = this.getObjectFromColor(color);
        let newColor = this.getObjectFromColor(color);
        let interval = 255 / (numberOfShades + 1);

        for(let i = 255 - interval; i> 0; i-=interval){
            let coeficient = (255 - i)/255;
            newColor.r = object.r * coeficient;
            newColor.g = object.g * coeficient;
            newColor.b = object.b * coeficient;

            array.push(
                <TouchableOpacity key={i + "Dark"} style={{flex: 1, backgroundColor: `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`}}></TouchableOpacity>
            );
        }

        array.push(
            <TouchableOpacity key={"main"} style={{flex: 1, backgroundColor: color}}></TouchableOpacity>
        );

        newColor.r = object.r;
        newColor.g = object.g;
        newColor.b = object.b;

        for(let i = numberOfShades; i>0; i--){
            let coeficient = 1/i;
            if(object.r != "255"){
                newColor.r = Number(newColor.r + (255 - newColor.r) * coeficient);
            }
            if(object.g != "255"){
                newColor.g = Number(newColor.g + (255 - newColor.g) * coeficient);
            }
            if(object.b != "255"){
                newColor.b = Number(newColor.b + (255 - newColor.b) * coeficient);
            }

            array.push(
                <TouchableOpacity key={i + "Light"} style={{flex: 1, backgroundColor: `rgb(${newColor.r.toString()}, ${newColor.g.toString()}, ${newColor.b.toString()})`}}></TouchableOpacity>
            );
        }

        return array;

    }

    render() {
        let colors = this.getColors(102);
        let colorWheel = this.getColorWheel(250, colors, 50);
        let colorScale = this.getColorScale(this.state.pickedColor, 4);
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
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'default' ? "white" : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'black', elevation: 5}}>
                            <View style={{flex: 1, backgroundColor: mainColorLightGrey, height: 50}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGreen, height: 50}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorBlue, height: 50}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGrey, height: 50}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorOrange, height: 50}}></View>
                        </View>
                        
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 15, marginHorizontal: 20, marginVertical: 10}}>Custom (tap on colors to change)</Text>
                        <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, paddingTop: 15}} onPress={() => this.setState({optionColor: "custom"})}>
                            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'custom' ? "white" : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white', elevation: 5}}>
                            <TouchableOpacity 
                                onPress={() => this.setState({selectedColorToChange: "color1", pickedColor: this.state.color1})} 
                                style={{flex: 1, backgroundColor: this.state.color1, height: 50, borderWidth: this.state.selectedColorToChange == "color1" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.setState({selectedColorToChange: "color2", pickedColor: this.state.color2})} 
                                style={{flex: 1, backgroundColor: this.state.color2, height: 50, borderWidth: this.state.selectedColorToChange == "color2" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.setState({selectedColorToChange: "color3", pickedColor: this.state.color3})} 
                                style={{flex: 1, backgroundColor: this.state.color3, height: 50, borderWidth: this.state.selectedColorToChange == "color3" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.setState({selectedColorToChange: "color4", pickedColor: this.state.color4})} 
                                style={{flex: 1, backgroundColor: this.state.color4, height: 50, borderWidth: this.state.selectedColorToChange == "color4" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.setState({selectedColorToChange: "color5", pickedColor: this.state.color5})} 
                                style={{flex: 1, backgroundColor: this.state.color5, height: 50, borderWidth: this.state.selectedColorToChange == "color5" ? 1 : 0}}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Svg style={{width: 250, height: 250, backgroundColor: this.state.pickedColor, borderRadius: 125, borderWidth: 70, borderColor: styles.mainColorGrey}}>
                        {colorWheel}
                    </Svg>
                    <View style={{backgroundColor: 'white',margin: 20, width: 100}}>
                        {this.getColorScale(this.state.pickedColor, 4)}
                    </View>
                </View>
            </View>
        );
    }
}