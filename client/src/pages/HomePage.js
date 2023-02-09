// import React, { useState, useEffect } from "react";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { Row, Col } from "react-bootstrap";
// import products from "../products";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductsCarousel from "../components/ProductsCarousel";
// import { Helmet } from "react-helmet";
import Meta from "../components/Meta";
// import axios from "axios";

const Home = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const getProducts = async () => {
  //     // const res = await axios.get("/api/products");
  //     // console.log(res);
  //     const { data } = await axios.get("/api/products");
  //     // console.log(data);
  //     setProducts(data);
  //   };
  //   getProducts();
  // }, []);
  const { keyword, pageNumber } = useParams();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  // const { loading, products, error } = productList;
  const { loading, products, pages, page, error } = productList;

  useEffect(() => {
    // dispatch(listProducts());
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      {/* <Helmet>
        <title>Welcome to Mobile Shop</title>
        <meta name="description" content="The best online mobile shop"></meta>
        <meta name="keywords" content="e-commerce mobile"></meta>
      </Helmet> */}
      <Meta />
      {!keyword ? (
        <ProductsCarousel />
      ) : (
        <Link to="/" className="btn btn-dark mb-3">
          Back to Previous Page
        </Link>
      )}
      <h1>Newest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
