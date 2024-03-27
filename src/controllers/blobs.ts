import { updateMetadata } from "db/recipes";
import express from "express";
import { uploadImageStream } from "services/blobService";
import { ResponseBody } from "types/responseTypes/responseBody";

export const imageUpload = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: false,
      statusCode: 400,
      errorMessages: [],
    };

    const { recipeId } = req.body;
    const { fileName, caption, fileType } = await extractMetadata(req.headers);

    const imageUrl = await uploadImageStream(fileName, req);
    const metadata = {
        fileName: fileName,
        fileType: fileType,
        caption: caption,
        imageUrl: imageUrl
    }

    await updateMetadata(metadata, recipeId);

    resBody = {
      ...resBody,
      isSuccessful: true,
      statusCode: 201,
      result: { message: "Image uploaded." },
    };
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

async function extractMetadata(headers: any) {
  const contentType = headers["content-type"];
  const fileType = contentType.split("/")[1];
  const contentDisposition = headers["content-disposition"];
  const caption = headers["x-image-caption"] || "No caption provided";
  const matches = /filename="([^"]+)/i.exec(contentDisposition);
  const fileName = matches?.[1] || `image-${Date.now}.${fileType}`;

  return { fileName, caption, fileType };
}
