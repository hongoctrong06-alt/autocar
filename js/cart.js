function normalizePrice(value) {
    if (typeof value === 'string') {
        return parseInt(value.replace(/\./g, '').replace(/\s/g, '')) || 0;
    }
    return parseInt(value) || 0;
}


function addToCart(ten, gia) {

    let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];

    let tonTai = gioHang.find(sp => sp.ten == ten);

    if (tonTai) {
        tonTai.soLuong++;
    } else {
        gioHang.push({
            ten: ten,
            gia: gia,
            soLuong: 1
        });
    }

    localStorage.setItem("gioHang", JSON.stringify(gioHang));

    alert("Đã thêm vào giỏ hàng!");

}