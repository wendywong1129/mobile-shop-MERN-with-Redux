import express from "express";
// import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import morgan from "morgan";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("server is running...");
});

// app.get("/api/products", (req, res) => {
//   res.json(products);
// });

// app.get("/api/products/:productId", (req, res) => {
//   const product = products.find(
//     (product) => product._id === req.params.productId
//   );
//   res.json(product);
// });

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// app.use((req, res, next) => {
//   const error = new Error(`Cannot find - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// });

// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(
    `Server is running at port:${PORT} under ${process.env.NODE_ENV}...`.yellow
      .bold
  );
});
