import * as React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Image,
  useWindowDimensions,
  useColorScheme,
  StatusBar,
} from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {
  Button,
  Text,
  Provider as PaperProvider,
  useTheme,
  Paragraph,
  List,
  Divider,
  Chip,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper'
import {
  DatePickerModal,
  TimePickerModal,
  DatePickerInput,
  registerTranslation,
  TranslationsType,
  ar,
  ca,
  de,
  en,
  enGB,
  es,
  fr,
  he,
  hi,
  it,
  ko,
  nl,
  pl,
  pt,
  tr,
  zh,
  zhTW,
  cs,
  el,
  ru,
} from 'react-native-paper-dates'
import { useCallback, useState } from 'react'

const locales: [string, TranslationsType][] = [
  ['ar', ar],
  ['ca', ca],
  ['de', de],
  ['en', en],
  ['en-GB', enGB],
  ['es', es],
  ['fr', fr],
  ['he', he],
  ['hi', hi],
  ['it', it],
  ['ko', ko],
  ['nl', nl],
  ['pl', pl],
  ['pt', pt],
  ['tr', tr],
  ['zh', zh],
  ['zh-TW', zhTW],
  ['cs', cs],
  ['el', el],
  ['ru', ru],
]

locales.forEach((locale) => {
  registerTranslation(locale[0], locale[1])
})

function App() {
  /** Hooks. */
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  /** State variables. */
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dates, setDates] = useState<Date[] | undefined>()
  const [range, setRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
  }>({ startDate: undefined, endDate: undefined })
  const [time, setTime] = useState<{
    hours: number | undefined
    minutes: number | undefined
    seconds: number | undefined
  }>({ hours: undefined, minutes: undefined, seconds: undefined })
  const [locale, setLocale] = useState('en-GB')
  const [timeOpen, setTimeOpen] = useState(false)
  const [rangeOpen, setRangeOpen] = useState(false)
  const [singleOpen, setSingleOpen] = useState(false)
  const [multiOpen, setMultiOpen] = useState(false)

  /** Constants. */
  const maxFontSizeMultiplier = 1.5
  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [locale]
  )
  const timeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    [locale]
  )

  const pastDate = new Date(new Date().setDate(new Date().getDate() - 5))
  const futureDate = new Date(new Date().setDate(new Date().getDate() + 5))

  let timeDate = new Date()
  time.hours !== undefined && timeDate.setHours(time.hours)
  time.minutes !== undefined && timeDate.setMinutes(time.minutes)
  time.seconds !== undefined && timeDate.setSeconds(time.seconds)

  /** Callbacks. */
  const onConfirmTime = useCallback(
    ({ hours, minutes, seconds }: any) => {
      setTimeOpen(false)
      setTime({ hours, minutes, seconds })
    },
    [setTimeOpen, setTime]
  )
  const onDismissTime = useCallback(() => {
    setTimeOpen(false)
  }, [setTimeOpen])

  const onChangeSingle = useCallback(
    (params: any) => {
      setSingleOpen(false)
      setDate(params.date)
    },
    [setSingleOpen, setDate]
  )
  const onDismissSingle = useCallback(() => {
    setSingleOpen(false)
  }, [setSingleOpen])

  const onChangeMulti = useCallback((params: any) => {
    setMultiOpen(false)
    setDates(params.dates)
  }, [])
  const onDismissMulti = useCallback(() => {
    setMultiOpen(false)
  }, [])

  const onChangeRange = useCallback(
    ({ startDate, endDate }: any) => {
      setRangeOpen(false)
      setRange({ startDate, endDate })
    },
    [setRangeOpen, setRange]
  )
  const onDismissRange = useCallback(() => {
    setRangeOpen(false)
  }, [setRangeOpen])

  const dimensions = useWindowDimensions()
  const isLarge = dimensions.width > 600

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
        translucent={true}
      />
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={[
          styles.contentContainer,
          styles.paddingSixteen,
          { marginTop: insets.top },
        ]}
      >
        <View style={isLarge && styles.surface}>
          <Divider style={styles.marginVerticalEight} />
          <Text
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            style={[styles.marginVerticalEight, styles.bold]}
          >
            Locale
          </Text>
          <View style={styles.chipContainer}>
            {locales.map(([option]) => {
              return (
                <Chip
                  compact
                  key={option}
                  selected={locale === option}
                  onPress={() => setLocale(option)}
                  style={styles.chip}
                >
                  {option}
                </Chip>
              )
            })}
          </View>
          <Divider style={styles.marginTopSixteen} />
          <List.Section>
            <View style={[styles.row, styles.marginVerticalEight]}>
              <View style={styles.section}>
                <Text
                  maxFontSizeMultiplier={maxFontSizeMultiplier}
                  style={styles.bold}
                >
                  Time Picker
                </Text>
                <Text
                  maxFontSizeMultiplier={maxFontSizeMultiplier}
                  variant="bodySmall"
                >
                  {time &&
                  time.hours !== undefined &&
                  time.minutes !== undefined &&
                  time.seconds !== undefined
                    ? timeFormatter.format(timeDate)
                    : 'No time selected.'}
                </Text>
              </View>
              <Button
                onPress={() => setTimeOpen(true)}
                uppercase={false}
                mode="contained-tonal"
              >
                Pick time
              </Button>
            </View>
          </List.Section>
        </View>
      </ScrollView>
      <DatePickerModal
        locale={locale}
        mode="range"
        visible={rangeOpen}
        onDismiss={onDismissRange}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onChangeRange}
      />
      <DatePickerModal
        locale={locale}
        mode="single"
        visible={singleOpen}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onChangeSingle}
        validRange={{
          startDate: pastDate,
          disabledDates: [futureDate],
        }}
      />
      <DatePickerModal
        locale={locale}
        mode="multiple"
        visible={multiOpen}
        onDismiss={onDismissMulti}
        dates={dates}
        validRange={{ startDate: new Date() }}
        onConfirm={onChangeMulti}
      />
      <TimePickerModal
        locale={locale}
        visible={timeOpen}
        onDismiss={onDismissTime}
        onConfirm={onConfirmTime}
        hours={time.hours}
        minutes={time.minutes}
        seconds={time.seconds}
      />
    </>
  )
}

export default function AppWithProviders() {
  const colorScheme = useColorScheme()
  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme}
      >
        <App />
      </PaperProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  column: {
    flexDirection: 'column',
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  logo: {
    height: 56,
    marginRight: 12,
    width: 56,
  },
  paddingSixteen: {
    padding: 16,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  marginBottomEight: {
    marginBottom: 8,
  },
  marginTopEight: {
    marginTop: 8,
  },
  marginTopSixteen: {
    marginTop: 16,
  },
  marginVerticalEight: {
    marginVertical: 8,
  },
  marginVerticalSixteen: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
  },
  section: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  gap: {
    gap: 12,
  },
  surface: {
    padding: 24,
    maxWidth: 550,
    alignSelf: 'center',
    borderRadius: 10,
  },
})
