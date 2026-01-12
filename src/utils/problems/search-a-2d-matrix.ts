import assert from "assert";
import { Problem } from "../types/problem";
import example1 from "./images/search-a-2d-1.jpg";
import example2 from "./images/search-a-2d-2.jpg";

/* =========================
   HANDLER FUNCTION
========================= */
const search2DMatrixHandler = (fn: any) => {
	try {
		const tests = [
			{
				matrix: [
					[1, 3, 5, 7],
					[10, 11, 16, 20],
					[23, 30, 34, 60],
				],
				target: 3,
			},
			{
				matrix: [
					[1, 3, 5, 7],
					[10, 11, 16, 20],
					[23, 30, 34, 60],
				],
				target: 13,
			},
		];

		const answers = [true, false];

		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i].matrix, tests[i].target);
			assert.strictEqual(result, answers[i]);
		}

		return true;
	} catch (error: any) {
		console.log("Error from search2DMatrixHandler:", error);
		throw new Error(error);
	}
};

/* =========================
   STARTER CODE
========================= */
const starterCodeSearch2DMatrixJS = `
// Do not edit function name
function searchMatrix(matrix, target) {
  // Write your code here
};`;

/* =========================
   PROBLEM EXPORT
========================= */
export const search2DMatrix: Problem = {
	id: "search-a-2d-matrix",
	title: "Search a 2D Matrix",

	difficulty: "Medium",
	category: "Binary Search / Matrix",

	problemStatement: `
<p class='mt-3'>
	Write an efficient algorithm that searches for a value in an <code>m x n</code> matrix.
</p>
<ul class='mt-3'>
	<li>Integers in each row are sorted from left to right.</li>
	<li>The first integer of each row is greater than the last integer of the previous row.</li>
</ul>
<p class='mt-3'>
	Given <code>matrix</code> and <code>target</code>, return <code>true</code> if the target exists,
	otherwise return <code>false</code>.
</p>
	`,

	examples: [
		{
			id: 0,
			inputText: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 3`,
			outputText: "true",
			img: example1.src,
		},
		{
			id: 1,
			inputText: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 13`,
			outputText: "false",
			img: example2.src,
		},
		{
			id: 2,
			inputText: "matrix = [[1]], target = 1",
			outputText: "true",
		},
	],

	constraints: `
<li><code>m == matrix.length</code></li>
<li><code>n == matrix[i].length</code></li>
<li><code>1 ≤ m, n ≤ 100</code></li>
<li><code>-10⁴ ≤ matrix[i][j], target ≤ 10⁴</code></li>
	`,

	starterCode: starterCodeSearch2DMatrixJS,
	handlerFunction: search2DMatrixHandler,
	starterFunctionName: "function searchMatrix",
	order: 5,
};
