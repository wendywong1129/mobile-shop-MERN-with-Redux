import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserProfile, updateUserProfile } from "../actions/userActions";

import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, userInfo, error } = userProfile;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      if (!userInfo.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserProfile("profile"));
        setPassword("");
        setConfirmPassword("");
      } else {
        setName(userInfo.name);
        setEmail(userInfo.email);
      }
    }
  }, [dispatch, navigate, user, userInfo, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setMessage("Those passwords don't match");
      } else {
        setMessage("");
        // const updatedUser = { id: user._id, name, email, password };
        // dispatch(updateUserProfile(updatedUser));
        dispatch(updateUserProfile({ id: user._id, name, email, password }));
      }
    } else {
      setMessage("Please input and confirm your password");
    }
  };

  return (
    <FormContainer>
      <h2>My Profile</h2>
      {success && <Message variant="success">Update successfully</Message>}
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Please enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Please enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Please enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Please confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Profile
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProfilePage;
