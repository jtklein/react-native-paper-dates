import * as React from 'react'
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput as TextInputNative,
} from 'react-native'
import { MD2Theme, Text, useTheme } from 'react-native-paper'

import {
  clockTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
} from './timeUtils'
import TimeInput from './TimeInput'
import AmPmSwitcher from './AmPmSwitcher'
import { useLatest } from '../utils'
import Color from 'color'

function TimeInputs({
  hours,
  minutes,
  seconds,
  onFocusInput,
  focused,
  inputType,
  onChange,
  is24Hour,
  inputFontSize,
}: {
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  seconds: number
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: (hoursMinutesAndFocused: {
    hours: number
    minutes: number
    seconds: number
    focused?: undefined | PossibleClockTypes
  }) => any
  is24Hour: boolean
  inputFontSize?: number
}) {
  const startInput = React.useRef<TextInputNative | null>(null)
  const middleInput = React.useRef<TextInputNative | null>(null)
  const endInput = React.useRef<TextInputNative | null>(null)
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height
  const theme = useTheme()

  const onSubmitStartInput = React.useCallback(() => {
    if (middleInput.current) {
      middleInput.current.focus()
    }
  }, [middleInput])

  const onSubmitMiddleInput = React.useCallback(() => {
    if (endInput.current) {
      endInput.current.focus()
    }
  }, [endInput])

  const onSubmitEndInput = React.useCallback(() => {
    // TODO: close modal and persist time
  }, [])

  const minutesRef = useLatest(minutes)
  const secondsRef = useLatest(seconds)
  const onChangeHours = React.useCallback(
    (newHours: number) => {
      onChange({
        hours: newHours,
        minutes: minutesRef.current,
        seconds: secondsRef.current,
        focused: clockTypes.hours,
      })
    },
    [onChange, minutesRef, secondsRef]
  )

  const renderSeparator = () => {
    return (
      <View
        style={[
          styles.hoursAndMinutesSeparator,
          // eslint-disable-next-line react-native/no-inline-styles
          { marginBottom: inputType === 'keyboard' ? 24 : 0 },
        ]}
      >
        <View style={styles.spaceDot} />
        <View
          style={[
            styles.dot,
            {
              backgroundColor: theme?.isV3
                ? theme.colors.onSurface
                : (theme as any as MD2Theme).colors.text,
            },
          ]}
        />
        <View style={styles.betweenDot} />
        <View
          style={[
            styles.dot,
            {
              backgroundColor: theme?.isV3
                ? theme.colors.onSurface
                : (theme as any as MD2Theme).colors.text,
            },
          ]}
        />
        <View style={styles.spaceDot} />
      </View>
    )
  }

  return (
    <View
      style={[
        styles.inputContainer,
        isLandscape && styles.inputContainerLandscape,
      ]}
    >
      <View style={styles.column}>
        <TimeInput
          ref={startInput}
          inputFontSize={inputFontSize}
          placeholder={'00'}
          value={toHourInputFormat(hours, is24Hour)}
          clockType={clockTypes.hours}
          pressed={focused === clockTypes.hours}
          onPress={onFocusInput}
          inputType={inputType}
          maxFontSizeMultiplier={1.2}
          selectionColor={
            theme.dark
              ? Color(theme.colors.primary).darken(0.2).hex()
              : theme.colors.primary
          }
          returnKeyType={'next'}
          onSubmitEditing={onSubmitStartInput}
          blurOnSubmit={false}
          onChanged={(newHoursFromInput) => {
            let newHours = toHourOutputFormat(
              newHoursFromInput,
              hours,
              is24Hour
            )
            if (newHoursFromInput > 24) {
              newHours = 24
            }
            onChange({
              hours: newHours,
              minutes,
              seconds,
            })
          }}
        />
        {inputType === 'keyboard' ? (
          <Text maxFontSizeMultiplier={1.5} variant="bodySmall">
            Hour
          </Text>
        ) : null}
      </View>
      {renderSeparator()}
      <View style={styles.column}>
        <TimeInput
          ref={middleInput}
          inputFontSize={inputFontSize}
          placeholder={'00'}
          value={minutes}
          clockType={clockTypes.minutes}
          pressed={focused === clockTypes.minutes}
          onPress={onFocusInput}
          inputType={inputType}
          maxFontSizeMultiplier={1.2}
          selectionColor={
            theme.dark
              ? Color(theme.colors.primary).darken(0.2).hex()
              : theme.colors.primary
          }
          onSubmitEditing={onSubmitMiddleInput}
          onChanged={(newMinutesFromInput) => {
            let newMinutes = newMinutesFromInput
            if (newMinutesFromInput > 59) {
              newMinutes = 59
            }
            onChange({
              hours,
              minutes: newMinutes,
              seconds,
            })
          }}
        />
        {inputType === 'keyboard' ? (
          <Text maxFontSizeMultiplier={1.5} variant="bodySmall">
            Minute
          </Text>
        ) : null}
      </View>
      {renderSeparator()}
      <View style={styles.column}>
        <TimeInput
          ref={endInput}
          inputFontSize={inputFontSize}
          placeholder={'00'}
          value={seconds}
          clockType={clockTypes.seconds}
          pressed={focused === clockTypes.seconds}
          onPress={onFocusInput}
          inputType={inputType}
          maxFontSizeMultiplier={1.2}
          selectionColor={
            theme.dark
              ? Color(theme.colors.primary).darken(0.2).hex()
              : theme.colors.primary
          }
          onSubmitEditing={onSubmitEndInput}
          onChanged={(newSecondsFromInput) => {
            let newSeconds = newSecondsFromInput
            if (newSecondsFromInput > 59) {
              newSeconds = 59
            }
            onChange({
              hours,
              minutes,
              seconds: newSeconds,
            })
          }}
        />
        {inputType === 'keyboard' ? (
          <Text maxFontSizeMultiplier={1.5} variant="bodySmall">
            Second
          </Text>
        ) : null}
      </View>
      {!is24Hour && (
        <>
          <View style={styles.spaceBetweenInputsAndSwitcher} />
          <AmPmSwitcher
            hours={hours}
            onChange={onChangeHours}
            inputType={inputType}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  spaceBetweenInputsAndSwitcher: { width: 12 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainerLandscape: {
    flex: 1,
  },
  hoursAndMinutesSeparator: {
    fontSize: 65,
    width: 24,
    alignItems: 'center',
  },
  spaceDot: {
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7 / 2,
  },
  betweenDot: {
    height: 12,
  },
})

export default React.memo(TimeInputs)
