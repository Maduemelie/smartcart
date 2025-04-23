import { View, Text, StyleSheet, TextInput } from 'react-native';
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

  const handleTimeChange = (day, type, value) => {
    if (!onUpdate || !editable) return;

    onUpdate({
      ...hours,
      [day]: {
        ...hours[day],
        [type]: value,
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
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      color:
                        adjustedDay === index
                          ? Colors.primary
                          : Colors.text.primary,
                    },
                  ]}
                  value={hours[day].open}
                  onChangeText={(text) => handleTimeChange(day, 'open', text)}
                  placeholder="09:00"
                  keyboardType="numbers-and-punctuation"
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
                    {
                      color:
                        adjustedDay === index
                          ? Colors.primary
                          : Colors.text.primary,
                    },
                  ]}
                  value={hours[day].close}
                  onChangeText={(text) => handleTimeChange(day, 'close', text)}
                  placeholder="21:00"
                  keyboardType="numbers-and-punctuation"
                />
              </>
            ) : (
              <Text
                style={[
                  styles.timeText,
                  adjustedDay === index && styles.todayText,
                ]}
              >
                {`${hours[day].open} - ${hours[day].close}`}
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
});
