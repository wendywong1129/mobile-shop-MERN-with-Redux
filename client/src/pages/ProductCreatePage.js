import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductCreatePage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, success, error } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/admin/productList`);
    }
  }, [dispatch, navigate, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multerpart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <FormContainer>
      <Link to="/admin/productList" className="btn btn-dark my-2">
        Back to Previous Page
      </Link>
      <h1>Create Product</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Please input the name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="price" className="my-2">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Please input the price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="image" className="my-2">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="text"
            placeholder="Please input the image path"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control type="file" onChange={uploadFileHandler}></Form.Control>
          {uploading && <Loader />}
        </Form.Group>
        <Form.Group controlId="brand" className="my-2">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            placeholder="Please input the brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          ></Form.Control>
        </Form.Group>{" "}
        <Form.Group controlId="countInStock" className="my-2">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            type="number"
            placeholder="Please input the count in stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="category" className="my-2">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Please input the category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="description" className="my-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Please input the description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Create
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProductCreatePage;
