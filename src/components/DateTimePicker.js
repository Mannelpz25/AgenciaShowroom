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
    Platform,
    FlatList,
    I18nManager
} from 'react-native';
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';

//Iconos importados
import Colors from '../constants/Colors';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

//Dimensiones de la pantalla del dispositivo.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DateTimePicker = ({ dateServices, onChange, onPress, showCalendar }) => {
    //Constante que almacena los días del mes mostrado.
    const [calendar, setCalendar] = useState([]);
    //Constante que almacena el día seleccionado.
    const [value, setValue] = useState(moment(new Date(), "L hh:mm"));
    //Constante con el valor de opacidad para animación Fade.
    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
    //Constante con el valor de opacidad para animación Fade.
    const [fadeAnim2, setFadeAnim2] = useState(new Animated.Value(0));

    const [time, setTime] = useState({
        minute: 0,
        hour: 0,
      });

    const [minuteInterval, setMinuteInterval] = useState(1);

    var franjaDia = [
        "AM",
        "PM",
    ]

    var days = [
        "lun",
        "mar",
        "mie",
        "jue",
        "vie",
        "sab",
        "dom"
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
        let limitIzq = moment().subtract(0, "day");
        let limitDer = moment().add(1, "day");

        if (day.isBefore(limitIzq, "day") || day.isAfter(limitDer, "day")) {
            return true;
        } else return false;
    }

    const TimeScroller = ({title, data, onChange}) => {
        const [itemSize, setItemSize] = useState(0);
        const scrollAnimatedValue = useRef(new Animated.Value(0)).current;
        const scrollListener = useRef(null);
        const active = useRef(0);
        data = ['', '', ...data, '', ''];
      
        useEffect(() => {
          scrollListener.current && clearInterval(scrollListener.current);
          scrollListener.current = scrollAnimatedValue.addListener(({value}) => (active.current = value));
      
          return () => {
            clearInterval(scrollListener.current);
          };
        }, [scrollAnimatedValue]);
        
      
        const changeItemWidth = ({nativeEvent}) => {
          const {width} = nativeEvent.layout;
          !itemSize && setItemSize(width / 5);
        };
      
        const renderItem = ({item, index}) => {
          const makeAnimated = (a, b, c) => {
            return {
              inputRange: [...data.map((_, i) => i * itemSize)],
              outputRange: [
                ...data.map((_, i) => {
                  const center = i + 2;
                  if (center === index) {
                    return a;
                  } else if (center + 1 === index || center - 1 === index) {
                    return b;
                  } else {
                    return c;
                  }
                }),
              ],
            };
          };
      
          return (
            <Animated.View
              style={[
                {
                  width: itemSize,
                  opacity: scrollAnimatedValue.interpolate(makeAnimated(1, 0.6, 0.3)),
                  transform: [
                    {
                      scale: scrollAnimatedValue.interpolate(makeAnimated(1.2, 0.9, 0.8)),
                    },
                    {
                      scaleX: I18nManager.isRTL ? -1 : 1,
                    },
                  ],
                },
              ]}>
              <Text style={{color: "black"}}>
                {item}
              </Text>
            </Animated.View>
          );
        };
      
        return (
          <View  onLayout={changeItemWidth}>
            <Text style={{color: "black"}}>{title}</Text>
            <AnimatedFlatList
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              vertical
              snapToInterval={itemSize}
              decelerationRate={'fast'}
              onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollAnimatedValue}}}], {
                useNativeDriver: true,
              })}
              data={I18nManager.isRTL ? data.reverse() : data}
              onMomentumScrollEnd={() => {
                const index = Math.round(active.current / itemSize);
                onChange(data[index + 2]);
              }}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              inverted={I18nManager.isRTL}
              contentContainerStyle={
                I18nManager.isRTL && {
                  transform: [
                    {
                      scaleY: -1,
                    },
                  ],
                }
              }
            />
          </View>
        );
      };

    return (
        <Animated.View style={[
            styles.backgroundBlur,
            {
                
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
                        height: windowHeight + moderateScale(100)
                        
                    }
                ]}

                onPress={() => close()}
            />
            <Animated.View style={[
                styles.card, { opacity: fadeAnim },
                {marginTop: getStatusBarHeight() + moderateScale(36)}
            ]}>
                        <TimeScroller
                            title={"Hora"}
                            data={Array.from({length: 24}, (x, i) => i)}
                            onChange={hour => setTime({...time, hour})}
                        />
                        <TimeScroller
                            title={"Minuto"}
                            data={Array.from({length: 60 / minuteInterval}, (x, i) => i * minuteInterval)}
                            onChange={minute => setTime({...time, minute})}
                        />         
                
                
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    backgroundBlur: {
        width: windowWidth,
        height: windowHeight - moderateScale(80),
        position: 'absolute',
        justifyContent: 'flex-start',
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
    spacer: {
        backgroundColor: '#A9A9A9',
        height: moderateScale(1),    
        width: '90%',
        marginTop: moderateScale(5),
        marginBottom: moderateScale(10)
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: moderateScale(10),
    },
    titleH: {
        color: 'rgba(60,60,67,0.30)',
        fontSize: moderateScale(16),
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

export default DateTimePicker;