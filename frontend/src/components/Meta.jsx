import { Helmet } from "react-helmet-async";


const Meta = ({ title, description, keywords }) => {
   return (
      <Helmet>
         <title>{title}</title>
         <meta name="description" content={description} />
         <meta name="keywords" content={keywords} />
      </Helmet>
   )
};


Meta.defaultProps = {
   title: 'Welcome to UrbanShop',
   description: 'We sell the best products at an affordable price',
   keywords: 'clothing, appearels, electronics, cosmetics, buy, cheap'
};

export default Meta;