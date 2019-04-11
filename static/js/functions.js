
// Function to choose the color of gas based on its size
function ChooseColor(value){
	if (value >= 1000) {
		return '#8b0000';
	}
	else if (value >= 500) {
		return '#aa0e27';
	}
	else if (value >= 100) {
		return '#c52940';
	}
	else if (value >= 50) {
		return '#db4551';
	}
	else if (value >= 20) {
		return '#ed645c';
	}
	else if (value >= 10) {
		return '#fa8266';
	}
	else if (value >= 5) {
		return '#ffa474';
	}
	else if (value >= 1) {
		return '#ffc58a';
	}
	else if (value >= 0.5) {
		return '#ffc58a';
	}
	else if (value >= 0.1) {
		return '#ffe3af';
	}
	else {
		return '#ffffe0';
	}
}
