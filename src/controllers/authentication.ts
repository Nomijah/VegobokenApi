import express from "express";
import { createUser, getUserByEmail, getUserByUsername } from "../db/users";
import {
  authentication,
  random,
  verificationHash,
} from "../helpers/cryptography";
import { UserLoginResponse } from "types/responseTypes/userLoginResponse";
import { checkPassword } from "../helpers/validation";
import { ResponseBody } from "types/responseTypes/responseBody";
import { sendValidationMail } from "../services/mailService";
import { hoursToMilliseconds } from "../helpers/timeConversion";
import { deleteEmailVerificationById, getEmailVerificationByToken, upsertEmailVerification } from "../db/emailVerifications";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: true,
      statusCode: 400,
      errorMessages: [],
    };
    
    const { email, password } = req.body;
    if (!email || !password) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [...resBody.errorMessages, "All fields are required."]
      }
      return res.status(resBody.statusCode).json(resBody).end();
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        statusCode: 404,
        errorMessages: [...resBody.errorMessages, "User not found."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        statusCode: 401,
        errorMessages: [...resBody.errorMessages, "Invalid password."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    if (!user.authentication.isVerified) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        statusCode: 401,
        errorMessages: [
          ...resBody.errorMessages,
          "The provided email is not verified.",
        ],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    // Create session token and save to database.
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie("vego-token", user.authentication.sessionToken, {
      maxAge: hoursToMilliseconds(12),
      domain: "localhost",
      path: "/",
    });

    const response: UserLoginResponse = {
      username: user.username,
      sharedRecipeIds: user.sharedRecipeIds,
      favoriteRecipeIds: user.favoriteRecipeIds,
      friendIds: user.friendIds,
    };

    resBody.statusCode = 200;
    resBody.result = response;
    return res.status(resBody.statusCode).json(resBody).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: true,
      statusCode: 400,
      errorMessages: [],
    };

    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [...resBody.errorMessages, "All fields are required."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    if (!checkPassword(password)) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [
          ...resBody.errorMessages,
          "Password doesn't match requirements.",
        ],
      };
    }

    const existingUserEmail = await getUserByEmail(email);
    if (existingUserEmail) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [
          ...resBody.errorMessages,
          "User with this email already exists.",
        ],
      };
    }

    const existingUserUsername = await getUserByUsername(username);
    if (existingUserUsername) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [
          ...resBody.errorMessages,
          "Provided user name is not available.",
        ],
      };
    }

    if (!resBody.isSuccessful) {
      return res.status(resBody.statusCode).json(resBody).end();
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    await createAndSendVerification(email);

    resBody.statusCode = 201;
    resBody.result = { message: `User ${username} successfully created.` };

    return res.status(resBody.statusCode).json(resBody).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const verifyEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: false,
      statusCode: 400,
      errorMessages: [],
    };
    
    const { token } = req.params;
    const emailVerification = await getEmailVerificationByToken(token);
    if (!emailVerification) {
      resBody = {
        ...resBody,
        statusCode: 404,
        errorMessages: [...resBody.errorMessages, "Invalid token."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    if (emailVerification.expirationTime < Date.now()){
      resBody = {
        ...resBody,
        statusCode: 403,
        errorMessages: [...resBody.errorMessages, "Token has expired."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    const user = await getUserByEmail(emailVerification.email);
    user.authentication.isVerified = true;
    await user.save();
    deleteEmailVerificationById(emailVerification._id.toString());
    
    resBody = {
      ...resBody,
      statusCode: 200,
      isSuccessful: true,
      result: "User email verified."
    };
    return res.status(resBody.statusCode).json(resBody).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const resendValidationMail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: false,
      statusCode: 400,
      errorMessages: [],
    };
    
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      resBody = {
        ...resBody,
        statusCode: 404,
        errorMessages: [...resBody.errorMessages, "Email not found."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    await createAndSendVerification(email);

    resBody = {
      ...resBody,
      statusCode: 200,
      isSuccessful: true,
      result: "User email verified."
    };
    return res.status(resBody.statusCode).json(resBody).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const createAndSendVerification = async (email: string) => {
  const expirationTime = Date.now() + hoursToMilliseconds(2); // Expiration time, 2 hours
  const verificationToken = verificationHash(email);
  const emailVerification = await upsertEmailVerification({
    email,
    token: verificationToken,
    expirationTime,
  });

  if (!emailVerification) {
    console.log("Failed to create emailVerification.");
  } else {
    const mail = await sendValidationMail(email, verificationToken);
    if (mail.accepted.length === 0) {
      console.log("Failed to send email:");
      console.log(mail);
    }
  }
}