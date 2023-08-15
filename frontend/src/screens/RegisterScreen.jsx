import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";


const RegisterScreen = () => {

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [register, { isLoading }] = useRegisterMutation();

   const { userInfo } = useSelector(state => state.auth);

   const { search } = useLocation();
   const searchParams = new URLSearchParams(search);
   const redirect = searchParams.get('redirect') || '/';


   useEffect(() => {
      if (userInfo) {
         navigate(redirect);
      }
   }, [userInfo, navigate, redirect]);

   const formSubmitHandler = async event => {
      event.preventDefault();

      if (password !== confirmPassword) {
         toast.error('Passwords do not match');
         return;
      }

      else {

         try {
            const responseData = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ ...responseData }));
            navigate(redirect);
            toast.success('Registered successfully')
         } catch (err) {
            toast.error(err?.data?.message || err.error);
         }
      }
   };


   return (
      <FormContainer>
         <h1>Sign Up</h1>

         <Form onSubmit={formSubmitHandler}>

         <Form.Group controlId="name" className="my-3">
               <Form.Label>Name</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={event => setName(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-3">
               <Form.Label>Email Address</Form.Label>
               <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
               ></Form.Control>
            </Form.Group>
   
            <Form.Group controlId="password" className="my-3">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-3">
               <Form.Label> Confirm Password</Form.Label>
               <Form.Control
                  type="password"
                  placeholder="Enter Password again"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
               ></Form.Control>
            </Form.Group>
            
            <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
               Register
            </Button>

            {isLoading && <Loader />}
         </Form>

         <Row className="py-3">
            <Col>
               Already Registered? <Link to={redirect ? `/auth?redirect=${redirect}` : `/auth`}>
                  Log In
               </Link>
            </Col>
         </Row>
      </FormContainer>
   )
};

export default RegisterScreen;