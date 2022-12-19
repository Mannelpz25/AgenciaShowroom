/**
 * @fileoverview Componente CalendarPicker, es un calendario para
 * seleccionar fechas con límite de un mes atrás y una semana por
 * delante con respecto a la fecha actual.
 * @version v2.14.0
 * @author Luis Francisco Gil Pérez luis.gil@resser.com
 * @date 12/05/2021
 * @copyright Industrias Resser 2021
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Platform
} from 'react-native';
import { useGlobalState } from '@globalState/state';
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';

//Iconos importados
import LeftArrowIcon from '@icons/LeftArrowIcon';
import RightArrowIcon from '@icons/RightArrowIcon';
import Colors from '../constants/Colors';

//Dimensiones de la pantalla del dispositivo.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CalendarPicker = ({ dateServices, onChange, onPress, showCalendar }) => {
    //Constante que almacena los días del mes mostrado.
    const [calendar, setCalendar] = useState([]);
    //Constante que almacena el día seleccionado.
    const [value, setValue] = useState(dateServices);
    //Constante con el valor de opacidad para animación Fade.
    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
    //Constante con el valor de opacidad para animación Fade.
    const [fadeAnim2, setFadeAnim2] = useState(new Animated.Value(0));
    /**Constate para saber el estado del modo offline*/
    const [offline] = useGlobalState("offline");

    var months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ]

    var days = [
        "LUN",
        "MAR",
        "MIE",
        "JUE",
        "VIE",
        "SAB",
        "DOM"
    ]

    /**
    *Función para llenar un mes en el calendario con respecto al mes 
    *que se mostrara, se actualiza cada que cambia la constante
    *value.
    */
    useEffect(() => {

        const startDay = value.clone().startOf("month").startOf("week");
        const endDay = value.clone().endOf("month").endOf("week");
        const day = startDay.clone();
        const calendarTemp = [];

        while (day.isBefore(endDay, "day")) {
            calendarTemp.push(
                Array(7)
                    .fill(0)
                    .map(() => day.add(1, "day").clone())
            );
        }

        setCalendar(calendarTemp);

    }, [value]);

    /**
    *Función para animar vistas cambia el valor inicial 0 a 1 con 
    *una duración de 0.1s
    */
    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }
        ).start();

        Animated.timing(
            fadeAnim2,
            {
                toValue: 1,
                duration: 700,
                useNativeDriver: true
            }
        ).start();
    }, [showCalendar])

    /**
    *Función para animar vistas cambia el valor inicial 1 a 0 con 
    *una duración de 0.2s
    */
    const close = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }
        ).start(({ finished }) => { onPress(); fadeAnim2.setValue(0) });
    }

    /** 
    *Función para validar si el día indicado esta fuera de los límites.
    *@param {day} props Se le pasa por valor el día que validar.
    */
    function isLimit(day) {
        limitIzq = moment().subtract(1, "month");
        limitDer = moment().add(1, "week");

        if (day.isBefore(limitIzq, "day") || day.isAfter(limitDer, "day")) {
            return true;
        } else return false;
    }

    return (
        <Animated.View style={[
            styles.backgroundBlur,
            {
                opacity: fadeAnim,
                ...Platform.select({
                    ios: {
                        paddingBottom: moderateScale(100)
                    }
                })
            }
        ]}
        >
            <TouchableOpacity
                style={[
                    styles.backgroundBlur,
                    {
                        backgroundColor: 'rgba(0,0,0,0.16)',
                        height: windowHeight + moderateScale(100)
                        
                    }
                ]}

                onPress={() => close()}
            />
            <Animated.View style={[
                styles.card, { opacity: fadeAnim },
                {marginTop: offline ? 0 : getStatusBarHeight() + moderateScale(36)}
            ]}>
                <View style={styles.month}>
                    <TouchableOpacity
                        style={styles.arrow}
                        onPress={() => setValue(value.clone().subtract(1, "month"))}
                        disabled={isLimit(value.clone().startOf("month").subtract(1, "day"))}
                    >
                        <LeftArrowIcon
                            fill={
                                !isLimit(value.clone().startOf("month").subtract(1, "day")) ?
                                    '#000' : 'rgba(60,60,67,0.30)'}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: moderateScale(20),
                        marginHorizontal: moderateScale(10)
                    }}>
                        {months[value.format("M") - 1]} {value.format("YYYY")}
                    </Text>
                    <TouchableOpacity
                        style={styles.arrow}
                        onPress={() => setValue(value.clone().add(1, "month"))}
                        disabled={isLimit(value.clone().endOf("month").add(1, "day"))}
                    >
                        <RightArrowIcon
                            fill={
                                !isLimit(value.clone().endOf("month").add(1, "day")) ?
                                    '#000' : 'rgba(60,60,67,0.30)'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.daysHeader}>
                    {days.map((day) =>
                        <Text key={day} style={styles.titleH}>{day}</Text>
                    )}
                </View>
                <Animated.View style={{ opacity: fadeAnim2 }}>
                    {calendar.map(week => <View
                        key={"week" + week}
                        style={styles.week} >
                        {
                            week.map(day =>
                                value.isSame(day, "month") ?
                                    <TouchableOpacity
                                        key={"day" + day.format("D")}
                                        style={
                                            dateServices.isSame(day, "day") ?
                                                [
                                                    styles.backgroundDay,
                                                    {
                                                        backgroundColor: "rgba(0,122,255,0.12)",
                                                        opacity: fadeAnim
                                                    }
                                                ] :
                                                isLimit(day) ?
                                                    [
                                                        styles.backgroundDay,
                                                        { backgroundColor: Colors.grisButton }
                                                    ] :
                                                    styles.backgroundDay
                                        }
                                        onPress={() => {
                                            onChange(day);
                                            onPress();
                                        }}
                                        disabled={
                                            (dateServices.isSame(day, "day") || isLimit(day))
                                        }
                                    >
                                        <Text
                                            key={"dayOf" + day.format("D")}
                                            style={
                                                !dateServices.isSame(day, "day") ?
                                                    isLimit(day) ?
                                                        {
                                                            fontSize: moderateScale(18),
                                                            color: Colors.grisModalButton,
                                                        } : day.format("D/M/yyyy") == moment().format("D/M/yyyy") ?
                                                            {
                                                                fontWeight: 'bold',
                                                                fontSize: moderateScale(18),
                                                                color: '#007AFF'
                                                            } : { fontSize: moderateScale(18) } :
                                                    {
                                                        fontSize: moderateScale(18),
                                                        color: '#007AFF',
                                                    }
                                            }
                                        >{day.format("D")}</Text>
                                    </TouchableOpacity> :
                                    <View
                                        key={"dayLimit" + day.format("D")}
                                        style={styles.backgroundDay} />
                            )
                        }
                    </View>)}
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    backgroundBlur: {
        width: windowWidth,
        height: windowHeight - moderateScale(80),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        elevation: 6,
        width: windowWidth - moderateScale(30),
        height: 'auto',
        borderRadius: moderateScale(10),
        marginVertical: moderateScale(1),
        padding: moderateScale(5)
    },
    month: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrow: {
        padding: moderateScale(15)
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: moderateScale(10),
    },
    titleH: {
        color: 'rgba(60,60,67,0.30)',
        fontSize: moderateScale(14),
        marginVertical: moderateScale(15),
    },
    backgroundDay: {
        padding: moderateScale(10),
        marginVertical: moderateScale(2),
        marginHorizontal: moderateScale(1),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    week: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CalendarPicker;