const nodeMailer = require("nodemailer");

const mailTransport = () => {
  nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
};
const generateUniqueOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  // Generate a random 3-character string
  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  );

  // Generate a random 3-digit number
  const randomNumbers = Array.from({ length: 3 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  );

  // Concatenate letters and numbers to form the uniqueOrderId
  return randomLetters.join("") + randomNumbers.join("");
};
const CreateOrderTemplate = (firstName, orderId, productName, image, size) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge
"><style>
@media only screen and (max-width:620px){
    h1{
        font-size:20px;
        padding:5px;
    }
}
.email-header{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 46px; /* 143.75% */
    text-transform: capitalize;
    background: rgba(54, 42, 65, 0.10);
    padding:20px;
    display:flex;
    gap:40px;
}
.email-content{
    color: #686868;
    leading-trim: both;
    text-edge: cap;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background: rgba(54, 42, 65, 0.10);
    opacity:0.75;
    padding:20px;
    margin-top:-10px;
}
.email-content > span{
    display:block;
    margin-top:10px;
}
.email-footer{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background-color: #fff;
    padding:20px;
    margin-bottom:-40px;
}
.email-footer > span{
    display:block;
    margin-top:10px;
}
.header-logo{
    padding:20px;
    box-shadow:0px 4px 8px 0px #362a411a;
}
.image{
  width:100px;
  height:100px
}
</style>
</head>
<body>
<div>
<div style="max-width:620px;margin:0 auto;font-family:sans-serif;color:#272727;
">
<div class="header-logo">

</div>
<div class="email-header" >
<div style="margin-left:30px"> Order Placed on ByPort</div>
</div>

<div class="email-content">
<div>Dear ${firstName}</div>
<span>We are thrilled to announce the Your Order Has been placed successful  ${orderId} and ${productName} ${size} Plesae keep patient until we shipped your order</span>
<img src={${image}} class="image"/>
</div>


<div class="email-content">We invite you to explore the exciting product from our website .
Your feedback is valuable to us, so please feel free to share your thoughts or any suggestions you may have. We are committed to continuously improving our online presence to better serve you.
Thank you for your ongoing support. We look forward to engaging with you on Byport!</div>
<div class="email-footer">For queries kindly reach out to <a href="mailto:support@thebyport.com style="color: #87CEEB; text-decoration: underline";>support@byport.com</a>
.Best Regards <span style="margin-top:5px">ByPort Team</span></div> 
</div>
</div>
</body>

</html>
    `;
};
const UpdateOrderTemplate = (
  firstName,
  status,
  orderId,
  productName,
  image
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge
"><style>
@media only screen and (max-width:620px){
    h1{
        font-size:20px;
        padding:5px;
    }
}
.email-header{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 46px; /* 143.75% */
    text-transform: capitalize;
    background: rgba(54, 42, 65, 0.10);
    padding:20px;
    display:flex;
    gap:40px;
}
.email-content{
    color: #686868;
    leading-trim: both;
    text-edge: cap;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background: rgba(54, 42, 65, 0.10);
    opacity:0.75;
    padding:20px;
    margin-top:-10px;
}
.email-content > span{
    display:block;
    margin-top:10px;
}
.email-footer{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background-color: #fff;
    padding:20px;
    margin-bottom:-40px;
}
.email-footer > span{
    display:block;
    margin-top:10px;
}
.header-logo{
    padding:20px;
    box-shadow:0px 4px 8px 0px #362a411a;
}
.image{
  width:100px;
  height:100px
}
</style>
</head>
<body>
<div>
<div style="max-width:620px;margin:0 auto;font-family:sans-serif;color:#272727;
">
<div class="header-logo">

</div>
<div class="email-header" >
<div style="margin-left:30px"> Order Placed on ByPort</div>
</div>

<div class="email-content">
<div>Dear ${firstName}</div>
<span>We are thrilled to announce the Your Order Has been ${status} successful  ${orderId} and ${productName} Plesae keep patient until we shipped your order</span>
<img src={${image}} class="image"/>
</div>


<div class="email-content">We invite you to explore the exciting product from our website .
Your feedback is valuable to us, so please feel free to share your thoughts or any suggestions you may have. We are committed to continuously improving our online presence to better serve you.
Thank you for your ongoing support. We look forward to engaging with you on Byport!</div>
<div class="email-footer">For queries kindly reach out to <a href="mailto:support@thebyport.com style="color: #87CEEB; text-decoration: underline";>support@byport.com</a>
.Best Regards <span style="margin-top:5px">ByPort Team</span></div> 
</div>
</div>
</body>

</html>
    `;
};
const UpdateDeliveryTemplate = (
  firstName,
  status,
  orderId,
  productName,
  image,
  size,
  delivery
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge
"><style>
@media only screen and (max-width:620px){
    h1{
        font-size:20px;
        padding:5px;
    }
}
.email-header{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 46px; /* 143.75% */
    text-transform: capitalize;
    background: rgba(54, 42, 65, 0.10);
    padding:20px;
    display:flex;
    gap:40px;
}
.email-content{
    color: #686868;
    leading-trim: both;
    text-edge: cap;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background: rgba(54, 42, 65, 0.10);
    opacity:0.75;
    padding:20px;
    margin-top:-10px;
}
.email-content > span{
    display:block;
    margin-top:10px;
}
.email-footer{
    color: #362A41;
    font-family: Visby CF,sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.5px; /* 187.5% */
    background-color: #fff;
    padding:20px;
    margin-bottom:-40px;
}
.email-footer > span{
    display:block;
    margin-top:10px;
}
.header-logo{
    padding:20px;
    box-shadow:0px 4px 8px 0px #362a411a;
}
.image{
  width:100px;
  height:100px
}
</style>
</head>
<body>
<div>
<div style="max-width:620px;margin:0 auto;font-family:sans-serif;color:#272727;
">
<div class="header-logo">

</div>
<div class="email-header" >
<div style="margin-left:30px"> Order Placed on ByPort</div>
</div>

<div class="email-content">
<div>Dear ${firstName}</div>
<span>We are thrilled to announce the Your Order Has been ${status} successful  ${orderId} and ${productName} ${size} Plesae keep patient until we delievered your order on this date ${delivery}</span>
<img src={${image}} class="image"/>
</div>


<div class="email-content">We invite you to explore the exciting product from our website .
Your feedback is valuable to us, so please feel free to share your thoughts or any suggestions you may have. We are committed to continuously improving our online presence to better serve you.
Thank you for your ongoing support. We look forward to engaging with you on Byport!</div>
<div class="email-footer">For queries kindly reach out to <a href="mailto:support@thebyport.com style="color: #87CEEB; text-decoration: underline";>support@byport.com</a>
.Best Regards <span style="margin-top:5px">ByPort Team</span></div> 
</div>
</div>
</body>

</html>
    `;
};
module.exports = {
  CreateOrderTemplate,
  mailTransport,
  UpdateOrderTemplate,
  UpdateDeliveryTemplate,
};
