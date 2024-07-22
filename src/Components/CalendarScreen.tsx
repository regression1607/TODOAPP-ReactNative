// src/screens/CalendarScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const CalendarScreen: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});

  // Fetch tasks for a specific day
  const fetchTasksForDate = async (date: string) => {
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('date', startOfDay)
      .lte('date', endOfDay);

    console.log('Fetched fetchTasksForDate :', data);

    if (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'There was a problem fetching the tasks.');
    } else {
      setTasks(data || []);
      
      const taskMessages = (data && data.length > 0)
        ? data.map((task: any) =>
            `- ${task.text}\nCreated At: ${new Date(task.createdat).toLocaleString()}\nDeadline: ${task.date ? new Date(task.date).toLocaleString() : 'None'}`
          ).join('\n\n')
        : 'No tasks for this date.';
      
      Alert.alert('Tasks for Selected Date', taskMessages);
    }
  };

  // Fetch tasks for a specific range of dates
  const fetchTasksForMonth = async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    console.log('Fetched data:', data);

    if (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'There was a problem fetching the tasks.');
    } else {
      updateMarkedDates(data || []);
    }
  };

  // Update markedDates based on tasks completion status
  const updateMarkedDates = (tasks: any[]) => {
    const updatedMarkedDates: any = {};

    tasks.forEach((task: any) => {
      const date = task.date.split('T')[0];
      const dotColor = task.completed ? 'green' : 'red';

      updatedMarkedDates[date] = {
        marked: true,
        dotColor: dotColor,
        activeOpacity: 0,
      };
    });

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!updatedMarkedDates[date]) {
        updatedMarkedDates[date] = {
          marked: true,
          dotColor: 'yellow',
          activeOpacity: 0,
        };
      }
    }

    setMarkedDates(updatedMarkedDates);
  };

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
    const endOfMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

    fetchTasksForMonth(startOfMonth, endOfMonth);
  }, []);

  const handleDayPress = async (day: any) => {
    const selectedDate = day.dateString;
    await fetchTasksForDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={'2023-01-01'}
        maxDate={'2025-12-31'}
        monthFormat={'MMM yyyy'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          arrowColor: '#00adf5',
          monthTextColor: '#00adf5',
          indicatorColor: '#00adf5',
          textMonthFontWeight: 'bold',
          textDayFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default CalendarScreen;
