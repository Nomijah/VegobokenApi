import express from "express";
import { recipeCreateSchema } from "./../types/requestTypes/recipeCreate";
import { ResponseBody } from "types/responseTypes/responseBody";
import { addToBucket } from "./../services/s3service";
import { PutObjectAclCommandOutput } from "@aws-sdk/client-s3";
import { createRecipe } from "./../db/recipes";
import { ImageMetadata } from "types/dbTypes/imageMetadata";

const baseUrl = process.env.AWS_ENDPOINT_URL_S3;
const bucketName = process.env.BUCKET_NAME;

export const addRecipe = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: true,
      statusCode: 400,
      errorMessages: [],
    };

    console.log("addRecipe Called");

    const validatedRecipe = recipeCreateSchema.safeParse(req.body);
    if (!validatedRecipe.success) {
      console.error(validatedRecipe.error);
      resBody.isSuccessful = false;
      validatedRecipe.error.issues.map((issue) => {
        resBody.errorMessages.push(issue.message);
      });
      return res.status(400).json(resBody);
    }

    var fileName: string;

    var s3Response: PutObjectAclCommandOutput;
    var metadata: ImageMetadata = {
      fileName: "",
      fileType: "",
      imageUrl: "",
      caption: "",
    };

    if (validatedRecipe.data.image) {
      fileName = `${new Date().toISOString()}_${
        validatedRecipe.data.image.fileName
      }`;
      const bucketParams = {
        fileName: fileName,
        image: validatedRecipe.data.image.base64,
        contentType: validatedRecipe.data.image.fileType,
      };
      s3Response = await addToBucket(bucketParams);

      if (s3Response.$metadata.httpStatusCode !== 200) {
        console.log("image missing");
        resBody.errorMessages.push("Image upload failed.");
      } else {
        metadata = {
          fileName: fileName,
          fileType: validatedRecipe.data.image.fileType,
          caption: validatedRecipe.data.image.caption,
          imageUrl: `${baseUrl}/${bucketName}/${fileName}`,
        };
      }
    }

    const dbResponse = createRecipe({
      ...validatedRecipe.data,
      imageMetadata: metadata,
      creatorId: req.identity._id,
    });
    if (!dbResponse) {
      resBody.isSuccessful = false;
      resBody.errorMessages.push("Error when uploading recipe to database.");
      return res.status(400).json(resBody);
    }

    resBody.statusCode = 201;
    return res.status(201).json(resBody);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
