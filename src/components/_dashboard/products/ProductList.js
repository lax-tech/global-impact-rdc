import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={
                {id: product.id,
                cover: product.image,
                name: product.name,
                price: product.price,
                priceSale: 0,
                colors: [
                  '#FFC107',
                  '#FF4842',
                  '#1890FF',
                ],
                status: product.status
              }
          } />
        </Grid>
      ))}
    </Grid>
  );
}
