function normalizePrice(value) {
    if (typeof value === 'string') {
        return parseInt(value.replace(/\./g, '').replace(/\s/g, '')) || 0;
    }
    return parseInt(value) || 0;
}

function addAccessoryToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('phukien_cart')) || [];
    const normalizedPrice = normalizePrice(price);
    let item = cart.find(product => product.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name: name, price: normalizedPrice, quantity: 1 });
    }
    localStorage.setItem('phukien_cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng phụ kiện!');
}
