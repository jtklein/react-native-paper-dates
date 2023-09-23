import * as React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { clockTypes, PossibleClockTypes } from './timeUtils'

export default function AnimatedClockSwitcher({
  focused,
  hours,
  minutes,
  seconds,
}: {
  focused: PossibleClockTypes
  hours: any
  minutes: any
  seconds: any
}) {
  const hoursShown = focused === clockTypes.hours
  const animatedHoursShown = React.useRef<Animated.Value>(
    new Animated.Value(hoursShown ? 1 : 0)
  )
  React.useEffect(() => {
    Animated.timing(animatedHoursShown.current, {
      toValue: hoursShown ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [hoursShown])

  const minutesShown = focused === clockTypes.minutes
  const animatedMinutesShown = React.useRef<Animated.Value>(
    new Animated.Value(minutesShown ? 1 : 0)
  )
  React.useEffect(() => {
    Animated.timing(animatedMinutesShown.current, {
      toValue: minutesShown ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [minutesShown])

  const secondsShown = focused === clockTypes.seconds
  const animatedSecondsShown = React.useRef<Animated.Value>(
    new Animated.Value(secondsShown ? 1 : 0)
  )
  React.useEffect(() => {
    Animated.timing(animatedSecondsShown.current, {
      toValue: secondsShown ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [secondsShown])

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents={hoursShown ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedHoursShown.current,
            transform: [
              {
                scale: animatedHoursShown.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
      >
        {hours}
      </Animated.View>
      <Animated.View
        pointerEvents={minutesShown ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedMinutesShown.current,
            transform: [
              {
                scale: animatedMinutesShown.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
      >
        {minutes}
      </Animated.View>
      <Animated.View
        pointerEvents={secondsShown ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedSecondsShown.current,
            transform: [
              {
                scale: animatedSecondsShown.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
      >
        {seconds}
      </Animated.View>
    </View>
  )
}
