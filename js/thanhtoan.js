    function ktraten() {

        var ten = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)+$/;
        var ht = document.getElementById("txtht").value;
        if (ht === "") {
            document.getElementById("er1").innerHTML = "Không được để rỗng";
            return false;
        }
        if (ten.test(ht)) {
            document.getElementById("er1").innerHTML = "*";
            return true;
        } else {
            document.getElementById("er1").innerHTML = "Hãy nhập lại tên";
            return false;
        }
    }

    function ktradt() {
        var dt = /^0[3-9]{1}[\d]{8}$/;
        var sdt = document.getElementById("txtsdt").value;
        if (sdt === "") {
            document.getElementById("er2").innerHTML = "Không được để rỗng";
            return false;
        }
        if (dt.test(sdt)) {
            document.getElementById("er2").innerHTML = "*";
            return true;
        } else {
            document.getElementById("er2").innerHTML = "Hãy nhập lại số điện thoại";
            return false;
        }
    }

    function ktracccd() {
        var cccd = document.getElementById("txtcd").value.trim();

        var pattern = /^0\d{8}$|^0\d{11}$/;

        if (cccd === "") {
            document.getElementById("er3").innerHTML = "Không được để rỗng";
            return false;
        }

        if (pattern.test(cccd)) {
            document.getElementById("er3").innerHTML = "*";
            return true;
        } else {
            document.getElementById("er3").innerHTML = "Hãy nhập lại CCCD";
            return false;
        }
    }

    function hienThiGioHang() {
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        let body = document.getElementById("gioHangBody");
        let tong = 0;

        body.innerHTML = "";

        if (gioHang.length == 0) {
            body.innerHTML = `
            <tr>
                <td colspan="5" class="py-5 text-center">
                    Giỏ hàng đang còn trống.
                    <a href="danhsach.html">Mua ngay!</a>
                </td>
            </tr>
        `;

            document.getElementById("tamTinh").innerHTML = "0 VNĐ";
            document.getElementById("tongTien").innerHTML = "0 VNĐ";
            return;
        }

        gioHang.forEach((sp, index) => {
            let gia = normalizePrice(sp.gia);
            let thanhTien = gia * sp.soLuong;
            tong += thanhTien;

            // nếu là phụ kiện thì lấy ảnh phụ kiện
            // nếu là ô tô thì lấy ảnh xe
            let hinhAnh = "";

            if (sp.ten.includes("Bộ lọc") ||
                sp.ten.includes("Lốp") ||
                sp.ten.includes("Dầu") ||
                sp.ten.includes("phụ kiện") ||
                sp.ten.includes("âm thanh")) {

                hinhAnh = `../IMG/phukien${index + 1}.jpg`;

            } else {
                hinhAnh = `../img/car${index + 1}.jpg`;
            }

            body.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${hinhAnh}" 
                            class="rounded me-3" 
                            width="60" 
                            alt="${sp.ten}">
                        <strong>${sp.ten}</strong>
                    </div>
                </td>

                <td>
                    ${gia.toLocaleString("vi-VN")} VNĐ
                </td>

                <td>
                    <span class="badge bg-secondary p-2">
                        ${sp.soLuong}
                    </span>
                </td>

                <td class="fw-bold">
                    ${thanhTien.toLocaleString("vi-VN")} VNĐ
                </td>

                <td>
                    <button 
                        class="btn btn-sm btn-outline-danger"
                        onclick="xoaSanPham(${index})"
                    >
                        &times;
                    </button>
                </td>
            </tr>
        `;
        });

        document.getElementById("tamTinh").innerHTML =
            tong.toLocaleString("vi-VN") + " VNĐ";

        document.getElementById("tongTien").innerHTML =
            tong.toLocaleString("vi-VN") + " VNĐ";
    }

    function xoaSanPham(index) {
        let gioHang = JSON.parse(localStorage.getItem("gioHang"));
        gioHang.splice(index, 1);
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
        hienThiGioHang();
    }

    function xacNhanThanhToan() {

        let gioHang = JSON.parse(localStorage.getItem("gioHang"));

        if (!gioHang || gioHang.length == 0) {
            alert("Vui lòng thêm sản phẩm vào giỏ hàng!");
            return;
        }

        if ($('#payBank').is(':checked')) {

            let bank = $('input[name="bank"]:checked').attr("id");

            if (!bank) {
                alert("Vui lòng chọn ngân hàng!");
                return;
            }

            let tongTien = document.getElementById("tongTien").innerText;
            let qrData = "";

            switch (bank) {
                case "vcb":
                    qrData = "Vietcombank - Thanh toan don hang - " + tongTien;
                    break;

                case "tpb":
                    qrData = "Techcombank - Thanh toan don hang - " + tongTien;
                    break;

                case "vtb":
                    qrData = "Agribank - Thanh toan don hang - " + tongTien;
                    break;

                case "mbb":
                    qrData = "MB Bank - Thanh toan don hang - " + tongTien;
                    break;

                default:
                    qrData = "Thanh toan don hang - " + tongTien;
            }

            let qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(qrData);

            document.getElementById("qrImage").src = qrURL;

            let modal = new bootstrap.Modal(document.getElementById('qrModal'));
            modal.show();

        } else {
            // COD
            alert("Đặt hàng thành công! Thanh toán khi nhận xe.");
            localStorage.removeItem("gioHang");
            hienThiGioHang();
        }
    }


    $(document).ready(function() {

        $('input[name="payMethod"]').change(function() {
            if ($('#payBank').is(':checked')) {
                $('#bankSection').slideDown();
            } else {
                $('#bankSection').slideUp();
            }
        });

        $('#vatInvoicing').change(function() {
            if ($(this).is(':checked')) {
                $('#VAT').slideDown();
            } else {
                $('#VAT').slideUp();
            }
        });

        hienThiGioHang();
    });

    function hoanTat() {
        alert("Thanh toán thành công!");
        localStorage.removeItem("gioHang");
        hienThiGioHang();

        let modal = bootstrap.Modal.getInstance(document.getElementById('qrModal'));
        modal.hide();
    }

    function normalizePrice(value) {
        if (!value) return 0;

        if (typeof value === "string") {
            return parseInt(
                value
                .replace(/\./g, "")
                .replace(/,/g, "")
                .replace(/\s/g, "")
                .replace(/VNĐ|VND|đ/gi, "")
            ) || 0;
        }

        return parseInt(value) || 0;
    }