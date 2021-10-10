import React, { FormEvent } from "react";
import "./App.scss";
import currencies from "./currencies.json";
import Select from "react-select";
import { throwStatement } from "@babel/types";

const options: Array<{ value: string; label: string }> = [];
for (const i in currencies) {
	//@ts-ignore
	const c = currencies[i];
	options.push({ value: c.code, label: `${c.code} - ${c.description}` });
}
interface Props {}
class App extends React.Component<
	Props,
	{
		from: string;
		to: string;
		amount: number;
		result: {
			from: string;
			to: string;
			amount: number;
			converted: number;
			rate: number;
		};
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			from: "GBP",
			to: "USD",
			amount: 1,
			result: {
				from: "",
				to: "",
				amount: 0,
				converted: 0,
				rate: 0,
			},
		};
	}
	handleChangeFrom = (selectedOption: any) => {
		this.setState({ from: selectedOption.value });
	};
	handleChangeTo = (selectedOption: any) => {
		this.setState({ to: selectedOption.value });
	};
	switch = () => {
		this.setState({ from: this.state.to, to: this.state.from });
	};
	handleChangeInput = (event: any) => {
		//@ts-ignore
		const v = document.getElementById("quantity").value;
		if (!v) return;
		this.setState({ amount: v });
	};
	submit = (event: FormEvent) => {
		event.preventDefault();
		this.convert();
	};
	convert() {
		fetch(
			`https://api.exchangerate.host/convert?from=${this.state.from}&to=${this.state.to}&amount=${this.state.amount}`
		)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				this.setState({
					result: {
						from: res.query.from,
						to: res.query.to,
						amount: res.query.amount,
						converted: Math.round(res.result * 1000) / 1000,
						rate: Math.round(res.info.rate * 1000) / 1000,
					},
				});
			});
	}
	render() {
		return (
			<div className="App">
				<h1>Currency Converter</h1>
				<a
					href="https://github.com/cxllm/currency-converter"
					style={{
						fontSize: "20px",
					}}
				>
					Source Code
				</a>
				<table>
					<tr>
						<td>
							<h2>From</h2>
							<Select
								options={options}
								className="basic-single"
								defaultValue={options.find((c) => c.value === "GBP")}
								onChange={this.handleChangeFrom}
								value={
									options.find((c) => c.value === this.state.from) ||
									options.find((c) => c.value === "GBP")
								}
							/>
						</td>
						<td>
							<h2>To</h2>
							<Select
								options={options}
								className="basic-single"
								defaultValue={options.find((c) => c.value === "USD")}
								onChange={this.handleChangeTo}
								value={
									options.find((c) => c.value === this.state.to) ||
									options.find((c) => c.value === "USD")
								}
							/>
						</td>
					</tr>
				</table>

				<br />
				<button
					style={{
						backgroundColor: "#00aaff",
						border: "solid #00aaff",
						justifyContent: "center",
						fontSize: "20px",
						cursor: "pointer",
						padding: "10px",
						color: "white",
						fontFamily: "Poppins",
						borderRadius: "5px",
					}}
					onClick={this.switch}
				>
					Switch
				</button>
				<form onSubmit={this.submit}>
					<h2>Amount</h2>
					<input
						type="number"
						id="quantity"
						name="quantity"
						min="0.01"
						step="0.01"
						defaultValue="1"
						onChange={this.handleChangeInput}
						style={{
							border: "none",
							borderBottom: "2px solid #0af",
							backgroundColor: "inherit",
							color: "white",
							height: "40px",
							width: "200px",
							fontSize: "30px",
							fontFamily: "Poppins",
						}}
					/>
					<input
						type="submit"
						value="Convert"
						style={{
							backgroundColor: "inherit",
							width: "100px",
							height: "50px",
							border: "none",
							fontSize: "20px",
							cursor: "pointer",
							padding: "10px",
							color: "white",
							fontFamily: "Poppins",
						}}
					/>
				</form>
				<p className="convert">
					{this.state.result.converted
						? `${this.state.result.amount} ${this.state.result.from} = ${this.state.result.converted} ${this.state.result.to}`
						: ``}
				</p>
				<i className="rate">
					{this.state.result.rate
						? `Rate: 1 ${this.state.result.from} = ${this.state.result.rate} ${this.state.result.to}`
						: ``}
				</i>
			</div>
		);
	}
}

export default App;
