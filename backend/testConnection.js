import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testMongoDBConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('URI:', process.env.MONGODB_URI);
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    
    console.log('✅ MongoDB Atlas Connection Successful!');
    console.log('Database:', conn.connection.name);
    console.log('Host:', conn.connection.host);
    console.log('Ready State:', conn.connection.readyState);
    
    // Test a simple operation
    const testCollection = conn.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test document inserted successfully');
    
    // Clean up test document
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    console.log('\n🔧 Possible Solutions:');
    console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Ensure the cluster is running and accessible');
    console.log('4. Check network connectivity');
    
    process.exit(1);
  }
};

testMongoDBConnection();
