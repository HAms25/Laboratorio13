import AWS from 'aws-sdk'

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const db = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3();
const Table = 'contactos'

export {
    db,
    s3,
    Table
}