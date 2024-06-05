import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsRegion = process.env.AWS_REGION;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: awsRegion,
});

interface addToBucketParams {
  fileName: string;
  image: string;
  contentType: string;
}

export const addToBucket = async ({
  fileName,
  image,
  contentType,
}: addToBucketParams) => {
  const base64Data = Buffer.from(image, "base64");
  const commandParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: contentType,
  };

  const command = new PutObjectCommand(commandParams);

  const response = await s3.send(command);

  return response;
};
