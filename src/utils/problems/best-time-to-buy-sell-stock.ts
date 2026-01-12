import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function maxProfit(prices) {
  // Write your code here
};`;

const handler = (fn: any) => {
	try {
		const tests = [
			[7,1,5,3,6,4],
			[7,6,4,3,1],
		];
		const answers = [5, 0];

		for (let i = 0; i < tests.length; i++) {
			assert.strictEqual(fn(tests[i]), answers[i]);
		}
		return true;
	} catch (e:any) {
		throw new Error(e);
	}
};

export const bestTimeToBuySellStock: Problem = {
	id: "best-time-to-buy-sell-stock",
	title: "Best Time to Buy and Sell Stock",
	difficulty: "Easy",
	category: "Array",
	problemStatement: `<p>Find the maximum profit you can achieve from one transaction.</p>`,
	examples: [
		{ id: 1, inputText: "prices = [7,1,5,3,6,4]", outputText: "5" },
	],
	constraints: `<li>1 ≤ prices.length ≤ 10⁵</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function maxProfit(",
	order: 6,
};
