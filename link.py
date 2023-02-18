<!DOCTYPE html>
<html>
<head>
	<title>Popup Example</title>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script>
		$(document).ready(function() {
			// Kiểm tra cookie để xem popup có nên được hiển thị
			if (getCookie('popup_shown') == null) {
				// Nếu cookie không tồn tại, hiển thị popup và đặt cookie
				$('#popup').show();
				setCookie('popup_shown', 'yes', 7); // Cookie sẽ hết hạn sau 7 ngày
			}

			// Xử lý sự kiện khi người dùng đăng ký kênh YouTube trên popup
			$('#youtube-button').click(function() {
				// Lưu trữ thông tin đăng ký trong cookie
				setCookie('youtube_subscribed', 'yes', 7);

				// Tải lại trang chủ để hiển thị liên kết tải tài liệu
				location.reload();
			});

			// Xử lý sự kiện khi người dùng nhấn nút xóa cookie
			$('#clear-cookie').click(function() {
				// Xóa cookie và làm mới trang
				deleteCookie('youtube_subscribed');
				location.reload();
			});
		});

		// Hàm đặt giá trị cookie
		function setCookie(name, value, days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		}

		// Hàm lấy giá trị cookie
		function getCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		}

		// Hàm xóa cookie
		function deleteCookie(name) {
			document.cookie = name + '=; Max-Age=-99999999;';
		}
	</script>
</head>
<body>
	<div id="popup" style="display: none;">
		<p>Nhấn vào liên kết dưới đây để đăng ký kênh YouTube của chúng tôi:</p>
		<a href="https://www.youtube.com/channel/UC...">Đăng ký kênh</a>
		<button id="youtube-button">Tôi đã đăng ký</button>
	</div>
<h1>Trang chủ</h1>
	<p>
	<!-- Kiểm tra xem người dùng đã đăng ký kênh YouTube hay chưa -->
	<?php if (isset($_COOKIE['youtube_subscribed'])) { ?>
		<a href="https://example.com/document.pdf">Tải tài liệu</a>
	<?php } else { ?>
		Đăng ký kênh YouTube để tải tài liệu:
		<a href="#popup">Mở popup</a>
	<?php } ?>
</p>
<button id="clear-cookie">Xóa cookie</button>
</body>
</html>