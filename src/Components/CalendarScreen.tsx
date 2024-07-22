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
    // Format the date to match the format used in the database
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('date', startOfDay) // Greater than or equal to the start of the day
      .lte('date', endOfDay); // Less than or equal to the end of the day

    console.log('Fetched fetchTasksForDate :', data); // Debugging line

    if (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'There was a problem fetching the tasks.');
    } else {
      setTasks(data || []);
      
      // Show tasks in an alert
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
      .gte('date', startDate) // Greater than or equal to the start date
      .lte('date', endDate); // Less than or equal to the end date

    console.log('Fetched data:', data); // Debugging line

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
      const date = task.date.split('T')[0]; // Get the date part (YYYY-MM-DD)
      const dotColor = task.completed ? 'green' : 'red';

      if (updatedMarkedDates[date]) {
        // If a date already exists, ensure it's marked correctly
        updatedMarkedDates[date] = {
          ...updatedMarkedDates[date],
          dotColor: dotColor === 'green' ? 'green' : updatedMarkedDates[date].dotColor,
        };
      } else {
        updatedMarkedDates[date] = {
          marked: true,
          dotColor: dotColor,
          activeOpacity: 0,
        };
      }
    });

    // Handle dates with no tasks
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

    // Fetch tasks for the current month
    fetchTasksForMonth(startOfMonth, endOfMonth);
  }, []);

  const handleDayPress = async (day: any) => {
    const selectedDate = day.dateString;

    // Fetch tasks for the selected date
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
        markedDates={markedDates} // Use the updated markedDates
        onDayPress={handleDayPress}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 10,
  },
});

export default CalendarScreen;
