const td = document.getElementById("td");
const tm = document.getElementById("tm");
const tm_heading = document.getElementById("tm-heading");
const td_additional = document.getElementById("td-addional-i");
const tm_additional = document.getElementById("tm-addional-i");
const initialise = () => {
	const lessons = [data[0].data, data[1].data];
	const additional = [data[0].additional, data[1].additional];
	tm_heading.textContent += `, ${data[1].date}`;
	lessons.forEach((e) => {
		e.forEach((e) => {
			const div = document.createElement("div");
			div.innerHTML = e.info;
			if (e.type === "today") {
				td.append(div);
			}
			if (e.type === "tomorrow") {
				tm.append(div);
			}
		});
	});
	additional.forEach((e) => {
		const div = document.createElement("div");
		div.innerHTML = e.info;
		if (e.type === "today") {
			td_additional.append(div);
		}
		if (e.type === "tomorrow") {
			tm_additional.append(div);
		}
	});
};

initialise();
