import React, { useState, useEffect } from 'react';
import { addToDb, getStoredCart, } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';
import { Button, Container, Row } from 'react-bootstrap';

const Shop = () => {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect(() => {
        fetch('./products.json')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setDisplayProducts(data);
            });
    }, []);

    useEffect(() => {
        if (products.length) {
            const saveCart = getStoredCart();
            const storedCart = []
            for (const id in saveCart) {
                const addProduct = products.find(product => product.id === id);
                if (addProduct) {
                    const quantity = saveCart[id];
                    addProduct.quantity = quantity;
                    storedCart.push(addProduct);
                }
            }
            setCart(storedCart);
        }
    }, [products])

    const handleAddToCart = (product) => {
        const exists = cart.find(pd => pd.id === product.id);
        let newCart = [];
        if (exists) {
            const remaining = cart.filter(pd => pd.id !== product.id);
            exists.quantity = exists.quantity + 1;
            newCart = [...remaining, product];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDb(product.id);
    }

    const handleSearch = event => {
        const searchText = (event.target.value);
        const matchedProduct = products.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase()));
        setDisplayProducts(matchedProduct);

    }
    return (
        <div className='bg-info'>
            <div className="search-container margin-top">
                <input
                    placeholder="Search Product"
                    onChange={handleSearch}
                    type="text"
                ></input>
            </div>
           
            <div className="shop-container">
           
                <Container >
                    <Row>
                            {
                                displayProducts.map(product => <Product
                                    key={product.id}
                                    product={product}
                                    handleAddToCart={handleAddToCart}
                                ></Product>)
                            }
                       
                    </Row>
                </Container>
                <div className="cart-container">
                    <Cart cart={cart} >
                        <Link to='/orders'>
                            <Button className="btn">Review Your Order</Button>
                        </Link>
                    </Cart>
                </div>
            </div>
        </div>

    );
};

export default Shop;