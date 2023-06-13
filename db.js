import {db, Table, s3} from './db.config.js'
import axios from 'axios';

// Create or Update users
const createOrUpdate = async (data = {}, imageUrl) => {
    const params = {
        TableName: Table,
        Item: data
    }

    try {
        await db.put(params).promise();
    
        if (imageUrl) {
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: data.id + '.jpg',
            Body: response.data
          };
    
          await s3.upload(uploadParams).promise();
        }
    
        return { success: true };
      } catch (error) {
        console.error('Error creating or updating user:', error);
        return { success: false };
      }
}

// Read all users
const readAllUsers = async()=>{
    const params = {
        TableName: Table
    }

    try{
        const { Items = [] } = await db.scan(params).promise()
        return { success: true, data: Items }

    } catch(error){
        return { success: false, data: null }
    }

}

// Read Users by ID
const getUserById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
    try {
        const { Item = {} } =  await db.get(params).promise()
        return { success: true, data: Item }
    } catch (error) {
        return {  success: false, data: null}        
    }
}

// Delete User by ID
const deleteUserById = async(value, key = 'id' ) => { 
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
        
    try {
        await db.delete(params).promise()
        return {  success: true }

    } catch (error) {
        return{ success: false }
    }
}


export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById
}