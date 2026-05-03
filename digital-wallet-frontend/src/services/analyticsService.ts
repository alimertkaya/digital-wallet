import api from "../api";
import { AnalysisResponse } from "../types/analytics";

export const getMonthlyAnalysis = async (): Promise<AnalysisResponse> => {
    const response = await api.get('/analytics/monthly');
    return response.data;
};