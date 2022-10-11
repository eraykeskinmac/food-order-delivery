export const GenerateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  const response = await client.message.create({
    body: `Your OTP is ${otp}`,
    from: '',
    to: `+91${toPhoneNumber}`,
  });

  return response;
};
