type Product = {
	id: number;
	name: string;
	price: number;
	inStock: boolean;
};

const product1: Product = {
	id: 1,
	name: 'Product 1',
	price: 19.99,
	inStock: true,
};
const product2: Product = {
	id: 2,
	name: 'Product 1',
	price: 9.99,
	inStock: false,
};
const product3: Product = {
	id: 3,
	name: 'Product 1',
	price: 29.99,
	inStock: true,
};

const products: Product[] = [product1, product2, product3];

function getProductPrice(product: Product) {
	return products.find((p) => p.id === product.id)?.price || 0;
}

function Test() {
	return (
		<button onClick={() => console.log(getProductPrice(product1))}>
			Get Product 1 Price
		</button>
	);
}
export default Test;

console.log(getProductPrice(product1)); // Output: 19.99
