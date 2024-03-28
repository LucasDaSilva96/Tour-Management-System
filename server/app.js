const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "Lucas Da Silva jr",
    },
  });
});

module.exports = app;
