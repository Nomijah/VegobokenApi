import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) {
  throw Error("Connection string not found.");
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER
);

export const upsertBlob = async (file: string, name: string) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(name);
    console.log(
      `\nUploading to Azure storage as blob\n\tname: ${name}:\n\tURL: ${blockBlobClient.url}`
    );
    const response = await blockBlobClient.upload(file, file.length);
    console.log(blockBlobClient.url);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImageStream = async (blobName: string, dataStream: any) => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const response = await blockBlobClient.uploadStream(dataStream);
  return blockBlobClient.url;
};
