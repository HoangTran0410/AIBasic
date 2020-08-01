const congViec = [5, 6, 7, 8, 1, 2, 3, 5]
const soLuongMay = 4

function phanChiaCongViec(_congViec, _soLuongMay) {
	// tạo mảng máy
	let mangMay = []
	for(let i = 0; i < _soLuongMay; i++) {
		mangMay.push({
			id: i,
			dsCongViec: [],
			tongThoiGian: 0
		})
	}

	// phân công
	for(let i = 0; i < _congViec.length; i++) {
		let index = timViTriMayDangRanh(mangMay)

		mangMay[index].dsCongViec.push(_congViec[i])
		mangMay[index].tongThoiGian += _congViec[i]
	}

	//kết quả
	console.log(mangMay)
}

// tìm vị trí máy đang rảnh
function timViTriMayDangRanh(mangMay) {
	let index = 0
	let min = mangMay[index].tongThoiGian

	for(let i = 0; i < mangMay.length; i++) {
		if(mangMay[i].tongThoiGian < min) {
			min = mangMay[i].tongThoiGian
			index = i
		}
	}

	return index
}


phanChiaCongViec(congViec, soLuongMay)