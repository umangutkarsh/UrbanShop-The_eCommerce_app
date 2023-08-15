import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../slices/cartSlice";


const ShippingScreen = () => {

   const cart = useSelector(state => state.cart);
   const { shippingAddress } = cart;

   const [address, setAddress] = useState(shippingAddress?.address || '');
   const [city, setCity] = useState(shippingAddress?.city || '');
   const [state, setState] = useState(shippingAddress?.state || '');
   const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
   const [country, setCountry] = useState(shippingAddress?.country || '');

   const dispatch = useDispatch();
   const navigate = useNavigate();
 

   const formSubmitHandler = event => {
      event.preventDefault();
      
      dispatch(saveShippingAddress({ address, city, state, postalCode, country }));
      console.log(shippingAddress);
      navigate('/payment');
   };


   return (
      <FormContainer>
         <CheckoutSteps step1 step2 />

         <h1>Shipping Address</h1>

         <Form onSubmit={formSubmitHandler}>

            <Form.Group controlId="address" className="my-2">
               <Form.Label>Address</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={event => setAddress(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="city" className="my-2">
               <Form.Label>City</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={event => setCity(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="state" className="my-2">
               <Form.Label>State</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter your state"
                  value={state}
                  onChange={event => setState(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="postalCode" className="my-2">
               <Form.Label>Postal Code</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={event => setPostalCode(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Form.Group controlId="country" className="my-2">
               <Form.Label>Country</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter your country"
                  value={country}
                  onChange={event => setCountry(event.target.value)}
               ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
               Continue
            </Button>
         </Form>
      </FormContainer>
   )
}

export default ShippingScreen;