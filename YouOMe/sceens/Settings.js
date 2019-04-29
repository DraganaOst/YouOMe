import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, Button} from 'react-native';
import * as styles from "../components/Styles";
import {Svg, Polyline, Line, G, Path, Circle, Polygon} from 'react-native-svg';
import {Rgb} from '../components/Rgb';
import App from '../App';

const mainColorLightGrey = "rgb(229,229,229)" //"#E5E5E5";
const mainColorGreen = "rgb(138,203,136)" //'#8acb88';
const mainColorBlue = "rgb(100,131,129)" //'#648381';
const mainColorGrey = "rgb(87,87,97)" //'#575761';
const mainColorOrange = "rgb(255,191,70)" //'#ffbf46';

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
            selectedColorToChange: "",
            colorScale: [],
            dimension: 0,
            height: 0
        }
    }

    componentWillUnmount(){
        if(this.state.optionColor == 'default')
            this.setDefaultMainColors();
        else 
            this.setCustomMainColors();
    }

    componentDidUpdate(){
        if(this.state.optionColor == 'default')
            this.setDefaultMainColors();
        else 
            this.setCustomMainColors();
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
        this.getColorScale(color, 4);
    }

    setCustomMainColors = () => {
        styles.mainColorGreen = this.state.color2;
        styles.mainColorBlue = this.state.color3;
        styles.mainColorGrey = this.state.color4;
        styles.mainColorOrange = this.state.color5;
        styles.mainColorLightGrey = this.state.color1;

        let color2 = new Rgb(this.state.color2);
        let color3 = new Rgb(this.state.color3);
        let color4 = new Rgb(this.state.color4);
        let color5 = new Rgb(this.state.color5);
        styles.mainColorGreen2 = new Rgb( color2.r  + (255 - color2.r) * 0.15,  color2.g  + (255 - color2.g) * 0.15, color2.b  + (255 - color2.b) * 0.15).toString();
        styles.mainColorLightBlue = new Rgb(color3.r  + (255 - color3.r) * 0.15,  color3.g  + (255 - color3.g) * 0.15, color3.b  + (255 - color3.b) * 0.15).toString();
        styles.mainColorLightGrey2 = new Rgb(color4.r  + (255 - color4.r) * 0.15,  color4.g  + (255 - color4.g) * 0.15, color4.b  + (255 - color4.b) * 0.15).toString();
        styles.mainColorLightOrange = new Rgb(color5.r  + (255 - color5.r) * 0.15,  color5.g  + (255 - color5.g) * 0.15, color5.b  + (255 - color5.b) * 0.15).toString();
    }

    setDefaultMainColors = () => {
        styles.mainColorGreen = mainColorGreen;
        styles.mainColorBlue = mainColorBlue;
        styles.mainColorGrey = mainColorGrey;
        styles.mainColorOrange = mainColorOrange;
        styles.mainColorLightGrey = mainColorLightGrey;
        styles.mainColorGreen2 = "rgb(156,211,154)" // "#9CD39A";
        styles.mainColorLightBlue = "rgb(112,146,144)" //'#709290';
        styles.mainColorLightGrey2 = "rgb(102,102,113)" //"#666671";
        styles.mainColorLightOrange = "rgb(255,202,102)" //"#ffca66";
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

    /*getObjectFromColor = (color) => {
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
    }*/

    getColorScale = (color, numberOfShades) => {
        let array = [];

        let object = new Rgb(color);
        let newColor = new Rgb(color); //this.getObjectFromColor(color);
        let interval = 255 / (numberOfShades + 1);

        for(let i = numberOfShades; i>0; i--){
            let coeficient = 1/numberOfShades * i;
            if(object.r != "255"){
                newColor.r = Number(object.r + (255 - object.r) * coeficient);
            }
            if(object.g != "255"){
                newColor.g = Number(object.g + (255 - object.g) * coeficient);
            }
            if(object.b != "255"){
                newColor.b = Number(object.b + (255 - object.b) * coeficient);
            }

            let newColorString =  newColor.toString(); //`rgb(${newColor.r.toString()}, ${newColor.g.toString()}, ${newColor.b.toString()})`;

            array.push(
                <TouchableOpacity key={i + "Light"} onPress={() => this.setColor(newColorString)} style={{flex: 1, backgroundColor: newColorString}}></TouchableOpacity>
            );
        }

        array.push(
            <TouchableOpacity key={"main"} onPress={() => this.setColor(color)} style={{flex: 1, backgroundColor: color}}></TouchableOpacity>
        );

        newColor.r = object.r;
        newColor.g = object.g;
        newColor.b = object.b;

        for(let i = interval; i<255; i+=interval){
            let coeficient = (255 - i)/255;
            newColor.r = object.r * coeficient;
            newColor.g = object.g * coeficient;
            newColor.b = object.b * coeficient;

            let newColorString = newColor.toString();

            array.push(
                <TouchableOpacity key={i + "Dark"} onPress={() => this.setColor(newColorString)} style={{flex: 1, backgroundColor: newColorString}}></TouchableOpacity>
            );
        }

        return array;

    }

    onSelectColorToChange = (name, color) => {
        this.setState({selectedColorToChange: name, pickedColor: color});
    }

    render() {
        let colors = this.getColors(102);
        let colorWheel = this.getColorWheel(250, colors, 50);
        return (
            <View style={{flex: 1, backgroundColor: styles.mainColorGrey}}>
                <View>
                    <View>
                        <Text style={{color: 'white', fontSize: 18, marginHorizontal: 20, marginVertical: 10}}>Color pallete</Text>
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 15, marginHorizontal: 20, marginVertical: 10}}>Default</Text>
                        <TouchableOpacity style={{paddingHorizontal: 20, paddingBottom: 10}} onPress={() => {this.setState({optionColor: "default"}); this.setDefaultMainColors();}}>
                            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'default' ? "white" : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'black', elevation: 5}}>
                            <View style={{flex: 1, backgroundColor: mainColorLightGrey, height: 40}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGreen, height: 40}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorBlue, height: 40}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorGrey, height: 40}}></View>
                            <View style={{flex: 1, backgroundColor: mainColorOrange, height: 40}}></View>
                        </View>
                        
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 15, marginHorizontal: 20, marginVertical: 10}}>Custom (tap on colors to change)</Text>
                        <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, paddingTop: 15}} onPress={() => {this.setState({optionColor: "custom"}); this.setCustomMainColors();}}>
                            <View style={{height: 30, width: 30, borderRadius: 15, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: this.state.optionColor == 'custom' ? "white" : styles.mainColorLightGrey2}}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white', elevation: 5}}>
                            <TouchableOpacity 
                                onPress={() => this.onSelectColorToChange("color1", this.state.color1)} 
                                style={{flex: 1, backgroundColor: this.state.color1, height: 40, borderWidth: this.state.selectedColorToChange == "color1" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.onSelectColorToChange("color2", this.state.color2)} 
                                style={{flex: 1, backgroundColor: this.state.color2, height: 40, borderWidth: this.state.selectedColorToChange == "color2" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.onSelectColorToChange("color3", this.state.color3)} 
                                style={{flex: 1, backgroundColor: this.state.color3, height: 40, borderWidth: this.state.selectedColorToChange == "color3" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.onSelectColorToChange("color4", this.state.color4)} 
                                style={{flex: 1, backgroundColor: this.state.color4, height: 40, borderWidth: this.state.selectedColorToChange == "color4" ? 1 : 0}}
                            />
                            <TouchableOpacity 
                                onPress={() => this.onSelectColorToChange("color5", this.state.color5)} 
                                style={{flex: 1, backgroundColor: this.state.color5, height: 40, borderWidth: this.state.selectedColorToChange == "color5" ? 1 : 0}}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: 5}}
                    onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                            this.setState({height: height});
                    }}
                >
                    <View style={{flex: 5, height: this.state.height, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',}}
                        onLayout={(event) => {
                            let {x, y, width, height} = event.nativeEvent.layout;
                            if(height < width)
                                this.setState({dimension: height});
                            else
                                this.setState({dimension: width});
                        }}
                    >
                        <Svg style={{width: this.state.dimension, height: this.state.dimension, backgroundColor: this.state.pickedColor, borderRadius: this.state.dimension / 2, borderWidth: 70, borderColor: styles.mainColorGrey}}>
                            {this.getColorWheel(this.state.dimension, colors, 50)}
                        </Svg>
                    </View>
                    <View style={{backgroundColor: 'white',marginVertical: 20, marginLeft: 10, marginRight: 5, flex: 1}}>
                        {this.getColorScale(this.state.pickedColor, 4)}
                    </View>
                    <View style={{backgroundColor: 'white',marginVertical: 20, marginRight: 10, flex: 1}}>
                        {this.getColorScale("rgb(120,120,120)", 4)}
                    </View>
                </View>
            </View>
        );
    }
}