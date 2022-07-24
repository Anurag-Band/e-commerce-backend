const BigPromise = require("../middlewares/BigPromise");

exports.home = BigPromise(async (req, res) => {
  // const db = await something();
  res.status(200).json({
    success: true,
    greeting: "Hello from Home Route",
  });
});

exports.about = (req, res) => {
  try {
    // const db = await something();
    res.status(200).json({
      success: true,
      greeting: "This is About Section",
    });
  } catch (error) {
    console.log(error);
  }
};
