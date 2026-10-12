import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
import Subject from './models/Subject.js';
import DailyNote from './models/DailyNote.js';
import User from './models/User.js';
import AuthSession from './models/AuthSession.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iitm_study_tracker';

let isConnected = false;
let connectionError = null;
let connectionAttempt = null;

export function connectMongoDB() {
  if (isConnected) return true;
  if (connectionAttempt) return connectionAttempt;
  connectionAttempt = (async () => {
   try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

    isConnected = true;
    connectionError = null;
    console.log('🍃 Connected to MongoDB successfully.');

    // Auto-seed initial subjects if empty
    const subCount = await Subject.countDocuments();
    if (subCount === 0) {
      await Subject.insertMany([
        { id: 'sub_1', name: 'MAD 1 Project', icon: '💻', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700' },
        { id: 'sub_2', name: 'DBMS', icon: '🗄️', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600' },
        { id: 'sub_3', name: 'System Commands', icon: '⚙️', color: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800' }
      ]);
      console.log('🍃 Default subjects seeded in MongoDB');
    }

    // Auto-seed initial tasks if empty
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      await Task.insertMany([
        {
          id: '1',
          date: today,
          subject: 'MAD 1 Project',
          topic: 'Complete Flask routes and Jinja templates for Task Manager',
          durationHours: 1,
          durationMinutes: 30,
          durationSeconds: 0,
          priority: 'High',
          completed: true,
          completedAt: now,
          notes: 'Focus on CRUD operations and form validation'
        },
        {
          id: '2',
          date: today,
          subject: 'DBMS',
          topic: 'Normalization: 1NF, 2NF, 3NF & BCNF with examples',
          durationHours: 1,
          durationMinutes: 0,
          durationSeconds: 0,
          priority: 'High',
          completed: false,
          completedAt: null,
          notes: 'Solve assignment questions from Week 5'
        },
        {
          id: '3',
          date: today,
          subject: 'System Commands',
          topic: 'Shell scripting: loops, conditionals & file processing',
          durationHours: 0,
          durationMinutes: 45,
          durationSeconds: 0,
          priority: 'Medium',
          completed: false,
          completedAt: null,
          notes: 'Practice grep, awk, sed commands'
        },
        {
          id: '4',
          date: today,
          subject: 'DBMS',
          topic: 'SQL Joins and Subqueries practice problems',
          durationHours: 0,
          durationMinutes: 45,
          durationSeconds: 0,
          priority: 'Medium',
          completed: true,
          completedAt: now,
          notes: 'Completed 10 queries from practice set'
        }
      ]);
      console.log('🍃 Default study tasks seeded in MongoDB');
    }

    return true;
   } catch (err) {
    isConnected = false;
    connectionError = typeof err.code === 'string' ? err.code : err.name || 'UNKNOWN';
    console.warn(`🍃 MongoDB connection failed (${connectionError}).`);
    return false;
   } finally {
    connectionAttempt = null;
   }
  })();
  return connectionAttempt;
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getMongoStatus() {
  return {
    connected: isMongoConnected(),
    database: mongoose.connection?.name || 'iitm_study_tracker',
    readyState: mongoose.connection?.readyState || 0,
    errorCode: connectionError ? 'CONNECTION_FAILED' : null
  };
}

export { Task, Subject, DailyNote, User, AuthSession };

export const mongoReady = process.env.DATABASE_DRIVER === 'mongodb' ? connectMongoDB() : Promise.resolve(false);
mongoReady.catch(() => {});
