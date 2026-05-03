export interface CategorySpend {
    category: string;
    amount: number;
    percentage: number;
}

export interface AnalysisResponse {
    totalBalanceInUSD: number;
    totalBalanceInTL: number;
    monthlyIncome: number;
    monthlyExpense: number;
    categoryDistribution: CategorySpend[];
}