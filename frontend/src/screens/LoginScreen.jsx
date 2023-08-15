import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";


const LoginScreen = () => {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [login, { isLoading }] = useLoginMutation();

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
      
      try {
         const responseData = await login({ email, password }).unwrap();
         dispatch(setCredentials({ ...responseData }));
         navigate(redirect);
         toast.success('Logged in successfully')
      } catch (err) {
         toast.error(err?.data?.message || err.error);
      }
   };


   return (
      <FormContainer>
         <h1>Sign In</h1>

         <Form onSubmit={formSubmitHandler}>

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
            
            <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
               Sign In
            </Button>

            {isLoading && <Loader />}
         </Form>

         <Row className="py-3">
            <Col>
               New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
                  Register Now
               </Link>
            </Col>
         </Row>
      </FormContainer>
   )
};

export default LoginScreen;