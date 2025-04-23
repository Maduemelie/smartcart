import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { Colors } from '../constants/Colors';

export function OperatingHours({ hours, onUpdate, editable = false }) {
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const today = new Date().getDay();
  const adjustedDay = today === 0 ? 6 : today - 1;

  const validateTime = (time) => {
    if (!time) return false;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (day, type, value) => {
    if (!onUpdate || !editable) return;

    // Format time input
    let formattedTime = value;
    if (value.length === 4 && !value.includes(':')) {
      formattedTime = value.slice(0, 2) + ':' + value.slice(2);
    }

    onUpdate({
      ...hours,
      [day]: {
        ...hours[day],
        [type]: formattedTime,
        isClosed: hours[day].isClosed || false,
      },
    });
  };

  const toggleClosed = (day) => {
    if (!onUpdate || !editable) return;

    onUpdate({
      ...hours,
      [day]: {
        ...hours[day],
        isClosed: !hours[day].isClosed,
      },
    });
  };

  return (
    <View style={styles.hoursContainer}>
      {days.map((day, index) => (
        <View
          key={day}
          style={[styles.hourRow, adjustedDay === index && styles.todayRow]}
        >
          <Text
            style={[styles.dayText, adjustedDay === index && styles.todayText]}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
          <View style={styles.timeContainer}>
            {editable ? (
              <>
                <Switch
                  value={!hours[day].isClosed}
                  onValueChange={() => toggleClosed(day)}
                  trackColor={{
                    false: Colors.error.main,
                    true: Colors.primary,
                  }}
                />
                {!hours[day].isClosed ? (
                  <>
                    <TextInput
                      style={[
                        styles.timeInput,
                        !validateTime(hours[day].open) && styles.invalidTime,
                        {
                          color:
                            adjustedDay === index
                              ? Colors.primary
                              : Colors.text.primary,
                        },
                      ]}
                      value={hours[day].open}
                      onChangeText={(text) =>
                        handleTimeChange(day, 'open', text)
                      }
                      placeholder="09:00"
                      keyboardType="numbers-and-punctuation"
                      maxLength={5}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        adjustedDay === index && styles.todayText,
                      ]}
                    >
                      -
                    </Text>
                    <TextInput
                      style={[
                        styles.timeInput,
                        !validateTime(hours[day].close) && styles.invalidTime,
                        {
                          color:
                            adjustedDay === index
                              ? Colors.primary
                              : Colors.text.primary,
                        },
                      ]}
                      value={hours[day].close}
                      onChangeText={(text) =>
                        handleTimeChange(day, 'close', text)
                      }
                      placeholder="21:00"
                      keyboardType="numbers-and-punctuation"
                      maxLength={5}
                    />
                  </>
                ) : (
                  <Text style={styles.closedText}>Closed</Text>
                )}
              </>
            ) : (
              <Text
                style={[
                  styles.timeText,
                  adjustedDay === index && styles.todayText,
                ]}
              >
                {hours[day].isClosed
                  ? 'Closed'
                  : `${hours[day].open} - ${hours[day].close}`}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hoursContainer: {
    width: '100%',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  todayRow: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dayText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  todayText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  timeInput: {
    fontSize: 16,
    padding: 4,
    minWidth: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
  invalidTime: {
    borderColor: Colors.error.main,
  },
  closedText: {
    fontSize: 16,
    color: Colors.error.main,
    fontStyle: 'italic',
  },
});
