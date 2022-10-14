const td = document.getElementById("td");
const tm = document.getElementById("tm");
const td_additional = document.getElementById("td-addional-i")
const initialise = () => {
	let lessons = data[0].data;
	let additional = data[0].additional;
	lessons.concat(data[1].data);
	additional.concat(data[1].additional);
	lessons.forEach((e) => {
		const div = document.createElement("div");
		div.innerHTML = e.info;
		if (e.type === "today") {
			td.append(div);
		}
		if (e.type === "tomorrow") {
			tm.append(div);
		}
	});
    
};

initialise();