import { Problem } from "../types/problem";

/* ========= BASE PROBLEMS ========= */
import { twoSum } from "./two-sum";
import { reverseLinkedList } from "./reverse-linked-list";
import { jumpGame } from "./jump-game";
import { validParentheses } from "./valid-parentheses";
import { search2DMatrix } from "./search-a-2d-matrix";

/* ========= FIRST EXPANSION ========= */
import { bestTimeToBuySellStock } from "./best-time-to-buy-sell-stock";
import { containsDuplicate } from "./contains-duplicate";
import { binarySearch } from "./binary-search";
import { maximumSubarray } from "./maximum-subarray";
import { mergeIntervals } from "./merge-intervals";

/* ========= SECOND EXPANSION (10 MORE) ========= */
import { validAnagram } from "./valid-anagram";
import { mergeSortedArray } from "./merge-sorted-array";
import { climbingStairs } from "./climbing-stairs";
import { invertBinaryTree } from "./invert-binary-tree";
import { twoSumII } from "./two-sum-ii";
import { productExceptSelf } from "./product-of-array-except-self";
import { longestSubstring } from "./longest-substring-without-repeating";
import { numberOfIslands } from "./number-of-islands";
import { trappingRainWater } from "./trapping-rain-water";
import { medianSortedArrays } from "./median-of-two-sorted-arrays";

/* ========= MAP ========= */
interface ProblemMap {
	[key: string]: Problem;
}

export const problems: ProblemMap = {
	// Base
	"two-sum": twoSum,
	"reverse-linked-list": reverseLinkedList,
	"jump-game": jumpGame,
	"valid-parentheses": validParentheses,
	"search-a-2d-matrix": search2DMatrix,

	// Expansion 1
	"best-time-to-buy-sell-stock": bestTimeToBuySellStock,
	"contains-duplicate": containsDuplicate,
	"binary-search": binarySearch,
	"maximum-subarray": maximumSubarray,
	"merge-intervals": mergeIntervals,

	// Expansion 2
	"valid-anagram": validAnagram,
	"merge-sorted-array": mergeSortedArray,
	"climbing-stairs": climbingStairs,
	"invert-binary-tree": invertBinaryTree,
	"two-sum-ii": twoSumII,
	"product-of-array-except-self": productExceptSelf,
	"longest-substring-without-repeating": longestSubstring,
	"number-of-islands": numberOfIslands,
	"trapping-rain-water": trappingRainWater,
	"median-of-two-sorted-arrays": medianSortedArrays,
};
